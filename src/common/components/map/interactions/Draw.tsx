import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Vector } from 'ol/source';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import { Draw, Snap, Modify } from 'ol/interaction';
import { createRegularPolygon } from 'ol/interaction/Draw';
import { DRAWTOOLTYPE } from '../constants';
import MapContext from '../MapContext';

type Props = {
  source: Vector;
  features?: Collection<Feature>;
};

type Interaction = Draw | Snap | Modify;

const DrawInteraction: React.FC<Props> = ({ source }) => {
  const { map, selectedDrawtoolType } = useContext(MapContext);
  const [instances, setInstances] = useState<Interaction[]>([]);

  const setInteractions = useCallback(
    (type) => {
      if (!map || !source || selectedDrawtoolType === null) return;

      if (process.env.NODE_ENV === 'test') return;

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

      map.addInteraction(drawInstance);

      const snapInstance = new Snap({ source });
      map.addInteraction(snapInstance);

      const modifyInstance = new Modify({ source });
      map.addInteraction(modifyInstance);

      setInstances([drawInstance, snapInstance, modifyInstance]);
    },
    [map, source]
  );

  const removeInteractions = useCallback(() => {
    instances.forEach((i: Interaction) => {
      map?.removeInteraction(i);
    });
  }, [map, source, instances]);

  useEffect(() => {
    if (!map || selectedDrawtoolType === null) return;

    // eslint-disable-next-line
    return () => {
      removeInteractions();
    };
  }, []);

  useEffect(() => {
    removeInteractions();
    setInteractions(selectedDrawtoolType);
  }, [selectedDrawtoolType]);

  return null;
};

export default DrawInteraction;
