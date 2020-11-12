import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Vector } from 'ol/source';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import { Draw, Snap, Modify } from 'ol/interaction';
import MapContext from '../MapContext';

type Props = {
  source: Vector;
  features?: Collection<Feature>;
};

type Interaction = Draw | Snap | Modify;

const DrawInteraction: React.FC<Props> = ({ source, features = undefined }) => {
  const { map, drawTool } = useContext(MapContext);
  const [instances, setInstances] = useState<Interaction[]>([]);

  const setInteractions = useCallback(
    (type) => {
      if (!map || drawTool === null) return;

      const drawInstance = new Draw({
        source,
        features,
        type,
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
    if (!map || drawTool === null) return;

    // eslint-disable-next-line
    return () => {
      removeInteractions();
    };
  }, []);

  useEffect(() => {
    removeInteractions();
    setInteractions(drawTool);
  }, [drawTool]);

  return null;
};

export default DrawInteraction;
