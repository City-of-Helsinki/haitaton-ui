import { Box, HStack } from '@chakra-ui/layout';
import { useTranslation } from 'react-i18next';
import HaittaIndex from '../haittaIndexes/HaittaIndex';
import HaittaTooltipContent from '../haittaIndexes/HaittaTooltipContent';

type Props = {
  index: number | undefined;
  haittojenhallintaTyyppi: string;
  heading?: string;
  showTooltipHeading?: boolean;
  testId?: string;
};

export default function HaittaIndexHeading({
  index,
  haittojenhallintaTyyppi,
  heading,
  showTooltipHeading = true,
  testId,
}: Readonly<Props>) {
  const { t } = useTranslation();
  return (
    <HStack spacing="12px">
      <Box as="h4" className="heading-s">
        {heading ?? t(`hankeIndexes:haittaindeksi`)}
      </Box>
      <HaittaIndex
        index={index}
        showLabel={false}
        testId={testId}
        tooltipContent={
          <HaittaTooltipContent
            translationKey={`hankeIndexes:tooltips:${haittojenhallintaTyyppi}`}
            showHeading={showTooltipHeading}
          />
        }
      />
    </HStack>
  );
}
