import api from '../../api/api';
import { HankeUser, SignedInUser } from './hankeUser';

export async function getHankeUsers(hankeTunnus: string) {
  const { data } = await api.get<{ kayttajat: HankeUser[] }>(`hankkeet/${hankeTunnus}/kayttajat`);
  return data.kayttajat;
}

export async function updateHankeUsers({
  hankeTunnus,
  users,
}: {
  hankeTunnus: string;
  users: Pick<HankeUser, 'id' | 'kayttooikeustaso'>[];
}) {
  const { data } = await api.put(`hankkeet/${hankeTunnus}/kayttajat`, { kayttajat: users });
  return data;
}

// Get user id and rights of the signed in user
export async function getSignedInUser(hankeTunnus?: string): Promise<SignedInUser> {
  const { data } = await api.get<SignedInUser>(`hankkeet/${hankeTunnus}/whoami`);
  return data;
}
