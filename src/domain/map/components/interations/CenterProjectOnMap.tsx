import React, { useContext, useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';

import { useLocation } from 'react-router-dom';
import MapContext from '../../../../common/components/map/MapContext';

type Props = {
  source: VectorSource;
};

// https://openlayers.org/en/latest/apidoc/module-ol_events_Event-BaseEvent.html

const CenterProjectOnMap: React.FC<Props> = ({ source }) => {
  const location = useLocation();
  const { map, layers } = useContext(MapContext);
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
    if (layers.hankeGeometryLayer) {
      // https://openlayers.org/en/latest/apidoc/module-ol_source_Vector.VectorSourceEvent.html
      // Because of useMemo, this will not trigger after features is once loaded
      layers.hankeGeometryLayer.on('addfeature', centralizeHankeOnMap);
    }
  }, [hankeTunnus, layers.hankeGeometryLayer]);

  useEffect(() => {
    // This will be triggered when hankeParams changes
    centralizeHankeOnMap();
  }, [hankeTunnus]);

  // Tää ei toimi tai ainakin tässä on jotain outoa
  useEffect(() => {
    if (map) {
      // https://openlayers.org/en/latest/apidoc/module-ol_MapEvent-MapEvent.html
      map.on('rendercomplete', () => {
        centralizeHankeOnMap();
      });
    }
  }, [map]);

  return null;
};

export default CenterProjectOnMap;
