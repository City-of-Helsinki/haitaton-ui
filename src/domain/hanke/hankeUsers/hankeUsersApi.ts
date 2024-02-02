import api from '../../api/api';
import { HankeUser, IdentificationResponse, SignedInUser, SignedInUserByHanke } from './hankeUser';
import { Yhteyshenkilo } from '../edit/types';

export async function createHankeUser({
  hankeTunnus,
  user,
}: {
  hankeTunnus: string;
  user: Yhteyshenkilo;
}) {
  const { data } = await api.post<HankeUser>(`hankkeet/${hankeTunnus}/kayttajat`, user);
  return data;
}

export async function getUser(id?: string) {
  const { data } = await api.get<HankeUser>(`/kayttajat/${id}`);
  return data;
}

export async function getHankeUsers(hankeTunnus?: string) {
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

export async function updateSelf({
  hankeTunnus,
  user,
}: {
  hankeTunnus: string;
  user: Pick<HankeUser, 'sahkoposti' | 'puhelinnumero'>;
}) {
  const { data } = await api.put<HankeUser>(`hankkeet/${hankeTunnus}/kayttajat/self`, user);
  return data;
}

// Get user id and rights of the signed in user for a hanke
export async function getSignedInUserForHanke(hankeTunnus?: string): Promise<SignedInUser> {
  const { data } = await api.get<SignedInUser>(`hankkeet/${hankeTunnus}/whoami`);
  return data;
}

export async function getSignedInUserByHanke(): Promise<SignedInUserByHanke> {
  const { data } = await api.get<SignedInUserByHanke>('my-permissions');
  return data;
}

export async function identifyUser(id: string) {
  const { data } = await api.post<IdentificationResponse>('kayttajat', { tunniste: id });
  return data;
}

export async function resendInvitation(kayttajaId: string) {
  await api.post(`kayttajat/${kayttajaId}/kutsu`);
  return kayttajaId;
}
