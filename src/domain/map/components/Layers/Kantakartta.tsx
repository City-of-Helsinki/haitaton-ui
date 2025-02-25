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

  const WMSRequestParams = {
    FORMAT: 'image/jpeg',
    WIDTH: 256,
    HEIGHT: 256,
    VERSION: '1.1.1',
    TRANSPARENT: 'false',
  };

  return (
    <>
      <TileLayer
        minZoom={10}
        source={
          new TileWMS({
            ...sourceOptions,
            params: {
              ...WMSRequestParams,
              LAYERS: 'Kantakartta',
            },
          })
        }
      />
      <TileLayer
        maxZoom={10}
        minZoom={8}
        source={
          new TileWMS({
            ...sourceOptions,
            params: {
              ...WMSRequestParams,
              LAYERS: 'Kiinteistokartan_maastotiedot',
            },
          })
        }
      />
      <TileLayer
        maxZoom={8}
        minZoom={7}
        source={
          new TileWMS({
            ...sourceOptions,
            params: {
              ...WMSRequestParams,
              LAYERS: 'Opaskartta_Helsinki',
            },
          })
        }
      />
      <TileLayer
        maxZoom={7}
        source={
          new TileWMS({
            ...sourceOptions,
            params: {
              ...WMSRequestParams,
              LAYERS: 'Opaskartta_Helsinki_harvanimi',
            },
          })
        }
      />
    </>
  );
};

export default React.memo(Kantakartta);
