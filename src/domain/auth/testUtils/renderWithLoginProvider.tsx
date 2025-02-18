import { render } from '@testing-library/react';
import {
  Beacon,
  ConnectedModule,
  LoginProvider,
  OidcClient,
  OidcClientError,
  OidcClientProps,
  OidcClientState,
  Profile,
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
  userProfile?: Partial<Profile>;
  errorType?: 'SIGNIN_ERROR' | 'INVALID_OR_EXPIRED_USER' | 'RENEWAL_FAILED';
  children?: React.ReactNode;
};

export function renderWithLoginProvider({
  state,
  returnUser,
  placeUserToStorage = true,
  userProfile,
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
        const user = createUser(placeUserToStorage, userProfile);
        const oidcClient = signal.context as OidcClient;
        jest.spyOn(oidcClient, 'getState').mockReturnValue(state);
        jest.spyOn(oidcClient, 'getUser').mockReturnValue(user);
        jest
          .spyOn(oidcClient, 'getAmr')
          .mockReturnValue(userProfile?.ad_groups === undefined ? ['suomi_fi'] : ['helsinkiad']);
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
