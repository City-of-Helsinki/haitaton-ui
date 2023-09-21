import usersData from './users-data.json';
import { AccessRightLevel, HankeUser } from '../../hanke/hankeUsers/hankeUser';

let users = [...usersData];

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

export async function update(hankeTunnus: string, modifiedUsers: HankeUser[]) {
  users = users
    .filter((user) => user.hankeTunnus === hankeTunnus)
    .map((user) => {
      const modifiedUser = modifiedUsers.find((userToFind) => userToFind.id === user.id);
      if (modifiedUser !== undefined) {
        return {
          ...user,
          kayttooikeustaso: modifiedUser.kayttooikeustaso as AccessRightLevel,
        };
      }
      return user;
    });
}
