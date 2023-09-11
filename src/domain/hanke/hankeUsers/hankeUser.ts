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
  nimi: string;
  kayttooikeustaso: keyof typeof AccessRightLevel;
  tunnistautunut: boolean;
};

export type UserRights = Array<
  | 'VIEW'
  | 'MODIFY_VIEW_PERMISSIONS'
  | 'EDIT'
  | 'MODIFY_EDIT_PERMISSIONS'
  | 'DELETE'
  | 'MODIFY_DELETE_PERMISSIONS'
  | 'EDIT_APPLICATIONS'
  | 'MODIFY_APPLICATION_PERMISSIONS'
>;

export type SignedInUser = {
  hankeKayttajaId: string;
  kayttooikeustaso: keyof typeof AccessRightLevel;
  kayttooikeudet: UserRights;
};
