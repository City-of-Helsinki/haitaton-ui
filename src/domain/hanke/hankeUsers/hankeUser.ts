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
