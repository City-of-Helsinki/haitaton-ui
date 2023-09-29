import api from '../../api/api';
import { HankeUser, IdentificationResponse, SignedInUser } from './hankeUser';

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

// Get user id and rights of the signed in user for a hanke
export async function getSignedInUserForHanke(hankeTunnus?: string): Promise<SignedInUser> {
  const { data } = await api.get<SignedInUser>(`hankkeet/${hankeTunnus}/whoami`);
  return data;
}

export async function identifyUser(id: string) {
  const { data } = await api.post<IdentificationResponse>('kayttajat', { tunniste: id });
  return data;
}
