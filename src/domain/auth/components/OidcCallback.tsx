import { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';
import { Link as HDSLink, LoginCallbackHandler, OidcClientError } from 'hds-react';
import Text from '../../../common/components/text/Text';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import Link from '../../../common/components/Link/Link';

type AuthenticationError = 'permissionDeniedByUserError' | 'unknown';

type AuthErrorProps = {
  errorText: string;
};

const AuthError = ({ errorText }: Readonly<AuthErrorProps>) => {
  const { HOME } = useLocalizedRoutes();

  return (
    <Flex
      as="article"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      maxWidth="650px"
      mx="auto"
      mt="var(--spacing-3-xl)"
      px="var(--spacing-s)"
    >
      <Text tag="h1" styleAs="h1" weight="bold" spacingBottom="l">
        {errorText}
      </Text>
      <Text tag="p" spacingBottom="m">
        <Trans
          i18nKey="authentication:homePageLink"
          components={{
            a: <Link href={HOME.path}>etusivulle</Link>,
          }}
        />
      </Text>
      <Text tag="p" spacingBottom="m">
        <Trans
          i18nKey="authentication:supportLink"
          components={{
            a: <HDSLink href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</HDSLink>,
          }}
        />
      </Text>
    </Flex>
  );
};

const OidcCallback = () => {
  const { t } = useTranslation();
  const [authenticationError, setAuthenticationError] = useState<AuthenticationError | null>(null);

  function onSuccess() {
    window.location.pathname = '/';
  }

  function onError(error?: OidcClientError) {
    if (error?.isSignInError) {
      setAuthenticationError('permissionDeniedByUserError');
    } else {
      setAuthenticationError('unknown');
    }
  }

  return (
    <LoginCallbackHandler onSuccess={onSuccess} onError={onError}>
      <>
        {authenticationError === 'permissionDeniedByUserError' && (
          <AuthError errorText={t('authentication:permissionRequestDenied')} />
        )}
        {authenticationError === 'unknown' && (
          <AuthError errorText={t('authentication:genericError')} />
        )}
      </>
    </LoginCallbackHandler>
  );
};

export default OidcCallback;
