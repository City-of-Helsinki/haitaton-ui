import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import OLVectorLayer from 'ol/layer/Vector';
import MapContext from '../../../../common/components/map/MapContext';

const CenterProjectOnMap: React.FC = () => {
  const location = useLocation();
  const { map } = useContext(MapContext);

  const hanke = new URLSearchParams(location.search).get('hanke');

  const centralizeHankeOnMap = (hankeTunnus: string) => {
    map?.getLayers().forEach((BaseLayer) => {
      if (BaseLayer instanceof OLVectorLayer) {
        BaseLayer.getSource()
          .getFeatures()
          .some((feature) => {
            if (feature.get('hankeTunnus') === hankeTunnus) {
              const extent = feature.getGeometry()?.getExtent();
              if (extent) map?.getView().fit(extent, { padding: [150, 100, 100, 300] });
              return true;
            }
            return false;
          });
      }
    });
  };

  useEffect(() => {
    if (hanke) centralizeHankeOnMap(hanke);
  }, [hanke, map]);

  return null;
};

export default CenterProjectOnMap;
