import React, { useEffect, useRef, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Link as HDSLink } from 'hds-react';
import authService from '../authService';
import Text from '../../../common/components/text/Text';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import Link from '../../../common/components/Link/Link';

type AuthenticationError = 'deviceTimeError' | 'permissionDeniedByUserError' | 'unknown';

type AuthErrorProps = {
  errorText: string;
};

const AuthError = ({ errorText }: AuthErrorProps) => {
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [authenticationError, setAuthenticationError] = useState<AuthenticationError | null>(null);
  const endLoginCalled = useRef(false);

  useEffect(() => {
    if (endLoginCalled.current) {
      return;
    }

    endLoginCalled.current = true;

    authService
      .endLogin()
      .then(() => {
        navigate('/');
      })
      .catch((error: Error) => {
        // Handle error caused by device time being more than 5 minutes off
        if (
          error.message.includes('iat is in the future') ||
          error.message.includes('exp is in the past')
        ) {
          setAuthenticationError('deviceTimeError');
        } else if (
          // Handle error caused by end user choosing Deny in Tunnistamo's
          // permission request
          error.message === 'The resource owner or authorization server denied the request'
        ) {
          setAuthenticationError('permissionDeniedByUserError');
        } else {
          // Give user a generic error
          setAuthenticationError('unknown');
        }
      });
  }, [navigate, t]);

  return (
    <>
      {authenticationError === 'deviceTimeError' && (
        <AuthError errorText={t('authentication:deviceTimeError')} />
      )}
      {authenticationError === 'permissionDeniedByUserError' && (
        <AuthError errorText={t('authentication:permissionRequestDenied')} />
      )}
      {authenticationError === 'unknown' && (
        <AuthError errorText={t('authentication:genericError')} />
      )}
    </>
  );
};

export default OidcCallback;
