import {
  AccessRightLevel,
  Rights,
  SignedInUser,
  SignedInUserByHanke,
} from '../hanke/hankeUsers/hankeUser';

export const USER_ALL: SignedInUser = {
  hankeKayttajaId: 'cc0376be-9609-4b2b-bb10-5a385bdea1d8',
  kayttooikeustaso: AccessRightLevel.KAIKKI_OIKEUDET,
  kayttooikeudet: Object.values(Rights),
};

export const USER_EDIT_ALL: SignedInUser = {
  hankeKayttajaId: '79284308-d532-4f90-bae7-ea45f947a9c1',
  kayttooikeustaso: AccessRightLevel.KAIKKIEN_MUOKKAUS,
  kayttooikeudet: [
    Rights.VIEW,
    Rights.MODIFY_VIEW_PERMISSIONS,
    Rights.EDIT,
    Rights.MODIFY_EDIT_PERMISSIONS,
    Rights.EDIT_APPLICATIONS,
    Rights.MODIFY_APPLICATION_PERMISSIONS,
    Rights.RESEND_INVITATION,
  ],
};

export const USER_EDIT_HANKE: SignedInUser = {
  hankeKayttajaId: '678585e0-11c5-4675-8847-46132ab0e60c',
  kayttooikeustaso: AccessRightLevel.HANKEMUOKKAUS,
  kayttooikeudet: [Rights.VIEW, Rights.EDIT, Rights.RESEND_INVITATION],
};

export const USER_HAKEMUSASIOINTI: SignedInUser = {
  hankeKayttajaId: '448ef74f-bf6e-4011-b924-8f559f716a4c',
  kayttooikeustaso: AccessRightLevel.HAKEMUSASIOINTI,
  kayttooikeudet: [Rights.VIEW, Rights.EDIT_APPLICATIONS, Rights.RESEND_INVITATION],
};

export const USER_VIEW: SignedInUser = {
  hankeKayttajaId: 'ecd6027f-a66f-4ee4-854e-20f0a66c40f8',
  kayttooikeustaso: AccessRightLevel.KATSELUOIKEUS,
  kayttooikeudet: [Rights.VIEW],
};

export const signedInUsers: SignedInUser[] = [
  USER_ALL,
  USER_EDIT_ALL,
  USER_EDIT_HANKE,
  USER_HAKEMUSASIOINTI,
  USER_VIEW,
];

export const userData = (accessLevel: AccessRightLevel) =>
  signedInUsers.find((user) => user.kayttooikeustaso === accessLevel) ?? USER_VIEW;

export const userDataByHanke = (
  hankeTunnusList: string[],
  access: AccessRightLevel = AccessRightLevel.KAIKKI_OIKEUDET,
): SignedInUserByHanke =>
  hankeTunnusList.reduce(
    (data: SignedInUserByHanke, tunnus: string) => ({
      ...data,
      [tunnus]: userData(access),
    }),
    {},
  );
