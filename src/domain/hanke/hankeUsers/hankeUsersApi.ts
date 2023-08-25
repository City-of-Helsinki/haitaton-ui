import api from '../../api/api';
import { HankeUser } from './hankeUser';

export async function getHankeUsers(hankeTunnus: string) {
  const { data } = await api.get<{ kayttajat: HankeUser[] }>(`hankkeet/${hankeTunnus}/kayttajat`);
  return data.kayttajat;
}
