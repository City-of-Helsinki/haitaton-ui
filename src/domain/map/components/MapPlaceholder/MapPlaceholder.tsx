import { Box, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

/**
 * Shows a placeholder text for the map when there are no areas to display.
 */
export default function MapPlaceholder() {
  const { t } = useTranslation();

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="321px"
      backgroundColor="var(--color-black-10)"
    >
      <Box as="p" fontSize="var(--fontsize-body-s)">
        {t('hankePortfolio:noAreas')}
      </Box>
    </Flex>
  );
}
