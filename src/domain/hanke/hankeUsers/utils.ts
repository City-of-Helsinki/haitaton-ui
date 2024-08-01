import { HankeUser, SignedInUser } from './hankeUser';
import { HankeYhteyshenkilo } from '../../types/hanke';
import { Contact } from '../../application/types/application';

export function mapHankeUserToHankeYhteyshenkilo({
  id,
  etunimi,
  sukunimi,
  sahkoposti,
  puhelinnumero,
}: HankeUser): HankeYhteyshenkilo {
  return {
    id,
    etunimi,
    sukunimi,
    sahkoposti,
    puhelinnumero,
  };
}

export function mapHankeUserToContact({
  id,
  etunimi,
  sukunimi,
  sahkoposti,
  puhelinnumero,
}: HankeUser): Contact {
  return {
    hankekayttajaId: id,
    firstName: etunimi,
    lastName: sukunimi,
    email: sahkoposti,
    phone: puhelinnumero,
  };
}

const userRoleSortOrder = ['OMISTAJA', 'RAKENNUTTAJA', 'TOTEUTTAJA', 'MUU'];

export const userRoleSorter = (a: string, b: string) => {
  const indexA = userRoleSortOrder.indexOf(a);
  const indexB = userRoleSortOrder.indexOf(b);

  if (indexA === -1 && indexB === -1) {
    // If both elements are not in sortOrder, maintain their original order
    return 0;
  } else if (indexA === -1) {
    // If only 'a' is not in sortOrder, 'a' comes after 'b'
    return 1;
  } else if (indexB === -1) {
    // If only 'b' is not in sortOrder, 'a' comes before 'b'
    return -1;
  } else {
    // Compare based on their indices in sortOrder
    return indexA - indexB;
  }
};

export function showUserDeleteButton(
  user: HankeUser,
  hankeUsers?: HankeUser[],
  signedInUser?: SignedInUser,
) {
  // Check if user is the only identified user with all rights
  const usersWithAllRights = hankeUsers?.filter(
    (hankeUser) => hankeUser.kayttooikeustaso === 'KAIKKI_OIKEUDET' && hankeUser.tunnistautunut,
  );
  const isOnlyWithAllRights =
    usersWithAllRights?.length === 1 && usersWithAllRights[0].id === user.id;

  return Boolean(signedInUser?.kayttooikeudet.includes('DELETE_USER') && !isOnlyWithAllRights);
}
