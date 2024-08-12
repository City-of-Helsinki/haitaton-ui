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
      {showLabel ? (
        <Box as="p" fontSize="var(--fontsize-body-s)" mb="var(--spacing-3-xs)">
          {t('hankeIndexes:haittaindeksi')}
        </Box>
      ) : null}
      <Flex alignItems="flex-start" gap="var(--spacing-3-xs)">
        <HaittaIndexNumber
          index={index}
          testId={testId}
          tooltipContent={tooltipContent}
          showTooltip={showTooltip}
          showColorByIndex={showColorByIndex}
        />
        {tooltipContent ? <HaittaIndexTooltip>{tooltipContent}</HaittaIndexTooltip> : null}
      </Flex>
    </Flex>
  );
}
