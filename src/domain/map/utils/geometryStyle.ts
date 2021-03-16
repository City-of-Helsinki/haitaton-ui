import Feature from 'ol/Feature';
import { $enum } from 'ts-enum-util';
import { Fill, Style } from 'ol/style';
import {
  getStatusByIndex,
  getColorByStatus,
  LIIKENNEHAITTA_STATUS,
} from '../../common/utils/liikennehaittaindeksi';

const STYLES = {
  [LIIKENNEHAITTA_STATUS.BLUE]: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.BLUE),
    }),
  }),
  [LIIKENNEHAITTA_STATUS.GREEN]: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.GREEN),
    }),
  }),
  [LIIKENNEHAITTA_STATUS.YELLOW]: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.YELLOW),
    }),
  }),
  [LIIKENNEHAITTA_STATUS.RED]: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.RED),
    }),
  }),
};

export const getStyleByStatus = (status: LIIKENNEHAITTA_STATUS): Style =>
  $enum.mapValue(status).with({
    [LIIKENNEHAITTA_STATUS.BLUE]: STYLES[LIIKENNEHAITTA_STATUS.BLUE],
    [LIIKENNEHAITTA_STATUS.GREEN]: STYLES[LIIKENNEHAITTA_STATUS.GREEN],
    [LIIKENNEHAITTA_STATUS.YELLOW]: STYLES[LIIKENNEHAITTA_STATUS.YELLOW],
    [LIIKENNEHAITTA_STATUS.RED]: STYLES[LIIKENNEHAITTA_STATUS.RED],
  });

// Performance tips: https://github.com/openlayers/openlayers/issues/8392
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const styleFunction: any = (feature: Feature) => {
  const liikenneHaittaIndeksi = feature.get('liikennehaittaindeksi');
  const status = getStatusByIndex(liikenneHaittaIndeksi);

  return getStyleByStatus(status);
};
