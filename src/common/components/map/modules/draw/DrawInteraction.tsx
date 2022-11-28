import React, { useEffect, useContext, useRef, useState, useCallback } from 'react';
import Feature from 'ol/Feature';
import Select from 'ol/interaction/Select';
import { createRegularPolygon } from 'ol/interaction/Draw';
import Collection from 'ol/Collection';
import { Draw, Snap, Modify } from 'ol/interaction';
import { click } from 'ol/events/condition';
import { DRAWTOOLTYPE } from './types';
import MapContext from '../../MapContext';
import useDrawContext from './useDrawContext';

type Props = {
  features?: Collection<Feature>;
};

type Interaction = Draw | Snap | Modify;

const DrawInteraction: React.FC<Props> = () => {
  const selection = useRef<null | Select>(null);
  const { map } = useContext(MapContext);
  const { state, actions, source } = useDrawContext();
  const [instances, setInstances] = useState<Interaction[]>([]);

  const clearSelection = useCallback(() => {
    if (selection.current) selection.current.getFeatures().clear();
    actions.setSelectedFeature(null);
  }, [selection]);

  const removeDrawInteractions = useCallback(() => {
    instances.forEach((i: Interaction) => {
      map?.removeInteraction(i);
    });
  }, [instances, map]);

  const removeAllInteractions = useCallback(() => {
    removeDrawInteractions();
    clearSelection();
  }, [map, source, instances]);

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

      drawInstance.on('drawend', () => {
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
    [map, source, state.selectedDrawtoolType, actions, clearSelection]
  );

  useEffect(() => {
    if (!map || !source || process.env.NODE_ENV === 'test') return;

    const modifyInstance = new Modify({ source });
    map.addInteraction(modifyInstance);

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
  }, [map, source, actions, clearSelection]);

  useEffect(() => {
    removeAllInteractions();
    if (state.selectedDrawtoolType) {
      startDraw(state.selectedDrawtoolType);
    }
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
