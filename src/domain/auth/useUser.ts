import { useQuery } from 'react-query';
import { User, useAuthenticatedUser } from 'hds-react';
import { getProfiiliNimi } from './profiiliApi';

export default function useUser(): User | null {
  const user = useAuthenticatedUser();

  const { data: profiiliNimi } = useQuery('profiiliNimi', getProfiiliNimi, {
    staleTime: Infinity,
    enabled: Boolean(user),
  });

  if (!user || !profiiliNimi) {
    return null;
  }

  return {
    ...user,
    profile: {
      ...user.profile,
      name: profiiliNimi.givenName + '  ' + profiiliNimi.lastName,
    },
    toStorageString: () => JSON.stringify(user),
    expires_in: user.expires_in,
    expired: user.expired,
    scopes: user.scopes,
  };
}
