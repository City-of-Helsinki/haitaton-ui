import { AlluStatusStrings } from '../../application/types/application';

export enum AccessRightLevel {
  KAIKKI_OIKEUDET = 'KAIKKI_OIKEUDET',
  KAIKKIEN_MUOKKAUS = 'KAIKKIEN_MUOKKAUS',
  HANKEMUOKKAUS = 'HANKEMUOKKAUS',
  HAKEMUSASIOINTI = 'HAKEMUSASIOINTI',
  KATSELUOIKEUS = 'KATSELUOIKEUS',
}

export type HankeUser = {
  id: string;
  sahkoposti: string;
  etunimi: string;
  sukunimi: string;
  puhelinnumero: string;
  kayttooikeustaso: keyof typeof AccessRightLevel;
  roolit: string[];
  tunnistautunut: boolean;
  kutsuttu: string | null;
};

export enum Rights {
  VIEW = 'VIEW',
  MODIFY_VIEW_PERMISSIONS = 'MODIFY_VIEW_PERMISSIONS',
  EDIT = 'EDIT',
  MODIFY_EDIT_PERMISSIONS = 'MODIFY_EDIT_PERMISSIONS',
  DELETE = 'DELETE',
  MODIFY_DELETE_PERMISSIONS = 'MODIFY_DELETE_PERMISSIONS',
  EDIT_APPLICATIONS = 'EDIT_APPLICATIONS',
  MODIFY_APPLICATION_PERMISSIONS = 'MODIFY_APPLICATION_PERMISSIONS',
  RESEND_INVITATION = 'RESEND_INVITATION',
  MODIFY_USER = 'MODIFY_USER',
  DELETE_USER = 'DELETE_USER',
}

export type UserRights = Array<keyof typeof Rights>;

export type SignedInUser = {
  hankeKayttajaId: string;
  kayttooikeustaso: keyof typeof AccessRightLevel;
  kayttooikeudet: UserRights;
};

export type SignedInUserByHanke = {
  [hankeTunnus: string]: SignedInUser;
};

export type IdentificationResponse = {
  kayttajaId: string;
  hankeTunnus: string;
  hankeNimi: string;
};

type HakemusInfo = {
  nimi: string;
  applicationIdentifier: string;
  alluStatus: AlluStatusStrings | null;
};

export type DeleteInfo = {
  activeHakemukset: HakemusInfo[];
  draftHakemukset: HakemusInfo[];
  onlyOmistajanYhteyshenkilo: boolean;
};
