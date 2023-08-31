import api from '../../api/api';
import { HankeUser } from './hankeUser';

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
