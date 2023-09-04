import usersData from './users-data.json';
import { AccessRightLevel, HankeUser } from '../../hanke/hankeUsers/hankeUser';

const users = [...usersData];

export async function readAll(hankeTunnus: string): Promise<HankeUser[]> {
  return users
    .filter((user) => user.hankeTunnus === hankeTunnus)
    .map((user) => ({
      id: user.id,
      sahkoposti: user.sahkoposti,
      nimi: user.nimi,
      kayttooikeustaso: user.kayttooikeustaso as AccessRightLevel,
      tunnistautunut: user.tunnistautunut,
    }));
}
