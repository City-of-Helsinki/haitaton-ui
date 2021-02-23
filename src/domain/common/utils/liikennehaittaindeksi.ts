import { $enum } from 'ts-enum-util';

/*
Note: RGBA values doesnt work with openlayers?

const opacity = '0.1';
export const INDEX_RED = `rgba(196, 18, 62, ${opacity})`;
export const INDEX_YELLOW = `rgba(255, 218, 7, ${opacity})`;
export const INDEX_GREEN = `#rgba(0, 146, 70, ${opacity})`;
export const INDEX_BLUE = `rgba(36, 114, 198, ${opacity})`;
*/

type TormaysIndex = null | number;

export const INDEX_RED = '#c4123e';
export const INDEX_YELLOW = '#ffda07';
export const INDEX_GREEN = '#009246';
export const INDEX_BLUE = '#2472c6';

export enum LIIKENNEHAITTA_STATUS {
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
}

export const getStatusByIndex = (index: TormaysIndex) => {
  if (index === null) return LIIKENNEHAITTA_STATUS.BLUE;
  if (index < 3) return LIIKENNEHAITTA_STATUS.GREEN;
  if (index < 4) return LIIKENNEHAITTA_STATUS.YELLOW;
  return LIIKENNEHAITTA_STATUS.RED;
};

export const getColorByStatus = (status: LIIKENNEHAITTA_STATUS) =>
  $enum.mapValue(status).with({
    [LIIKENNEHAITTA_STATUS.BLUE]: INDEX_BLUE,
    [LIIKENNEHAITTA_STATUS.GREEN]: INDEX_GREEN,
    [LIIKENNEHAITTA_STATUS.YELLOW]: INDEX_YELLOW,
    [LIIKENNEHAITTA_STATUS.RED]: INDEX_RED,
  });
