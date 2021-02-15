import React, { useEffect, useContext } from 'react';
import { MapBrowserEvent } from 'ol';
import OLVectorLayer from 'ol/layer/Vector';
import { useHistory } from 'react-router-dom';
import MapContext from '../MapContext';
import { MapInstance } from '../types';

const HankeClick: React.FC = () => {
  const { map } = useContext(MapContext);

  const history = useHistory();

  const selectHanke = (mapInstance: MapInstance, evt: MapBrowserEvent<UIEvent>) => {
    mapInstance?.getLayers().forEach((BaseLayer) => {
      if (BaseLayer instanceof OLVectorLayer) {
        BaseLayer.getFeatures(evt.pixel).then((features) => {
          if (features.length > 0) {
            features.some((feature) => {
              const hankeTunnus = feature.get('hankeTunnus');
              history.push({
                search: `?hanke=${hankeTunnus}`,
              });
              const extent = feature.getGeometry()?.getExtent();
              if (extent) map?.getView().fit(extent, { padding: [150, 100, 100, 300] });
              return true;
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    if (map)
      map.on('click', (evt) => {
        selectHanke(map, evt);
      });
  }, [map]);

  return null;
};

export default HankeClick;
