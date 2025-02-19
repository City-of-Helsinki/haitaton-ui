import { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Link as HDSLink,
  LoginCallbackHandler,
  OidcClientError,
  User,
  useOidcClient,
} from 'hds-react';
import Text from '../../../common/components/text/Text';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import Link from '../../../common/components/Link/Link';
import ADError from './ADError';
import hasAllowedADGroups from '../hasAllowedADGroups';
import { useNavigate } from 'react-router-dom';
import toStringArray from '../../../common/utils/toStringArray';

type AuthenticationError =
  | 'permissionDeniedByUserError'
  | 'unknown'
  | 'adGroupsError'
  | 'adNameError';

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
  const navigate = useNavigate();
  const oidcClient = useOidcClient();

  function onSuccess(user: User) {
    const { ad_groups, given_name, family_name } = user.profile;
    const useADFilter = window._env_.REACT_APP_USE_AD_FILTER === '1';
    const amr = oidcClient.getAmr();
    const helsinkiADUsed = amr?.includes('helsinkiad');

    if (helsinkiADUsed) {
      // Check if user has required AD groups (when login is done with AD and AD filtering is enabled).
      if (useADFilter && !hasAllowedADGroups(toStringArray(ad_groups))) {
        setAuthenticationError('adGroupsError');
        return;
      }
      // Check that user's given_name and family_name are defined and are not empty (when login is done with AD).
      if (!given_name || !family_name) {
        setAuthenticationError('adNameError');
        return;
      }
    }

    navigate('/', { replace: true });
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
        {authenticationError === 'adGroupsError' && (
          <ADError
            errorHeading={t('authentication:noADPermissionHeading')}
            errorTextKey="authentication:noADPermissionText"
          />
        )}
        {authenticationError === 'adNameError' && (
          <ADError
            errorHeading={t('authentication:noADUserNameHeading')}
            errorTextKey="authentication:noADUserNameText"
          />
        )}
      </>
    </LoginCallbackHandler>
  );
};

export default OidcCallback;
