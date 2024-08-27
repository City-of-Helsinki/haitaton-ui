import { LoginProviderProps } from 'hds-react';
import { LOGIN_CALLBACK_PATH, LOGOUT_PATH } from './constants';

const { origin } = window.location;

export const loginProviderProps: LoginProviderProps = {
  userManagerSettings: {
    authority: window._env_.REACT_APP_OIDC_AUTHORITY,
    client_id: window._env_.REACT_APP_OIDC_CLIENT_ID,
    scope: window._env_.REACT_APP_OIDC_SCOPE,
    redirect_uri: `${origin}${LOGIN_CALLBACK_PATH}`,
    post_logout_redirect_uri: `${origin}${LOGOUT_PATH}`,
  },
  apiTokensClientSettings: { url: window._env_.REACT_APP_OIDC_API_TOKENS_URL },
  sessionPollerSettings: { pollIntervalInMs: 60000 },
};
