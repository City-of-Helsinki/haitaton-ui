import Feature from 'ol/Feature';
import { $enum } from 'ts-enum-util';
import { Fill, Stroke, Style } from 'ol/style';
import {
  getStatusByIndex,
  getColorByStatus,
  LIIKENNEHAITTA_STATUS,
} from '../../common/utils/liikennehaittaindeksi';

const opacity = 0.45;
const opacityHL = 0.85;

const stroke = new Stroke({ color: 'black', width: 2 });
const strokeHL = new Stroke({ color: 'black', width: 6 });

export const STYLES = {
  BLUE: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.BLUE, opacity),
    }),
    stroke,
  }),
  BLUE_HL: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.BLUE, opacityHL),
    }),
    stroke: strokeHL,
  }),
  GREEN: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.GREEN, opacity),
    }),
    stroke,
  }),
  GREEN_HL: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.GREEN, opacityHL),
    }),
    stroke: strokeHL,
  }),
  YELLOW: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.YELLOW, opacity),
    }),
    stroke,
  }),
  YELLOW_HL: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.YELLOW, opacityHL),
    }),
    stroke: strokeHL,
  }),
  RED: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.RED, opacity),
    }),
    stroke,
  }),
  RED_HL: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.RED, opacityHL),
    }),
    stroke: strokeHL,
  }),
};

export const getStyleByStatus = (status: LIIKENNEHAITTA_STATUS, highlight = false): Style =>
  $enum.mapValue(status).with({
    [LIIKENNEHAITTA_STATUS.BLUE]: highlight ? STYLES.BLUE_HL : STYLES.BLUE,
    [LIIKENNEHAITTA_STATUS.GREEN]: highlight ? STYLES.GREEN_HL : STYLES.GREEN,
    [LIIKENNEHAITTA_STATUS.YELLOW]: highlight ? STYLES.YELLOW_HL : STYLES.YELLOW,
    [LIIKENNEHAITTA_STATUS.RED]: highlight ? STYLES.RED_HL : STYLES.RED,
  });

// Performance tips: https://github.com/openlayers/openlayers/issues/8392
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const styleFunction: any = (feature: Feature, renderFeature: any, highlight = false) => {
  const liikenneHaittaIndeksi: number | null = feature.get('liikennehaittaindeksi');
  const status = getStatusByIndex(liikenneHaittaIndeksi);

  return getStyleByStatus(status, highlight);
};
