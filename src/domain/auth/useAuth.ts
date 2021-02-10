import React from 'react';
import authService from './authService';

/* eslint-disable camelcase */
export interface Profile {
  acr: string;
  auth_time: number;
  authorities: 'ROLE_offline_access' | 'ROLE_uma_authorization' | 'ROLE_haitaton-user';
  azp: 'haitaton-ui';
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  jti: '64dc4fd9-56e3-40ed-8358-ccfa32bb2036';
  name: string;
  preferred_username: string;
  s_hash: string;
  session_state: string;
  sub: string;
  typ: 'ID';
  user_name: string;
}
/* eslint-enable  */

interface AuthState {
  profile: Partial<Profile> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

function useProfile(): AuthState {
  // Temporary hack to bybass auth in e2e tests
  const [profile, setProfile] = React.useState<Partial<Profile> | null>(
    process.env.REACT_APP_ENV === 'e2e' ? {} : null
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    // Temporary hack to bybass auth in e2e tests
    let ignore = process.env.REACT_APP_ENV === 'e2e';

    function getUser() {
      setIsLoading(true);

      authService
        .getUser()
        .then((user) => {
          if (ignore) {
            return;
          }

          setProfile(user ? ((user.profile as unknown) as Profile) : null);
        })
        .catch(() => {
          if (ignore) {
            return;
          }

          setError(Error('User was not found'));
        })
        .finally(() => {
          if (ignore) {
            return;
          }

          setIsLoading(false);
        });
    }

    getUser();

    return () => {
      ignore = true;
    };
  }, []);

  return {
    profile,
    isAuthenticated: !!profile,
    isLoading,
    error,
  };
}

export default useProfile;
