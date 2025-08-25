import React, { useEffect, useContext, useRef, useState, useCallback } from 'react';
import Feature, { FeatureLike } from 'ol/Feature';
import Select from 'ol/interaction/Select';
import { createBox } from 'ol/interaction/Draw';
import Collection from 'ol/Collection';
import { Draw, Snap, Modify } from 'ol/interaction';
import { Condition } from 'ol/events/condition';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import Style from 'ol/style/Style';
import { ModifyEvent } from 'ol/interaction/Modify';
import { DRAWTOOLTYPE } from './types';
import MapContext from '../../MapContext';
import useDrawContext from './useDrawContext';
import {
  areLinesInPolygonIntersecting,
  getSurfaceArea,
  isPolygonSelfIntersecting,
} from '../../utils';
import { styleFunction } from '../../../../../domain/map/utils/geometryStyle';
import { Map, MapBrowserEvent } from 'ol';

type Props = {
  features?: Collection<Feature>;
  onSelfIntersectingPolygon?: (feature: Feature<Geometry> | null) => void;
  drawCondition?: Condition;
  drawFinishCondition?: (event: MapBrowserEvent<UIEvent>, feature: Feature) => boolean;
  drawStyleFunction?: (map: Map, feature: FeatureLike) => Style | Style[];
  handleModifyEnd?: (
    event: ModifyEvent,
    originalFeature: Feature | null,
    modifiedFeature: Feature,
  ) => void;
};

type Interaction = Draw | Snap | Modify;

const DrawInteraction: React.FC<React.PropsWithChildren<Props>> = ({
  onSelfIntersectingPolygon,
  drawCondition,
  drawFinishCondition,
  drawStyleFunction,
  handleModifyEnd,
}) => {
  const selection = useRef<null | Select>(null);
  const { map } = useContext(MapContext);
  const { state, actions, source } = useDrawContext();
  const [instances, setInstances] = useState<Interaction[]>([]);
  const modify = useRef<null | Modify>(null);

  const drawnFeature = useRef<null | Feature>(null);
  const originalModifiedFeature = useRef<null | Feature>(null);

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

          const geometry = drawnFeature.current?.getGeometry();
          if (geometry) {
            const surfaceArea = getSurfaceArea(geometry);
            // Don't allow drawing to be finished if its
            // surface area is below 1
            if (surfaceArea < 1) {
              return false;
            }
          }
          return true;
        },
      });
      drawInstance.on('drawstart', (event) => {
        selection.current?.setActive(false);
        event.feature.on('change', (changeEvent) => {
          const currentFeature = event.feature;
          const modifiedPolygon: Polygon = currentFeature.getGeometry() as Polygon;
          const currentCoordinates = modifiedPolygon.getCoordinates();
          let intersecting: boolean = false;
          // OpenLayers creates minimum set of 3 coordinates when draw starts for polygon
          // We are interested only with set of coordinates where there are only those
          // that we have drawn. Discard the 2 coordinates the polygon inheritly gets.
          currentCoordinates[0].splice(currentCoordinates[0].length - 2, 2);
          intersecting = areLinesInPolygonIntersecting(currentCoordinates);
          if (intersecting) {
            drawInstance.removeLastPoint();
            alert('Itsensäleikkaavat kuviot eivät ole sallittuja');
          } else {
            drawnFeature.current = changeEvent.target;
          }
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
        alert('Itsensäleikkaavat kuviot eivät ole sallittuja');
        modifiedPolygon.setCoordinates(originalGeometry.getCoordinates());
      } else {
        handleModifyEnd?.(event, originalModifiedFeature.current, modifiedFeature);
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
  }, [map, source]);

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
};

export default DrawInteraction;
