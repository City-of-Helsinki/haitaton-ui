import { HankeUser, SignedInUser } from './hankeUser';
import { HankeYhteyshenkilo } from '../../types/hanke';

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
  const isOnlyWithAllRights =
    user.kayttooikeustaso === 'KAIKKI_OIKEUDET' &&
    hankeUsers?.filter((hankeUser) => hankeUser.kayttooikeustaso === 'KAIKKI_OIKEUDET').length ===
      1;
  return Boolean(signedInUser?.kayttooikeudet.includes('DELETE_USER') && !isOnlyWithAllRights);
}
