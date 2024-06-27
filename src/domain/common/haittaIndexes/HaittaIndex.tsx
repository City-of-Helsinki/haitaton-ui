import { Box, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import HaittaIndexNumber from './HaittaIndexNumber';
import HaittaIndexTooltip from './HaittaIndexTooltip';
import React from 'react';

type Props = {
  index?: number;
  showLabel?: boolean;
  tooltipContent?: React.ReactNode;
  testId?: string;
  showTooltip?: boolean;
  showColorByIndex?: boolean;
};

export default function HaittaIndex({
  index,
  showLabel = true,
  tooltipContent,
  testId,
  showTooltip = false,
  showColorByIndex,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <Flex flexDirection="column" alignItems="center">
      <Flex alignItems="center" gap="var(--spacing-3-xs)">
        {showLabel ? (
          <Box as="p" fontSize="var(--fontsize-body-s)" gap="var(--spacing-2-xs)">
            {t('hankeIndexes:haittaindeksi')}
          </Box>
        ) : null}
        {tooltipContent ? <HaittaIndexTooltip>{tooltipContent}</HaittaIndexTooltip> : null}
      </Flex>
      <HaittaIndexNumber
        index={index}
        testId={testId}
        tooltipContent={tooltipContent}
        showTooltip={showTooltip}
        showColorByIndex={showColorByIndex}
      />
    </Flex>
  );
}
