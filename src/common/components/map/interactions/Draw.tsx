import React, { useEffect, useContext } from 'react';
import GeoJSON from 'ol/format/GeoJSON';

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

    // For testing, remove later
    const format = new GeoJSON({ featureProjection: 'EPSG:3879' });
    const json = format.writeFeatures(source.getFeatures());
    // eslint-disable-next-line no-console
    console.log(json); // Should be removed later

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
