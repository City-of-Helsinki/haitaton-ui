import { FeatureLike } from 'ol/Feature';
import { $enum } from 'ts-enum-util';
import { Fill, Stroke, Style } from 'ol/style';
import {
  getStatusByIndex,
  getColorByStatus,
  LIIKENNEHAITTA_STATUS,
} from '../../common/utils/liikennehaittaindeksi';

const opacity = 0.65;
const opacityHL = 0.75;

const stroke = new Stroke({ color: 'black', width: 1 });
const strokeHL = new Stroke({ color: 'black', width: 3 });

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
  GREY: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.GREY, opacity),
    }),
    stroke,
  }),
  GREY_HL: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.GREY, opacityHL),
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
  LAVENDER_BLUE: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.LAVENDER_BLUE, opacity),
    }),
    stroke: stroke,
  }),
  LAVENDER_BLUE_HL: new Style({
    fill: new Fill({
      color: getColorByStatus(LIIKENNEHAITTA_STATUS.LAVENDER_BLUE, opacityHL),
    }),
    stroke: strokeHL,
  }),
};

export const getStyleByStatus = (status: LIIKENNEHAITTA_STATUS, highlight = false): Style =>
  $enum.mapValue(status).with({
    [LIIKENNEHAITTA_STATUS.LAVENDER_BLUE]: highlight
      ? STYLES.LAVENDER_BLUE_HL
      : STYLES.LAVENDER_BLUE,
    [LIIKENNEHAITTA_STATUS.BLUE]: highlight ? STYLES.BLUE_HL : STYLES.BLUE,
    [LIIKENNEHAITTA_STATUS.GREY]: highlight ? STYLES.GREY_HL : STYLES.GREY,
    [LIIKENNEHAITTA_STATUS.GREEN]: highlight ? STYLES.GREEN_HL : STYLES.GREEN,
    [LIIKENNEHAITTA_STATUS.YELLOW]: highlight ? STYLES.YELLOW_HL : STYLES.YELLOW,
    [LIIKENNEHAITTA_STATUS.RED]: highlight ? STYLES.RED_HL : STYLES.RED,
  });

// Performance tips: https://github.com/openlayers/openlayers/issues/8392
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const styleFunction: any = (feature: FeatureLike, renderFeature: any, highlight = false) => {
  const { statusKey, liikennehaittaindeksi } = feature.getProperties();
  const status = (statusKey as LIIKENNEHAITTA_STATUS) ?? getStatusByIndex(liikennehaittaindeksi);

  return getStyleByStatus(status, highlight);
};
