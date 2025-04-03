import React, { useEffect, useContext } from 'react';
import { MapBrowserEvent } from 'ol';
import OLVectorLayer from 'ol/layer/Vector';
import { useNavigate } from 'react-router-dom';
import MapContext from '../MapContext';
import { MapInstance } from '../types';

const HankeClick: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { map } = useContext(MapContext);

  const navigate = useNavigate();

  useEffect(() => {
    const selectHanke = (mapInstance: MapInstance, evt: MapBrowserEvent<UIEvent>) => {
      mapInstance?.getLayers().forEach((BaseLayer) => {
        if (BaseLayer instanceof OLVectorLayer) {
          BaseLayer.getFeatures(evt.pixel).then((features) => {
            if (features.length > 0) {
              features.some((feature) => {
                const hankeTunnus = feature.get('hankeTunnus');
                const hankealueNimi = feature.get('areaName');
                navigate({
                  search: `?hanke=${hankeTunnus}&hankealue=${hankealueNimi}`,
                });
                return true;
              });
            }
          });
        }
      });
    };

    if (map)
      map.on('click', (evt) => {
        selectHanke(map, evt);
      });
  }, [map, navigate]);

  return null;
};

export default HankeClick;
