import React from 'react';
import { TileWMS } from 'ol/source';
import { useTranslation } from 'react-i18next';
import TileLayer from '../../../../common/components/map/layers/TileLayer';
import { projection } from '../../../../common/components/map/utils';

const Kantakartta = () => {
  const { t } = useTranslation();

  const sourceOptions = {
    url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms',
    projection: projection || undefined,
    cacheSize: 1000,
    imageSmoothing: false,
    hidpi: false,
    transition: 0,
    attributions: [t('map:attribution')],
  };

  return (
    <>
      <TileLayer
        minZoom={9}
        source={
          new TileWMS({
            ...sourceOptions,
            params: {
              LAYERS: 'Kantakartta',
              FORMAT: 'image/jpeg',
              WIDTH: 256,
              HEIGHT: 256,
              VERSION: '1.1.1',
              TRANSPARENT: 'false',
            },
          })
        }
      />
      <TileLayer
        maxZoom={9}
        source={
          new TileWMS({
            ...sourceOptions,
            params: {
              LAYERS: 'Opaskartta_Helsinki',
              FORMAT: 'image/jpeg',
              WIDTH: 256,
              HEIGHT: 256,
              VERSION: '1.1.1',
              TRANSPARENT: 'false',
            },
          })
        }
      />
    </>
  );
};

export default React.memo(Kantakartta);
