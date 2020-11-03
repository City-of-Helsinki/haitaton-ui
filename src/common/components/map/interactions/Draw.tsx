import React, { useEffect, useContext } from 'react';
import { Vector } from 'ol/source';
import Feature from 'ol/Feature';
import Collection from 'ol/Collection';
import { Draw, Snap, Modify } from 'ol/interaction';
import MapContext from '../MapContext';

type Props = {
  source: Vector;
  features?: Collection<Feature>;
};

const DrawInteraction: React.FC<Props> = ({ source, features = undefined }) => {
  const { map, drawTool } = useContext(MapContext);

  useEffect(() => {
    if (!map || drawTool === null) return;

    const drawInstance = new Draw({
      source,
      features,
      // eslint-disable-next-line
      type: drawTool as any, // Not sure how this should be typed
    });

    map.addInteraction(drawInstance);

    const snapInstance = new Snap({ source });
    map.addInteraction(snapInstance);

    const modifyInstance = new Modify({ source });
    map.addInteraction(modifyInstance);

    // eslint-disable-next-line
    return () => {
      if (map) {
        if (drawInstance) map.removeInteraction(drawInstance);
        if (snapInstance) map.removeInteraction(snapInstance);
        if (modifyInstance) map.removeInteraction(modifyInstance);
      }
    };
  }, [drawTool]);

  return null;
};

export default DrawInteraction;
