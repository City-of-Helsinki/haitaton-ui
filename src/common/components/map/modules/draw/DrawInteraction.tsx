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
import { isPolygonSelfIntersecting } from '../../utils';

type Props = {
  features?: Collection<Feature>;
  onSelfIntersectingPolygon?: (feature: Feature<Geometry> | null) => void;
};

type Interaction = Draw | Snap | Modify;

const DrawInteraction: React.FC<Props> = ({ onSelfIntersectingPolygon }) => {
  const selection = useRef<null | Select>(null);
  const { map } = useContext(MapContext);
  const { state, actions, source } = useDrawContext();
  const [instances, setInstances] = useState<Interaction[]>([]);

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
      });

      drawInstance.on('drawend', (event) => {
        const isSelfIntersecting = isPolygonSelfIntersecting(
          event.feature.getGeometry() as Polygon
        );

        if (onSelfIntersectingPolygon && isSelfIntersecting) {
          onSelfIntersectingPolygon(event.feature);
        }

        clearSelection();
        actions.setSelectedDrawToolType(null);
      });

      map.addInteraction(drawInstance);

      const snapInstance = new Snap({ source });
      map.addInteraction(snapInstance);

      const modifyInstance = new Modify({ source });
      map.addInteraction(modifyInstance);

      setInstances([drawInstance, snapInstance, modifyInstance]);
    },
    [map, source, state.selectedDrawtoolType, actions, clearSelection, onSelfIntersectingPolygon]
  );

  useEffect(() => {
    if (!map || !source || process.env.NODE_ENV === 'test') return;

    const modifyInstance = new Modify({ source });
    map.addInteraction(modifyInstance);

    modifyInstance.on('modifyend', () => {
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
      const features = e.target.getFeatures();
      const feature = features.getArray()[0];

      if (feature) {
        actions.setSelectedFeature(feature);
      } else {
        clearSelection();
      }
    });

    source.on('removefeature', () => {
      clearSelection();
    });

    // eslint-disable-next-line consistent-return
    return function cleanUp() {
      map.removeInteraction(modifyInstance);
      if (selection.current) {
        map.removeInteraction(selection.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, source]);

  useEffect(() => {
    removeAllInteractions();
    if (state.selectedDrawtoolType) {
      startDraw(state.selectedDrawtoolType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedDrawtoolType]);

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
