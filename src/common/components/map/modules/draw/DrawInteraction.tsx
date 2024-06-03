import React, { useEffect, useContext, useRef, useState, useCallback } from 'react';
import Feature from 'ol/Feature';
import Select from 'ol/interaction/Select';
import { createRegularPolygon } from 'ol/interaction/Draw';
import Collection from 'ol/Collection';
import { Draw, Snap, Modify } from 'ol/interaction';
import { click } from 'ol/events/condition';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import { DRAWTOOLTYPE } from './types';
import MapContext from '../../MapContext';
import useDrawContext from './useDrawContext';
import { getSurfaceArea, isPolygonSelfIntersecting } from '../../utils';
import { styleFunction } from '../../../../../domain/map/utils/geometryStyle';

type Props = {
  features?: Collection<Feature>;
  onSelfIntersectingPolygon?: (feature: Feature<Geometry> | null) => void;
};

type Interaction = Draw | Snap | Modify;

const DrawInteraction: React.FC<React.PropsWithChildren<Props>> = ({
  onSelfIntersectingPolygon,
}) => {
  const selection = useRef<null | Select>(null);
  const { map } = useContext(MapContext);
  const { state, actions, source } = useDrawContext();
  const [instances, setInstances] = useState<Interaction[]>([]);
  const modify = useRef<null | Modify>(null);

  const drawnFeature = useRef<null | Feature>(null);

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
    clearSelection();
  }, [clearSelection, removeDrawInteractions]);

  const startDraw = useCallback(
    (type = DRAWTOOLTYPE.POLYGON) => {
      if (!map || state.selectedDrawtoolType === null || process.env.NODE_ENV === 'test') {
        return;
      }

      let geometryFunction;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let geometryType: any = type;
      if (type === DRAWTOOLTYPE.SQUARE) {
        geometryFunction = createRegularPolygon(4);
        geometryType = 'Circle';
      }

      const drawInstance = new Draw({
        source,
        type: geometryType,
        geometryFunction,
        finishCondition() {
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
      });

      map.addInteraction(drawInstance);

      setInstances([drawInstance]);
    },
    [map, source, state.selectedDrawtoolType, actions, clearSelection, onSelfIntersectingPolygon],
  );

  useEffect(() => {
    if (!map || !source || process.env.NODE_ENV === 'test') return;

    modify.current = new Modify({ source });
    map.addInteraction(modify.current);

    modify.current.on('modifyend', () => {
      const selfIntersectingFeature = source
        .getFeatures()
        .find((feature) => isPolygonSelfIntersecting(feature.getGeometry() as Polygon));

      if (onSelfIntersectingPolygon) {
        if (selfIntersectingFeature) {
          onSelfIntersectingPolygon(selfIntersectingFeature);
        } else {
          onSelfIntersectingPolygon(null);
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
      condition: (mapBrowserEvent) => click(mapBrowserEvent),
    });

    map.addInteraction(selection.current);

    selection.current.on('select', (e) => {
      const features = e.selected;
      const feature: Feature<Geometry> = features[0];

      if (feature) {
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
      state.selectedFeature.setStyle(styleFunction(state.selectedFeature, undefined, true));
    }
  }, [state.selectedFeature, clearSelection]);

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
