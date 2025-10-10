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
  // New props for sub hanke area selection flow
  getSubAreasAtCoordinate?: (map: Map, coord: number[]) => Feature<Polygon>[];
  onRequestSubAreaSelection?: (
    candidates: Feature<Polygon>[],
    helpers: { confirm: (feature: Feature<Polygon>) => void; cancel: () => void },
  ) => void;
  onSubAreaSelected?: (feature: Feature<Polygon>) => void;
  onSubAreaSelectionCanceled?: () => void;
  allowLegacyDrawSegmentGuard?: boolean; // keep existing guard invocation after new area checks if desired
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
  getSubAreasAtCoordinate,
  onRequestSubAreaSelection,
  onSubAreaSelected,
  onSubAreaSelectionCanceled,
  allowLegacyDrawSegmentGuard,
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
  // New state for chosen sub area
  const [chosenSubArea, setChosenSubArea] = useState<Feature<Polygon> | null>(null);
  const firstPointRef = useRef<number[] | null>(null);
  // Mirror refs to avoid stale closure in OL change handlers
  const chosenSubAreaRef = useRef<Feature<Polygon> | null>(null);
  const pendingSubAreaSelectionRef = useRef<boolean>(false);
  const hasStartedRef = useRef<boolean>(false);
  // Pending selection handled via ref; expose setter for internal usage
  const setPendingSubAreaSelection = (val: boolean) => {
    pendingSubAreaSelectionRef.current = val;
  };

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

      const composedCondition: Condition = (evt) => {
        const baseOk = drawCondition ? drawCondition(evt) : true;
        if (!baseOk) return false;
        // If drawing already started or no sub area logic, allow
        if (hasStartedRef.current || !getSubAreasAtCoordinate) return true;
        // If user already selected a sub area (from multi-area selection), allow start
        if (chosenSubAreaRef.current) return true;
        const candidates = getSubAreasAtCoordinate(map!, evt.coordinate) || [];
        if (candidates.length === 0) {
          // Block start silently
          return false;
        }
        if (candidates.length === 1) {
          setChosenSubArea(candidates[0]);
          chosenSubAreaRef.current = candidates[0];
          onSubAreaSelected?.(candidates[0]);
          return true;
        }
        // Multiple: request user selection, do not start yet
        firstPointRef.current = evt.coordinate;
        setPendingSubAreaSelection(true);
        pendingSubAreaSelectionRef.current = true;
        onRequestSubAreaSelection?.(candidates, {
          confirm: (feature) => {
            try {
              const poly = feature.getGeometry() as Polygon;
              if (!poly.intersectsCoordinate(firstPointRef.current!)) {
                setPendingSubAreaSelection(false);
                pendingSubAreaSelectionRef.current = false;
                firstPointRef.current = null;
                onSubAreaSelectionCanceled?.();
                return;
              }
              setChosenSubArea(feature);
              chosenSubAreaRef.current = feature;
              setPendingSubAreaSelection(false);
              pendingSubAreaSelectionRef.current = false;
              onSubAreaSelected?.(feature);
            } catch {
              setPendingSubAreaSelection(false);
              pendingSubAreaSelectionRef.current = false;
              firstPointRef.current = null;
              onSubAreaSelectionCanceled?.();
            }
          },
          cancel: () => {
            setPendingSubAreaSelection(false);
            pendingSubAreaSelectionRef.current = false;
            firstPointRef.current = null;
            onSubAreaSelectionCanceled?.();
          },
        });
        return false;
      };

      const drawInstance = new Draw({
        source,
        type: geometryType,
        geometryFunction,
        condition: composedCondition,
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
            // During drawing OL structure: [p0, p1, ..., pn, cursor, p0]. Exclude cursor & closing p0 for incremental ring.
            const committedCount = currentCoordinates[0].length - 2;
            const userDrawnRing = [...currentCoordinates[0].slice(0, committedCount)];
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
        // Reset area selection state for a new drawing sequence
        setChosenSubArea(null);
        setPendingSubAreaSelection(false);
        firstPointRef.current = null;
        chosenSubAreaRef.current = null;
        pendingSubAreaSelectionRef.current = false;
        hasStartedRef.current = true;
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

          const ring = currentCoordinates[0];

          // First point selection handled pre-start in composedCondition

          // Block further points while selection pending
          if (pendingSubAreaSelectionRef.current && actualPointCount > 1) {
            drawInstance.removeLastPoint();
            lastCoordinateCount.current = actualPointCount - 1;
            return;
          }

          // Legacy segment guard fallback when no sub area selection logic is provided
          if (!getSubAreasAtCoordinate && drawSegmentGuard && actualPointCount >= 2) {
            const start = ring[actualPointCount - 2];
            const end = ring[actualPointCount - 1];
            const ok = drawSegmentGuard(map, [start, end]);
            if (!ok) {
              drawInstance.removeLastPoint();
              lastCoordinateCount.current = actualPointCount - 1;
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

          // AREA CONTAINMENT & SEGMENT GUARD (after area chosen)
          if (chosenSubArea && actualPointCount >= 2) {
            const start = ring[actualPointCount - 2];
            const end = ring[actualPointCount - 1];
            const poly = (chosenSubAreaRef.current ?? chosenSubArea)?.getGeometry() as Polygon;
            // Check end point inside polygon
            if (!poly.intersectsCoordinate(end)) {
              drawInstance.removeLastPoint();
              lastCoordinateCount.current = actualPointCount - 1;
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
            // Segment midpoints sampling to ensure it doesn't cross outside
            const steps = 5;
            for (let i = 1; i < steps; i += 1) {
              const f = i / steps;
              const mid = [start[0] + (end[0] - start[0]) * f, start[1] + (end[1] - start[1]) * f];
              if (!poly.intersectsCoordinate(mid)) {
                drawInstance.removeLastPoint();
                lastCoordinateCount.current = actualPointCount - 1;
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
            // Optional legacy guard after our containment checks
            if (allowLegacyDrawSegmentGuard && drawSegmentGuard) {
              const ok = drawSegmentGuard(map, [start, end]);
              if (!ok) {
                drawInstance.removeLastPoint();
                lastCoordinateCount.current = actualPointCount - 1;
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

        // Reset pending selection flags after end
        setPendingSubAreaSelection(false);
        firstPointRef.current = null;
        pendingSubAreaSelectionRef.current = false;

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
        // Keep chosenSubArea for potential modify operations or clear? Clearing to force re-selection on next draw.
        setChosenSubArea(null);
        chosenSubAreaRef.current = null;
        hasStartedRef.current = false;
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
      getSubAreasAtCoordinate,
      onRequestSubAreaSelection,
      onSubAreaSelected,
      onSubAreaSelectionCanceled,
      allowLegacyDrawSegmentGuard,
      chosenSubArea,
      hasStartedRef,
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
