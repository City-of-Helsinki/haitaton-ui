import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Vector } from 'ol/source';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import { Draw, Snap, Modify } from 'ol/interaction';
import { DRAWTOOLTYPE } from './types';
import MapContext from '../../MapContext';
import { DrawContext } from './DrawContext';

type Props = {
  source: Vector;
  features?: Collection<Feature>;
};

type Interaction = Draw | Snap | Modify;

const DrawInteraction: React.FC<Props> = ({ source }) => {
  const { map } = useContext(MapContext);
  const { state } = useContext(DrawContext);
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

      const drawInstance = new Draw({
        source,
        type,
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

  const startEdit = useCallback(() => {
    if (!map || !source || process.env.NODE_ENV === 'test') return;

    const modifyInstance = new Modify({ source });
    map.addInteraction(modifyInstance);

    setInstances([modifyInstance]);
  }, [map, source]);

  const removeAllInteractions = useCallback(() => {
    instances.forEach((i: Interaction) => {
      map?.removeInteraction(i);
    });
  }, [map, source, instances]);

  useEffect(() => {
    if (!map) return;
    startEdit();

    // eslint-disable-next-line
    return () => removeAllInteractions();
  }, []);

  useEffect(() => {
    removeAllInteractions();
    if (state?.selectedDrawtoolType) {
      startDraw(state?.selectedDrawtoolType);
    } else {
      startEdit();
    }
  }, [state?.selectedDrawtoolType]);

  return null;
};

export default DrawInteraction;
