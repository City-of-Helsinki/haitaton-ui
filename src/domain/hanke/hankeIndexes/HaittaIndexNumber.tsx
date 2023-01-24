import React from 'react';
import {
  LIIKENNEHAITTA_STATUS,
  getStatusByIndex,
  getColorByStatus,
  TormaysIndex,
} from '../../common/utils/liikennehaittaindeksi';

type Props = { index?: TormaysIndex; testId: string };

const HaittaIndexNumber: React.FC<Props> = ({ index, testId }) => {
  return (
    <div
      style={{
        backgroundColor: getColorByStatus(getStatusByIndex(index)),
        color: getStatusByIndex(index) === LIIKENNEHAITTA_STATUS.YELLOW ? 'black' : 'white',
        width: '38px',
        textAlign: 'center',
      }}
    >
      <div data-testid={testId}>{index === undefined ? '-' : index}</div>
    </div>
  );
};

export default HaittaIndexNumber;
