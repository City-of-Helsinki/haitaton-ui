import React, { useEffect, useContext, useState } from 'react';
import { MapBrowserEvent } from 'ol';
import OLVectorLayer from 'ol/layer/Vector';
import MapContext from '../../MapContext';
import { MapInstance } from '../../types';
import HoverContext from './HoverContext';

const GeometryHover: React.FC = ({ children }) => {
  const { map } = useContext(MapContext);
  const [hoveredHankeTunnus, setHoveredHankeTunnus] = useState('');

  const highlightHankeOnPixel = (mapInstance: MapInstance, evt: MapBrowserEvent<UIEvent>) => {
    mapInstance?.getLayers().forEach((BaseLayer) => {
      if (BaseLayer instanceof OLVectorLayer) {
        BaseLayer.getFeatures(evt.pixel).then((features) => {
          if (features.length > 0) {
            features.some((feature) => {
              const hankeTunnus = feature.get('hankeTunnus');
              setHoveredHankeTunnus(hankeTunnus);
              return true;
            });
          } else {
            setHoveredHankeTunnus('');
          }
        });
      }
    });
  };

  useEffect(() => {
    if (map) {
      map.on('pointermove', (evt) => {
        if (evt.dragging) return;
        highlightHankeOnPixel(map, evt);
      });
    }
  }, [map]);

  return <HoverContext.Provider value={{ hoveredHankeTunnus }}>{children}</HoverContext.Provider>;
};

export default GeometryHover;
