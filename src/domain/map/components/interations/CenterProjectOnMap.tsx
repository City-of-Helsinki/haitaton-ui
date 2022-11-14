import React, { useContext, useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { useLocation } from 'react-router-dom';
import MapContext from '../../../../common/components/map/MapContext';

type Props = {
  source: VectorSource;
};

const CenterProjectOnMap: React.FC<React.PropsWithChildren<Props>> = ({ source }) => {
  const location = useLocation();
  const { map } = useContext(MapContext);
  const hankeTunnus = new URLSearchParams(location.search).get('hanke');

  const centralizeHankeOnMap = () => {
    source.getFeatures().some((feature) => {
      if (feature.get('hankeTunnus') === hankeTunnus) {
        const extent = feature.getGeometry()?.getExtent();
        if (extent) map?.getView().fit(extent, { padding: [150, 100, 100, 300] });
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    source.on('featuresAdded', () => {
      centralizeHankeOnMap();
    });
  }, [map, hankeTunnus]);

  useEffect(() => {
    centralizeHankeOnMap();
  }, [hankeTunnus]);

  return null;
};

export default CenterProjectOnMap;
