import React, { useEffect, useContext, useRef, useState, useCallback } from 'react';
import Feature from 'ol/Feature';
import Select from 'ol/interaction/Select';
import { createRegularPolygon } from 'ol/interaction/Draw';
import Collection from 'ol/Collection';
import { Draw, Snap, Modify } from 'ol/interaction';
import { altKeyOnly, click } from 'ol/events/condition';
import { DRAWTOOLTYPE } from './types';
import MapContext from '../../MapContext';
import { DrawContext } from './DrawContext';

type Props = {
  features?: Collection<Feature>;
};

type Interaction = Draw | Snap | Modify;

const DrawInteraction: React.FC<Props> = () => {
  const selection = useRef<null | Select>(null);
  const { map } = useContext(MapContext);
  const { state, actions, source } = useContext(DrawContext);
  const [instances, setInstances] = useState<Interaction[]>([]);

  const startDraw = useCallback(
    (type = DRAWTOOLTYPE.POLYGON) => {
      if (
        !map ||
        !source ||
        state?.selectedDrawtoolType === null ||
        process.env.NODE_ENV === 'test'
      ) {
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
        if (selection.current) selection.current.getFeatures().clear();
        actions?.setSelectedFeature(null);
      });

      map.addInteraction(drawInstance);

      const snapInstance = new Snap({ source });
      map.addInteraction(snapInstance);

      const modifyInstance = new Modify({ source });
      map.addInteraction(modifyInstance);

      setInstances([drawInstance, snapInstance, modifyInstance]);
    },
    [map, source, state?.selectedDrawtoolType]
  );

  useEffect(() => {
    if (!map || !source || process.env.NODE_ENV === 'test') return;

    const modifyInstance = new Modify({ source });
    map.addInteraction(modifyInstance);

    selection.current = new Select({
      condition: (mapBrowserEvent) => click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent),
    });

    map.addInteraction(selection.current);

    selection.current.on('select', (e) => {
      const features = e.target.getFeatures();
      const feature = features.getArray()[0];

      if (feature) {
        actions?.setSelectedFeature(feature);
      } else {
        // Unselect
        features.clear();
        actions?.setSelectedFeature(null);
      }
    });

    source.on('removefeature', () => {
      actions?.setSelectedFeature(null);
    });
  }, []);

  const removeAllInteractions = useCallback(() => {
    instances.forEach((i: Interaction) => {
      map?.removeInteraction(i);
    });
    actions?.setSelectedFeature(null);
  }, [map, source, instances]);

  useEffect(() => {
    if (!map) return;
    // startEdit();

    // eslint-disable-next-line
    return () => {
      removeAllInteractions();
      // Remove selection instance
      selection.current = null;
    };
  }, []);

  useEffect(() => {
    removeAllInteractions();
    if (state?.selectedDrawtoolType) {
      startDraw(state?.selectedDrawtoolType);
    }
  }, [state?.selectedDrawtoolType]);

  return null;
};

export default DrawInteraction;
