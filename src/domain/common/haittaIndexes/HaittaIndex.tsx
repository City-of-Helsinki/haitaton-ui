import { Box, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import HaittaIndexNumber from './HaittaIndexNumber';
import HaittaIndexTooltip from './HaittaIndexTooltip';

type Props = {
  index?: number;
  tooltipContent?: React.ReactNode;
  testId?: string;
  showTooltip?: boolean;
};

export default function HaittaIndex({
  index,
  tooltipContent,
  testId,
  showTooltip = false,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <Flex flexDirection="column" alignItems="center">
      <Flex alignItems="center" gap="var(--spacing-3-xs)">
        <Box as="p" fontSize="var(--fontsize-body-s)" gap="var(--spacing-2-xs)">
          {t('hankeIndexes:haittaindeksi')}
        </Box>
        {tooltipContent ? <HaittaIndexTooltip>{tooltipContent}</HaittaIndexTooltip> : null}
      </Flex>
      <HaittaIndexNumber
        index={index}
        testId={testId}
        tooltipContent={tooltipContent}
        showTooltip={showTooltip}
      />
    </Flex>
  );
}
