import { useEffect, useContext, useRef, useState, useCallback } from 'react';
import Feature, { FeatureLike } from 'ol/Feature';
import Select from 'ol/interaction/Select';
import { createBox } from 'ol/interaction/Draw';
import { Draw, Snap, Modify } from 'ol/interaction';
import { Condition } from 'ol/events/condition';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import Style from 'ol/style/Style';
import { ModifyEvent } from 'ol/interaction/Modify';
import { useTranslation } from 'react-i18next';
import { DRAWTOOLTYPE, DrawSegmentGuard } from './types';
import MapContext from '../../MapContext';
import useDrawContext from './useDrawContext';
import {
  areLinesInPolygonIntersecting,
  getSurfaceArea,
  isPolygonSelfIntersecting,
} from '../../utils';
import { styleFunction } from '../../../../../domain/map/utils/geometryStyle';
import { Map, MapBrowserEvent } from 'ol';
import { useGlobalNotification } from '../../../globalNotification/GlobalNotificationContext';

type Props = {
  onSelfIntersectingPolygon?: (feature: Feature<Geometry> | null) => void;
  drawCondition?: Condition;
  drawFinishCondition?: (event: MapBrowserEvent<UIEvent>, feature: Feature) => boolean;
  drawStyleFunction?: (map: Map, feature: FeatureLike) => Style | Style[];
  drawSegmentGuard?: DrawSegmentGuard;
  handleModifyEnd?: (
    event: ModifyEvent,
    originalFeature: Feature | null,
    modifiedFeature: Feature,
  ) => void;
  onGeometryFinalized?: () => void;
};

type Interaction = Draw | Snap | Modify;

export default function DrawInteraction({
  onSelfIntersectingPolygon,
  drawCondition,
  drawFinishCondition,
  drawStyleFunction,
  drawSegmentGuard,
  handleModifyEnd,
  onGeometryFinalized,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();
  const selection = useRef<null | Select>(null);
  const { map } = useContext(MapContext);
  const { state, actions, source } = useDrawContext();
  const [instances, setInstances] = useState<Interaction[]>([]);
  const modify = useRef<null | Modify>(null);

  const drawnFeature = useRef<null | Feature>(null);
  const originalModifiedFeature = useRef<null | Feature>(null);
  const lastCoordinateCount = useRef<number>(0);

  const clearSelection = useCallback(() => {
    if (selection.current) selection.current.getFeatures().clear();
    actions.setSelectedFeature(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeDrawInteractions = useCallback(() => {
    instances.forEach((i: Interaction) => {
      map?.removeInteraction(i);
    });
  }, [instances, map]);

  const removeAllInteractions = useCallback(() => {
    removeDrawInteractions();
  }, [removeDrawInteractions]);

  const startDraw = useCallback(
    (type = DRAWTOOLTYPE.POLYGON) => {
      if (!map || state.selectedDrawtoolType === null || process.env.NODE_ENV === 'test') {
        return;
      }

      let geometryFunction;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let geometryType: any = type;
      if (type === DRAWTOOLTYPE.SQUARE) {
        geometryFunction = createBox();
        geometryType = 'Circle';
      }

      // Ref to allow finishCondition to access interaction instance (assigned post-construction)
      const currentDrawRef = {
        current: null as Draw | null,
      } as React.MutableRefObject<Draw | null>;

      const drawInstance = new Draw({
        source,
        type: geometryType,
        geometryFunction,
        condition: drawCondition,
        style: drawStyleFunction ? (feature) => drawStyleFunction(map, feature) : undefined,
        finishCondition(event) {
          if (
            drawnFeature.current &&
            drawFinishCondition &&
            !drawFinishCondition(event, drawnFeature.current)
          ) {
            return false;
          }

          const modifiedPolygon: Polygon = drawnFeature.current?.getGeometry() as Polygon;
          if (modifiedPolygon) {
            const surfaceArea = getSurfaceArea(modifiedPolygon);
            // Don't allow drawing to be finished if its
            // surface area is below 1
            if (surfaceArea < 1) {
              return false;
            }
            const currentCoordinates = modifiedPolygon.getCoordinates();
            // During active drawing OL structure is typically: [p0, p1, ..., pn, cursor, p0].
            // Just before finishing (depending on internal OL timing) the geometry provided to finishCondition
            // may already have dropped the live cursor, yielding: [p0, p1, ..., pn, p0].
            // We need to distinguish these two shapes to build the committed user ring reliably.
            const ring = currentCoordinates[0];
            const first = ring[0];
            const last = ring[ring.length - 1];
            const isAlreadyClosed = first[0] === last[0] && first[1] === last[1];
            // If structure has cursor, length >= 4 and second to last is cursor; otherwise it's already closed.
            // Heuristic: if closed and there are at least 4 points, treat (ring.length - 1) as committed count.
            // Else subtract 2 (cursor + closing p0).
            const committedCount = isAlreadyClosed ? ring.length - 1 : ring.length - 2;
            if (committedCount < 3) return false; // insufficient points for polygon
            const userDrawnRing = [...ring.slice(0, committedCount)];
            // Intersection check on the committed edges only (implicit closing segment evaluated separately on drawend or by turf if needed)
            if (areLinesInPolygonIntersecting([userDrawnRing])) {
              // Remove the last inserted point so user can continue adjusting
              // We rely on OpenLayers keeping the drawing interaction active.
              try {
                // drawInstance is not yet assigned at creation time; we set a ref below and use it here.
                currentDrawRef.current?.removeLastPoint();
                // Adjust internal count so next added point is validated correctly
                lastCoordinateCount.current = Math.max(0, lastCoordinateCount.current - 1);
              } catch {
                /* ignore remove errors */
              }
              setNotification(true, {
                position: 'top-right',
                dismissible: true,
                autoClose: true,
                autoCloseDuration: 5000,
                label: t('map:notifications:selfIntersectingLabel'),
                message: t('map:notifications:selfIntersectingText'),
                type: 'alert',
                closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
              });
              return false; // Block finishing
            }
          }
          return true;
        },
      });
      currentDrawRef.current = drawInstance;
      drawInstance.on('drawstart', (event) => {
        selection.current?.setActive(false);
        lastCoordinateCount.current = 0; // Reset coordinate count for new drawing
        event.feature.on('change', (changeEvent) => {
          const currentFeature = event.feature;
          const modifiedPolygon: Polygon = currentFeature.getGeometry() as Polygon;
          const currentCoordinates = modifiedPolygon.getCoordinates();

          // current coordinates contain always 3 points.
          // When starting drawing polygon, OL adds 2 coordinates to form a polygon
          //    1. point is start point for the polygon
          //    a minimum of 3 coordinates are needed to form a polygon
          // Number of actual drawn points is array length - 2 because
          //    2. last point is the cursor position (that is in this context same as last drawn point)
          //    last point is to link the starting point to get full polygon

          // Only validate when a new point is actually added (not just cursor movement)
          const actualPointCount = currentCoordinates[0].length - 2; // Exclude cursor position and starting point link
          // Only process change events that are triggered by user interaction (mouse clicks i.e. new point is added)
          if (actualPointCount <= lastCoordinateCount.current) {
            return; // No new point added, just cursor movement
          }
          lastCoordinateCount.current = actualPointCount;

          // NEW: Guard against leaving the hanke area while drawing
          if (drawSegmentGuard && actualPointCount >= 2) {
            const ring = currentCoordinates[0];
            // Get the actual segment between the last two fixed points (ignoring cursor)
            const start = ring[actualPointCount - 2];
            const end = ring[actualPointCount - 1];
            const ok = drawSegmentGuard(map, [start, end]);
            if (!ok) {
              // Disallow this segment: revert last point
              drawInstance.removeLastPoint();
              lastCoordinateCount.current = actualPointCount - 1; // Update count after removal
              // Show notification for not allowed to draw outside hanke area
              setNotification(true, {
                position: 'top-right',
                dismissible: true,
                autoClose: true,
                autoCloseDuration: 5000,
                label: t('map:notifications:drawingOutsideHankeAreaLabel'),
                message: t('map:notifications:drawingOutsideHankeAreaText'),
                type: 'alert',
                closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
              });
              return;
            }
          }
          // Check for self-intersection with the actual drawn points (excluding cursor position)
          // OpenLayers creates minimum set of 3 coordinates when draw starts for polygon.
          // We need only the user drawn coordinates, excluding:
          //  - the automatic closing link to the start
          //  - the live cursor position
          // Use a non-mutating copy to avoid altering OL's internal coordinate array (HAI-3310 regression guard).
          // Build ring of only committed user points (exclude live cursor and auto-added closing point).
          // OpenLayers structure: [p0, p1, ..., pn, cursor, p0] during drawing.
          // We want [p0, p1, ..., pn] for incremental self-intersection checks.
          const committedCount = currentCoordinates[0].length - 2; // exclude cursor + closing p0
          const userDrawnRing = [...currentCoordinates[0].slice(0, committedCount)];
          const intersecting: boolean = areLinesInPolygonIntersecting([userDrawnRing]);
          if (intersecting) {
            drawInstance.removeLastPoint();
            lastCoordinateCount.current = actualPointCount - 1; // Update count after removal
            setNotification(true, {
              position: 'top-right',
              dismissible: true,
              autoClose: true,
              autoCloseDuration: 5000,
              label: t('map:notifications:selfIntersectingLabel'),
              message: t('map:notifications:selfIntersectingText'),
              type: 'alert',
              closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
            });
            return;
          }
          drawnFeature.current = changeEvent.target;
        });
      });

      drawInstance.on('drawend', (event) => {
        selection.current?.setActive(true);

        const isSelfIntersecting = isPolygonSelfIntersecting(
          event.feature.getGeometry() as Polygon,
        );

        if (onSelfIntersectingPolygon && isSelfIntersecting) {
          onSelfIntersectingPolygon(event.feature);
        }

        clearSelection();
        actions.setSelectedDrawToolType(null);
        try {
          onGeometryFinalized?.();
        } catch {
          /* ignore */
        }
      });

      map.addInteraction(drawInstance);

      setInstances([drawInstance]);
    },
    [
      map,
      source,
      state.selectedDrawtoolType,
      actions,
      clearSelection,
      onSelfIntersectingPolygon,
      drawCondition,
      drawFinishCondition,
      drawStyleFunction,
      drawSegmentGuard,
      t,
      setNotification,
      onGeometryFinalized,
    ],
  );

  useEffect(() => {
    if (!map || !source || process.env.NODE_ENV === 'test') return;
    let originalGeometry: Polygon;
    modify.current = new Modify({ source });
    map.addInteraction(modify.current);

    modify.current.on('modifystart', (event) => {
      const currentFeature = event.features.item(0) as Feature<Polygon>;
      originalGeometry = currentFeature.getGeometry()?.clone() as Polygon;
      originalModifiedFeature.current = currentFeature.clone();
    });

    modify.current.on('modifyend', (event) => {
      // if modify would result into self intersecting polygon, revert to original geometry
      const modifiedFeature = event.features.item(0) as Feature<Polygon>;
      const modifiedPolygon: Polygon = modifiedFeature.getGeometry() as Polygon;

      if (isPolygonSelfIntersecting(modifiedPolygon)) {
        modifiedPolygon.setCoordinates(originalGeometry.getCoordinates());
        // Show notification for self-intersecting polygon
        setNotification(true, {
          position: 'top-right',
          dismissible: true,
          autoClose: true,
          autoCloseDuration: 5000,
          label: t('map:notifications:selfIntersectingLabel'),
          message: t('map:notifications:selfIntersectingText'),
          type: 'alert',
          closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
        });
      } else {
        handleModifyEnd?.(event, originalModifiedFeature.current, modifiedFeature);
        try {
          onGeometryFinalized?.();
        } catch {
          /* ignore */
        }
      }
    });

    source.on('removefeature', () => {
      clearSelection();

      const selfIntersectingFeature = source
        .getFeatures()
        .find((feature) => isPolygonSelfIntersecting(feature.getGeometry() as Polygon));

      if (onSelfIntersectingPolygon && !selfIntersectingFeature) {
        onSelfIntersectingPolygon(null);
      }
    });

    selection.current = new Select({
      style: (feature) => styleFunction(feature, undefined, true),
    });

    map.addInteraction(selection.current);
    // When adding new select interaction, push selected feature to select collection
    // from state if it exists
    if (state.selectedFeature) {
      selection.current.getFeatures().push(state.selectedFeature);
    }

    selection.current.on('select', (e) => {
      const features = e.selected;
      const feature: Feature<Geometry> = features[0];

      if (feature && feature.getGeometry() instanceof Polygon) {
        actions.setSelectedFeature(feature);
      } else {
        clearSelection();
      }
    });

    // eslint-disable-next-line consistent-return
    return function cleanUp() {
      if (modify.current) {
        map.removeInteraction(modify.current);
      }
      if (selection.current) {
        map.removeInteraction(selection.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, source, t, setNotification]);

  useEffect(() => {
    removeAllInteractions();
    if (state.selectedDrawtoolType) {
      // When drawing, deactivate modify interaction
      modify.current?.setActive(false);
      startDraw(state.selectedDrawtoolType);
    } else {
      modify.current?.setActive(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedDrawtoolType]);

  useEffect(() => {
    // When selected feature changes, clear selection and push new selected feature
    // to select collection, so that it is highlighted
    selection.current?.getFeatures().clear();
    if (state.selectedFeature) {
      selection.current?.getFeatures().push(state.selectedFeature);
    }
  }, [state.selectedFeature]);

  // Unmount
  useEffect(() => {
    if (!map) return;

    // eslint-disable-next-line
    return () => removeAllInteractions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
