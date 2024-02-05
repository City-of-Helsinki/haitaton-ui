import { faker } from '@faker-js/faker';
import usersData from './users-data.json';
import { AccessRightLevel, HankeUser, HankeUserSelf } from '../../hanke/hankeUsers/hankeUser';
import { Yhteyshenkilo } from '../../hanke/edit/types';

let users = [...usersData];

function mapToHankeUser(user: (typeof users)[0]): HankeUser {
  return {
    id: user.id,
    sahkoposti: user.sahkoposti,
    etunimi: user.etunimi,
    sukunimi: user.sukunimi,
    puhelinnumero: user.puhelinnumero,
    kayttooikeustaso: user.kayttooikeustaso as AccessRightLevel,
    roolit: user.roolit,
    tunnistautunut: user.tunnistautunut,
  };
}

export async function read(id: string): Promise<HankeUser | undefined> {
  return users.map(mapToHankeUser).find((user) => user.id === id);
}

export async function readAll(hankeTunnus: string): Promise<HankeUser[]> {
  return users.filter((user) => user.hankeTunnus === hankeTunnus).map(mapToHankeUser);
}

export async function create(hankeTunnus: string, user: Yhteyshenkilo) {
  const newUser: HankeUser = {
    id: faker.string.uuid(),
    etunimi: user.etunimi,
    sukunimi: user.sukunimi,
    sahkoposti: user.sahkoposti,
    puhelinnumero: user.puhelinnumero,
    kayttooikeustaso: AccessRightLevel.KATSELUOIKEUS,
    roolit: [],
    tunnistautunut: false,
  };
  users.push({ ...newUser, hankeTunnus });
  return newUser;
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
          roolit: modifiedUser.roolit,
        };
      }
      return user;
    });
}

export async function updateSelf(
  hankeTunnus: string,
  modifiedUser: HankeUserSelf & { id: string },
) {
  users = users
    .filter((user) => user.hankeTunnus === hankeTunnus)
    .map((user) => {
      if (modifiedUser.id === user.id) {
        return {
          ...user,
          sahkoposti: modifiedUser.sahkoposti,
          puhelinnumero: modifiedUser.puhelinnumero,
        };
      }
      return user;
    });
  return users.find((user) => user.id === modifiedUser.id);
}
