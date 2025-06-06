import { $enum } from 'ts-enum-util';

const getColorWithOpacity = (color: LIIKENNEHAITTA_STATUS | null, opacity = 1) => {
  switch (color) {
    case 'RED':
      return `rgba(196, 18, 62, ${opacity})`;
    case 'YELLOW':
      return `rgba(255, 218, 7, ${opacity})`;
    case 'GREEN':
      return `rgba(0, 146, 70, ${opacity})`;
    case 'GREY':
      return `rgba(176, 184, 191, ${opacity})`;
    case 'LAVENDER_BLUE':
      return `rgba(204, 204, 255, ${opacity})`;
    default:
      return `rgba(0, 98, 185, ${opacity})`;
  }
};

export type TormaysIndex = null | number;

export enum LIIKENNEHAITTA_STATUS {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  GREY = 'GREY',
  BLUE = 'BLUE',
  LAVENDER_BLUE = 'LAVENDER_BLUE',
}

export const getStatusByIndex = (index: TormaysIndex | undefined) => {
  if (index === null || index === undefined) return LIIKENNEHAITTA_STATUS.BLUE;
  if (index === 0) return LIIKENNEHAITTA_STATUS.GREY;
  if (index < 3) return LIIKENNEHAITTA_STATUS.GREEN;
  if (index < 4) return LIIKENNEHAITTA_STATUS.YELLOW;
  return LIIKENNEHAITTA_STATUS.RED;
};

export const getColorByStatus = (status: LIIKENNEHAITTA_STATUS, opacity = 1) =>
  $enum.mapValue(status).with({
    [LIIKENNEHAITTA_STATUS.BLUE]: getColorWithOpacity(null, opacity),
    [LIIKENNEHAITTA_STATUS.GREY]: getColorWithOpacity(LIIKENNEHAITTA_STATUS.GREY, opacity),
    [LIIKENNEHAITTA_STATUS.GREEN]: getColorWithOpacity(LIIKENNEHAITTA_STATUS.GREEN, opacity),
    [LIIKENNEHAITTA_STATUS.YELLOW]: getColorWithOpacity(LIIKENNEHAITTA_STATUS.YELLOW, opacity),
    [LIIKENNEHAITTA_STATUS.RED]: getColorWithOpacity(LIIKENNEHAITTA_STATUS.RED, opacity),
    [LIIKENNEHAITTA_STATUS.LAVENDER_BLUE]: getColorWithOpacity(
      LIIKENNEHAITTA_STATUS.LAVENDER_BLUE,
      opacity,
    ),
  });
