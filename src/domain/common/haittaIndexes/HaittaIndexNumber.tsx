import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, VisuallyHidden } from '@chakra-ui/react';
import {
  LIIKENNEHAITTA_STATUS,
  getStatusByIndex,
  getColorByStatus,
  TormaysIndex,
} from '../utils/liikennehaittaindeksi';
import HaittaIndexTooltip from './HaittaIndexTooltip';

type Props = {
  index?: TormaysIndex;
  testId?: string;
  tooltipContent?: React.ReactNode;
  showTooltip?: boolean;
  showColorByIndex?: boolean;
};

const HaittaIndexNumber: React.FC<Props> = ({
  index,
  testId,
  tooltipContent,
  showTooltip = false,
  showColorByIndex = true,
}) => {
  const { t } = useTranslation();

  const status = getStatusByIndex(index);

  return (
    <Box display="flex" alignItems="center" flexDirection="row" gap="8px">
      <Box
        backgroundColor={
          showColorByIndex ? getColorByStatus(status) : 'var(--color-coat-of-arms-light)'
        }
        color={
          status === LIIKENNEHAITTA_STATUS.YELLOW ||
          status === LIIKENNEHAITTA_STATUS.GREY ||
          !showColorByIndex
            ? 'black'
            : 'white'
        }
        border={showColorByIndex ? 'none' : '1px solid var(--color-black)'}
        width="40px"
        fontSize="var(--fontsize-body-m)"
        textAlign="center"
        py="3px"
        data-testid={testId}
      >
        <VisuallyHidden>{t('common:haittaIndex:haittaIndexSelite')}</VisuallyHidden>
        {index === undefined ? '-' : index}
      </Box>
      <div aria-hidden>
        {showTooltip && tooltipContent ? (
          <HaittaIndexTooltip>{tooltipContent}</HaittaIndexTooltip>
        ) : null}
      </div>
    </Box>
  );
};

export default HaittaIndexNumber;
