import React, { useCallback, useContext, useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { useLocation } from 'react-router-dom';
import MapContext from '../../../../common/components/map/MapContext';

type Props = {
  source: VectorSource;
};

const CenterProjectOnMap: React.FC<Props> = ({ source }) => {
  const location = useLocation();
  const { map } = useContext(MapContext);
  const hankeTunnus = new URLSearchParams(location.search).get('hanke');

  const centralizeHankeOnMap = useCallback(() => {
    source.getFeatures().some((feature) => {
      if (feature.get('hankeTunnus') === hankeTunnus) {
        const extent = feature.getGeometry()?.getExtent();
        if (extent) map?.getView().fit(extent, { padding: [150, 100, 100, 300] });
        return true;
      }
      return false;
    });
  }, [hankeTunnus, map, source]);

  useEffect(() => {
    map?.once('postrender', centralizeHankeOnMap);
    source.on('addfeature', centralizeHankeOnMap);

    return function cleanup() {
      source.un('addfeature', centralizeHankeOnMap);
    };
  }, [map, source, centralizeHankeOnMap]);

  useEffect(() => {
    centralizeHankeOnMap();
  }, [hankeTunnus, centralizeHankeOnMap]);

  return null;
};

export default CenterProjectOnMap;
