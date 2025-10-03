import { LoginProviderProps } from 'hds-react';
import { LOGIN_CALLBACK_PATH, LOGOUT_PATH } from './constants';

const { origin } = window.location;

export const loginProviderProps: LoginProviderProps = {
  userManagerSettings: {
    authority: String(window._env_.REACT_APP_OIDC_AUTHORITY || ''),
    client_id: String(window._env_.REACT_APP_OIDC_CLIENT_ID || ''),
    scope: String(window._env_.REACT_APP_OIDC_SCOPE || ''),
    redirect_uri: `${origin}${LOGIN_CALLBACK_PATH}`,
    post_logout_redirect_uri: `${origin}${LOGOUT_PATH}`,
  },
  apiTokensClientSettings: {
    url: String(window._env_.REACT_APP_OIDC_API_TOKENS_URL || ''),
    queryProps: {
      grantType: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      permission: '#access',
    },
    audiences: [String(window._env_.REACT_APP_OIDC_AUDIENCE_BACKEND || '')],
  },
  sessionPollerSettings: { pollIntervalInMs: 60000 },
};
