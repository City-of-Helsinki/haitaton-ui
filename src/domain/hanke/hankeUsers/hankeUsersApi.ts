import api from '../../api/api';
import {
  DeleteInfo,
  HankeUser,
  IdentificationResponse,
  SignedInUser,
  SignedInUserByHanke,
} from './hankeUser';
import { Yhteyshenkilo, YhteyshenkiloWithoutName } from '../edit/types';

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

export async function getHankeUsers(hankeTunnus?: string | null) {
  const { data } = await api.get<{ kayttajat: HankeUser[] }>(`hankkeet/${hankeTunnus}/kayttajat`);
  return data.kayttajat;
}

// Update permissions of the listed users
export async function updateHankeUsersPermissions({
  hankeTunnus,
  users,
}: {
  hankeTunnus: string;
  users: Pick<HankeUser, 'id' | 'kayttooikeustaso'>[];
}) {
  await api.put(`hankkeet/${hankeTunnus}/kayttajat`, { kayttajat: users });
}

// Update the contact information of a user
export async function updateHankeUser({
  hankeTunnus,
  userId,
  user,
}: {
  hankeTunnus: string;
  userId: string;
  user: Yhteyshenkilo | YhteyshenkiloWithoutName;
}) {
  const { data } = await api.put<HankeUser>(`hankkeet/${hankeTunnus}/kayttajat/${userId}`, user);
  return data;
}

export async function updateSelf({
  hankeTunnus,
  user,
}: {
  hankeTunnus: string;
  user: YhteyshenkiloWithoutName;
}) {
  const { data } = await api.put<HankeUser>(`hankkeet/${hankeTunnus}/kayttajat/self`, user);
  return data;
}

// Get user id and rights of the signed-in user for a hanke
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

/**
 * Resend invitation to hanke to a user
 */
export async function resendInvitation(kayttajaId: string) {
  const { data } = await api.post<HankeUser>(`kayttajat/${kayttajaId}/kutsu`);
  return data;
}

export async function getUserDeleteInfo(kayttajaId?: string | null) {
  const { data } = await api.get<DeleteInfo>(`kayttajat/${kayttajaId}/deleteInfo`);
  return data;
}

export async function deleteUser(kayttajaId?: string) {
  await api.delete(`kayttajat/${kayttajaId}`);
}
