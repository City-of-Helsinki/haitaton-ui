import { useAuthenticatedUser } from 'hds-react';

export default function useIsAuthenticated() {
  const user = useAuthenticatedUser();
  return Boolean(user);
}
