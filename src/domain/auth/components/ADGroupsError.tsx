import { Box, Flex } from '@chakra-ui/react';
import { Link, useOidcClient } from 'hds-react';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import { Trans, useTranslation } from 'react-i18next';

export default function ADGroupsError() {
  const { t } = useTranslation();
  const oidcClient = useOidcClient();

  function logout() {
    oidcClient.logout();
  }

  return (
    <Flex
      as="article"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      mx="auto"
      mt={{ base: 'var(--spacing-xl)', md: 'var(--spacing-4-xl)' }}
      gap={{ base: 'var(--spacing-m)', md: 'var(--spacing-4-xl)' }}
      px="var(--spacing-s)"
    >
      <MainHeading>{t('authentication:noADPermissionHeading')}</MainHeading>
      <Box
        as="p"
        maxWidth="612px"
        fontSize={{ base: 'var(--fontsize-body-m)', md: 'var(--fontsize-body-l)' }}
      >
        <Trans
          i18nKey="authentication:noADPermissionText"
          components={{
            a: (
              <Box
                as={Link}
                href="#"
                fontSize={{ base: 'var(--fontsize-body-m)', md: 'var(--fontsize-body-l)' }}
                onClick={logout}
              >
                Kirjaudu ulos
              </Box>
            ),
          }}
        />
      </Box>
    </Flex>
  );
}
