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
  isLoaded: boolean;
  error: Error | null;
}

function useProfile(): AuthState {
  const [profile, setProfile] = React.useState<Partial<Profile> | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let ignore = false;

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
          setIsLoaded(true);
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
    isLoaded,
    error,
  };
}

export default useProfile;
