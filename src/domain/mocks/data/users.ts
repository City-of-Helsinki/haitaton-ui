import { faker } from '@faker-js/faker';
import usersData from './users-data.json';
import { AccessRightLevel, HankeUser } from '../../hanke/hankeUsers/hankeUser';
import { ContactPerson } from '../../hanke/edit/types';

let users = [...usersData];

export async function readAll(hankeTunnus: string): Promise<HankeUser[]> {
  return users
    .filter((user) => user.hankeTunnus === hankeTunnus)
    .map((user) => ({
      id: user.id,
      sahkoposti: user.sahkoposti,
      nimi: user.nimi,
      etunimi: user.etunimi,
      sukunimi: user.sukunimi,
      kayttooikeustaso: user.kayttooikeustaso as AccessRightLevel,
      tunnistautunut: user.tunnistautunut,
    }));
}

export async function create(hankeTunnus: string, user: ContactPerson) {
  const newUser: HankeUser = {
    id: faker.string.uuid(),
    etunimi: user.etunimi,
    sukunimi: user.sukunimi,
    sahkoposti: user.sahkoposti,
    nimi: `${user.etunimi} ${user.sukunimi}`,
    kayttooikeustaso: AccessRightLevel.KATSELUOIKEUS,
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
        };
      }
      return user;
    });
}
