import { faker } from '@faker-js/faker';
import usersData from './users-data.json';
import { AccessRightLevel, HankeUser } from '../../hanke/hankeUsers/hankeUser';
import { Yhteyshenkilo, YhteyshenkiloWithoutName } from '../../hanke/edit/types';
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
    kutsuttu: user.kutsuttu,
  };
}

export async function reset() {
  users = [...usersData];
}

export async function read(id: string): Promise<HankeUser | undefined> {
  return users.map(mapToHankeUser).find((user) => user.id === id);
}

export async function readAll(hankeTunnus: string): Promise<HankeUser[]> {
  return users.filter((user) => user.hankeTunnus === hankeTunnus).map(mapToHankeUser);
}

export async function readCurrent(): Promise<HankeUser | undefined> {
  const currentUser = users
    .map(mapToHankeUser)
    .find((user) => user.sahkoposti === 'matti.meikalainen@test.com');
  console.log('currentUser', currentUser);
  return currentUser;
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
    kutsuttu: new Date().toISOString(),
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
  updates: Yhteyshenkilo | YhteyshenkiloWithoutName,
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

export async function remove(userId: string) {
  const userToRemove = await read(userId);
  if (!userToRemove) {
    throw new ApiError(`No user with id ${userId}`, 404);
  }
  users = users.filter((user) => user.id !== userToRemove.id);
}

export async function resendInvitation(userId: string) {
  const user = await read(userId);
  if (!user) {
    throw new ApiError(`No user with id ${userId}`, 404);
  }
  user.kutsuttu = new Date().toISOString();
  return user;
}
