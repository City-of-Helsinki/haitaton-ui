import React from 'react';
import { Box } from '@chakra-ui/react';
import { IconAlertCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';
import Text from '../text/Text';

type Props = {
  children?: React.ReactNode;
};

function ErrorLoadingText({ children }: Props) {
  const { t } = useTranslation();

  const childCount = React.Children.count(children);

  return (
    <Box textAlign="center" my="var(--spacing-2-xl)">
      <IconAlertCircle size="l" style={{ marginBottom: 'var(--spacing-m)' }} />
      {childCount > 0 ? (
        <div>{children}</div>
      ) : (
        <>
          <Text tag="p" styleAs="body-xl" weight="bold">
            {t('common:components:errorLoadingInfo:textTop')}
          </Text>
          <Text tag="p" styleAs="body-xl" weight="bold">
            {t('common:components:errorLoadingInfo:textBottom')}
          </Text>
        </>
      )}
    </Box>
  );
}

export default ErrorLoadingText;
