import { Trans, useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';

type Props = {
  translationKey: string;
  showHeading?: boolean;
};

export default function HaittaTooltipContent({
  translationKey,
  showHeading = true,
}: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <>
      {showHeading && (
        <Box as="h5" fontWeight="bold">
          {t('hankeIndexes:haittaindeksit')}:
        </Box>
      )}
      <Trans
        i18nKey={translationKey}
        components={{ ul: <Box as="ul" listStyleType="none" />, li: <li /> }}
      />
    </>
  );
}
