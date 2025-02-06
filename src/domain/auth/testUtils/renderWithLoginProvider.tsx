import { render } from '@testing-library/react';
import {
  Beacon,
  ConnectedModule,
  LoginProvider,
  OidcClient,
  OidcClientError,
  OidcClientProps,
  OidcClientState,
  triggerForAllOidcClientSignals,
} from 'hds-react';
import { createUser } from './userTestUtil';
import userEvent from '@testing-library/user-event';

const authority = 'https://api.hel.fi/sso/openid';
const client_id = 'test-client';
const scope = 'openid profile';
const oidcClientTestProps: OidcClientProps = {
  userManagerSettings: {
    authority,
    client_id,
    scope,
  },
};

export type RenderWithLoginProviderProps = {
  state: OidcClientState;
  returnUser: boolean;
  placeUserToStorage?: boolean;
  userADGroups?: string[];
  errorType?: 'SIGNIN_ERROR' | 'INVALID_OR_EXPIRED_USER' | 'RENEWAL_FAILED';
  children?: React.ReactNode;
};

export function renderWithLoginProvider({
  state,
  returnUser,
  placeUserToStorage = true,
  userADGroups,
  errorType,
  children,
}: RenderWithLoginProviderProps) {
  let beacon: Beacon;
  const handleError = new OidcClientError('Handlecallback failed', errorType ?? 'SIGNIN_ERROR');
  const helperModule: ConnectedModule = {
    namespace: 'helper',
    connect: (targetBeacon) => {
      beacon = targetBeacon;
      beacon.addListener(triggerForAllOidcClientSignals, (signal) => {
        const user = createUser(placeUserToStorage, userADGroups);
        const oidcClient = signal.context as OidcClient;
        jest.spyOn(oidcClient, 'getState').mockReturnValue(state);
        jest.spyOn(oidcClient, 'getUser').mockReturnValue(user);
        if (!returnUser) {
          jest.spyOn(oidcClient, 'handleCallback').mockRejectedValue(handleError);
        } else {
          jest.spyOn(oidcClient, 'handleCallback').mockResolvedValue(user);
        }
      });
    },
  };

  return {
    user: userEvent.setup(),
    ...render(
      <LoginProvider {...oidcClientTestProps} modules={[helperModule]}>
        {children}
      </LoginProvider>,
    ),
  };
}
