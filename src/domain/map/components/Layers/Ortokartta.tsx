import React from 'react';
import { TileWMS } from 'ol/source';
import { useTranslation } from 'react-i18next';
import TileLayer from '../../../../common/components/map/layers/TileLayer';
import { projection } from '../../../../common/components/map/utils';

type Props = {
  opacity?: number;
};

function Ortokartta({ opacity }: Props) {
  const { t } = useTranslation();

  return (
    <TileLayer
      zIndex={2}
      source={
        new TileWMS({
          url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms',
          params: {
            LAYERS: 'Ortoilmakuva',
            FORMAT: 'image/jpeg',
            WIDTH: 256,
            HEIGHT: 256,
            VERSION: '1.1.1',
            TRANSPARENT: 'false',
          },
          projection: projection || undefined,
          hidpi: false,
          transition: 0,
          attributions: [t('map:attribution')],
        })
      }
      opacity={opacity}
    />
  );
}

export default React.memo(Ortokartta);
