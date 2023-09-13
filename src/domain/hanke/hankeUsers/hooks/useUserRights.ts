import { useQuery } from 'react-query';
import { SignedInUser } from './../hankeUser';
import { getSignedInUser } from '../hankeUsersApi';

export default function useSignedInUserRights(hankeTunnus?: string) {
  return useQuery<SignedInUser>(['signedInUser', hankeTunnus], () => getSignedInUser(hankeTunnus), {
    enabled: Boolean(hankeTunnus),
  });
}
