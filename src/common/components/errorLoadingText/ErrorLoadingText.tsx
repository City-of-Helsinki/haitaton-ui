import React from 'react';
import { Box } from '@chakra-ui/react';
import { IconAlertCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';
import Text from '../text/Text';

function ErrorLoadingText() {
  const { t } = useTranslation();

  return (
    <Box textAlign="center" my="var(--spacing-2-xl)">
      <IconAlertCircle size="l" style={{ marginBottom: 'var(--spacing-m)' }} />
      <Text tag="p" styleAs="body-xl" weight="bold">
        {t('common:components:errorLoadingInfo:textTop')}
      </Text>
      <Text tag="p" styleAs="body-xl" weight="bold">
        {t('common:components:errorLoadingInfo:textBottom')}
      </Text>
    </Box>
  );
}

export default ErrorLoadingText;
