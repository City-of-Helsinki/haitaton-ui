import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, VisuallyHidden } from '@chakra-ui/react';
import {
  LIIKENNEHAITTA_STATUS,
  getStatusByIndex,
  getColorByStatus,
  TormaysIndex,
} from '../utils/liikennehaittaindeksi';

type Props = { index?: TormaysIndex; testId?: string };

const HaittaIndexNumber: React.FC<Props> = ({ index, testId }) => {
  const { t } = useTranslation();

  return (
    <Box
      backgroundColor={getColorByStatus(getStatusByIndex(index))}
      color={getStatusByIndex(index) === LIIKENNEHAITTA_STATUS.YELLOW ? 'black' : 'white'}
      width="40px"
      fontSize="var(--fontsize-body-m)"
      textAlign="center"
      py="3px"
      data-testid={testId}
    >
      <VisuallyHidden>{t('common:haittaIndex:haittaIndexNumber')}</VisuallyHidden>
      {index === undefined ? '-' : index}
    </Box>
  );
};

export default HaittaIndexNumber;
