import { faker } from '@faker-js/faker';
import usersData from './users-data.json';
import { AccessRightLevel, HankeUser, HankeUserSelf } from '../../hanke/hankeUsers/hankeUser';
import { Yhteyshenkilo } from '../../hanke/edit/types';
import ApiError from '../apiError';

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

async function readFromHanke(hankeTunnus: string, id: string): Promise<HankeUser | undefined> {
  return (await readAll(hankeTunnus)).find((user) => user.id === id);
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

export async function updatePermissions(
  hankeTunnus: string,
  modifiedUsers: Pick<HankeUser, 'id' | 'kayttooikeustaso'>[],
) {
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

export async function update(
  hankeTunnus: string,
  userId: string,
  updates: Yhteyshenkilo | HankeUserSelf,
) {
  const userToUpdate = await readFromHanke(hankeTunnus, userId);
  if (!userToUpdate) {
    throw new ApiError('User not found', 404);
  }
  const updatedUser = Object.assign(userToUpdate, updates);
  users = users.map((user) => {
    return user.id === updatedUser?.id ? { ...updatedUser, hankeTunnus } : user;
  });
  return updatedUser;
}
