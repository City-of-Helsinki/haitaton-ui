import { rest } from 'msw';
import { JohtoselvitysFormValues } from '../johtoselvitys/types';
import { HankeDataDraft } from '../types/hanke';
import * as hankkeetDB from './data/hankkeet';
import * as hakemuksetDB from './data/hakemukset';
import * as usersDB from './data/users';
import ApiError from './apiError';
import {
  AccessRightLevel,
  DeleteInfo,
  IdentificationResponse,
  SignedInUser,
  SignedInUserByHanke,
} from '../hanke/hankeUsers/hankeUser';
import { Yhteyshenkilo, YhteyshenkiloWithoutName } from '../hanke/edit/types';
import {
  JohtoselvitysCreateData,
  JohtoselvitysUpdateData,
  KaivuilmoitusCreateData,
  NewJohtoselvitysData,
} from '../application/types/application';
import { defaultJohtoselvitysData } from './data/defaultJohtoselvitysData';
import { signedInUsers, userDataByHanke } from './signedInUser';

const apiUrl = '/api';

export const handlers = [
  // Private hankkeet endpoints miss handling of user at this point
  rest.get(`${apiUrl}/hankkeet/:hankeTunnus`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;
    const hanke = await hankkeetDB.read(hankeTunnus as string);
    if (!hanke) {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Hanke not found',
          errorCode: 'HAI1001',
        }),
      );
    }
    return res(ctx.status(200), ctx.json(hanke));
  }),

  rest.get(`${apiUrl}/hankkeet`, async (_, res, ctx) => {
    const hankkeet = await hankkeetDB.readAll();
    return res(ctx.status(200), ctx.json(hankkeet));
  }),

  rest.post(`${apiUrl}/hankkeet`, async (req, res, ctx) => {
    const reqBody: HankeDataDraft = await req.json();
    const hanke = await hankkeetDB.create(reqBody);
    return res(ctx.status(200), ctx.json(hanke));
  }),

  rest.put(`${apiUrl}/hankkeet/:hankeTunnus`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;
    const reqBody: HankeDataDraft = await req.json();
    try {
      const hanke = await hankkeetDB.update(hankeTunnus as string, reqBody);
      return res(ctx.status(200), ctx.json(hanke));
    } catch (error) {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Hanke not found',
          errorCode: 'HAI1001',
        }),
      );
    }
  }),

  rest.delete(`${apiUrl}/hankkeet/:hankeTunnus`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;
    try {
      const hanke = await hankkeetDB.remove(hankeTunnus as string);
      return res(ctx.status(200), ctx.json(hanke));
    } catch (error) {
      const { status, message } = error as ApiError;
      return res(
        ctx.status(status),
        ctx.json({
          errorMessage: message,
          errorCode: 'HAI1001',
        }),
      );
    }
  }),

  rest.get(`${apiUrl}/hankkeet/:hankeTunnus/hakemukset`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;
    const hakemukset = await hakemuksetDB.readAllForHanke(hankeTunnus as string);
    return res(ctx.status(200), ctx.json({ applications: hakemukset }));
  }),

  rest.get(`${apiUrl}/public-hankkeet`, async (_, res, ctx) => {
    const hankkeet = await hankkeetDB.readAll();
    return res(ctx.status(200), ctx.json(hankkeet));
  }),

  rest.get(`${apiUrl}/hakemukset`, async (_, res, ctx) => {
    const hakemukset = await hakemuksetDB.readAll();
    return res(ctx.status(200), ctx.json(hakemukset));
  }),

  rest.get(`${apiUrl}/hakemukset/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const hakemus = await hakemuksetDB.read(Number(id as string));
    if (!hakemus) {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Application not found',
        }),
      );
    }
    return res(ctx.status(200), ctx.json(hakemus));
  }),

  rest.post(`${apiUrl}/hakemukset`, async (req, res, ctx) => {
    const reqBody: JohtoselvitysCreateData | KaivuilmoitusCreateData = await req.json();
    const hakemus = await hakemuksetDB.create(reqBody);
    return res(ctx.status(200), ctx.json(hakemus));
  }),

  rest.post(`${apiUrl}/hakemukset/johtoselvitys`, async (req, res, ctx) => {
    const reqBody: JohtoselvitysFormValues = await req.json();
    const hanke = await hankkeetDB.create({
      nimi: reqBody.applicationData.name,
      alkuPvm: '',
      loppuPvm: '',
      vaihe: 'SUUNNITTELU',
      kuvaus: '',
    });
    const hakemus = await hakemuksetDB.createJohtoselvitys({
      ...reqBody,
      hankeTunnus: hanke.hankeTunnus!,
    });
    return res(ctx.status(200), ctx.json(hakemus));
  }),

  rest.post(`${apiUrl}/johtoselvityshakemus`, async (req, res, ctx) => {
    const { nimi }: NewJohtoselvitysData = await req.json();
    const hanke = await hankkeetDB.create({
      nimi: nimi,
      alkuPvm: null,
      loppuPvm: null,
      vaihe: null,
      kuvaus: null,
      generated: true,
    });
    const hakemus = await hakemuksetDB.createJohtoselvitys({
      applicationData: {
        name: nimi,
        ...defaultJohtoselvitysData,
      },
      id: null,
      alluStatus: null,
      applicationType: 'CABLE_REPORT',
      hankeTunnus: hanke.hankeTunnus!,
    });
    await usersDB.create(hanke.hankeTunnus!, {
      etunimi: 'Testi',
      sukunimi: 'Testinen',
      sahkoposti: 'testi@test.com',
      puhelinnumero: '0401234500',
    });
    return res(ctx.status(200), ctx.json(hakemus));
  }),

  rest.put(`${apiUrl}/hakemukset/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const reqBody: JohtoselvitysUpdateData = await req.json();
    try {
      const hakemus = await hakemuksetDB.update(Number(id as string), reqBody);
      return res(ctx.status(200), ctx.json(hakemus));
    } catch (error) {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Hakemus not found',
          errorCode: 'HAI1001',
        }),
      );
    }
  }),

  rest.post(`${apiUrl}/hakemukset/:id/laheta`, async (req, res, ctx) => {
    const { id } = req.params;
    const hakemus = await hakemuksetDB.sendHakemus(Number(id));

    if (!hakemus) {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Hakemus not found',
          errorCode: 'HAI1001',
        }),
      );
    }

    return res(ctx.status(200), ctx.json(hakemus));
  }),

  rest.delete(`${apiUrl}/hakemukset/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    try {
      await hakemuksetDB.remove(Number(id));
      return res(ctx.status(200), ctx.json(null));
    } catch (error) {
      const { status, message } = error as ApiError;
      return res(
        ctx.status(status),
        ctx.json({
          errorMessage: message,
          errorCode: 'HAI1001',
        }),
      );
    }
  }),

  rest.get(`${apiUrl}/hankkeet/:hankeTunnus/kayttajat`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;
    const users = await usersDB.readAll(hankeTunnus as string);
    return res(ctx.status(200), ctx.json({ kayttajat: users }));
  }),

  rest.post(`${apiUrl}/hankkeet/:hankeTunnus/kayttajat`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;
    const user: Yhteyshenkilo = await req.json();
    const createdUser = await usersDB.create(hankeTunnus as string, user);
    return res(ctx.status(200), ctx.json(createdUser));
  }),

  rest.put(`${apiUrl}/hankkeet/:hankeTunnus/kayttajat`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;
    const { kayttajat } = await req.json();
    await usersDB.updatePermissions(hankeTunnus as string, kayttajat);
    return res(ctx.status(204));
  }),

  rest.put(`${apiUrl}/hankkeet/:hankeTunnus/kayttajat/self`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;
    const reqBody: YhteyshenkiloWithoutName = await req.json();
    const user = await usersDB.update(
      hankeTunnus as string,
      '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      reqBody,
    );
    return res(ctx.status(200), ctx.json(user));
  }),

  rest.put(`${apiUrl}/hankkeet/:hankeTunnus/kayttajat/:userId`, async (req, res, ctx) => {
    const { hankeTunnus, userId } = req.params;
    const reqBody: Yhteyshenkilo | YhteyshenkiloWithoutName = await req.json();
    try {
      const updatedUser = await usersDB.update(hankeTunnus as string, userId as string, reqBody);
      return res(ctx.status(200), ctx.json(updatedUser));
    } catch (error) {
      const { status, message } = error as ApiError;
      return res(
        ctx.status(status),
        ctx.json({
          errorMessage: message,
          errorCode: 'HAI1001',
        }),
      );
    }
  }),

  rest.get(`${apiUrl}/hankkeet/:hankeTunnus/whoami`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;

    if (hankeTunnus === 'SMTGEN2_1') {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        }),
      );
    }

    const currentUser = await usersDB.readCurrent();
    const user = signedInUsers.find((u) => u.hankeKayttajaId === currentUser?.id) ?? {
      hankeKayttajaId: currentUser?.id ?? '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      kayttooikeustaso: 'KAIKKI_OIKEUDET',
      kayttooikeudet: [
        'VIEW',
        'MODIFY_VIEW_PERMISSIONS',
        'EDIT',
        'MODIFY_EDIT_PERMISSIONS',
        'DELETE',
        'MODIFY_DELETE_PERMISSIONS',
        'EDIT_APPLICATIONS',
        'MODIFY_APPLICATION_PERMISSIONS',
        'RESEND_INVITATION',
        'MODIFY_USER',
        'DELETE_USER',
      ],
    };

    return res(ctx.status(200), ctx.json<SignedInUser>(user));
  }),

  rest.get(`${apiUrl}/kayttajat/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const user = await usersDB.read(id as string);
    return res(ctx.status(200), ctx.json(user));
  }),

  rest.post(`${apiUrl}/kayttajat`, async (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<IdentificationResponse>({
        kayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        hankeTunnus: 'HAI22-2',
        hankeNimi: 'Aidasmäentien vesihuollon rakentaminen',
      }),
    );
  }),

  rest.post(`${apiUrl}/kayttajat/:kayttajaId/kutsu`, async (req, res, ctx) => {
    const { kayttajaId } = req.params;
    const user = await usersDB.resendInvitation(kayttajaId as string);
    return res(ctx.delay(), ctx.json(user), ctx.status(200));
  }),

  rest.get(`${apiUrl}/kayttajat/:id/deleteInfo`, async (req, res, ctx) => {
    const { id } = req.params;
    if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa7') {
      return res(
        ctx.delay(),
        ctx.status(200),
        ctx.json<DeleteInfo>({
          activeHakemukset: [
            { nimi: 'Hakemus 1', alluStatus: 'PENDING', applicationIdentifier: 'JS2300001' },
            { nimi: 'Hakemus 2', alluStatus: 'HANDLING', applicationIdentifier: 'JS2300002' },
          ],
          draftHakemukset: [],
          onlyOmistajanYhteyshenkilo: false,
        }),
      );
    }
    if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa8') {
      return res(
        ctx.delay(),
        ctx.status(200),
        ctx.json<DeleteInfo>({
          activeHakemukset: [
            { nimi: 'Hakemus 1', alluStatus: 'PENDING', applicationIdentifier: 'JS2300001' },
            { nimi: 'Hakemus 3', alluStatus: 'PENDING', applicationIdentifier: 'JS2300003' },
          ],
          draftHakemukset: [],
          onlyOmistajanYhteyshenkilo: false,
        }),
      );
    }
    if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa9') {
      return res(
        ctx.delay(),
        ctx.status(200),
        ctx.json<DeleteInfo>({
          activeHakemukset: [],
          draftHakemukset: [
            { nimi: 'Hakemus 4', alluStatus: null, applicationIdentifier: 'JS2300004' },
            { nimi: 'Hakemus 5', alluStatus: null, applicationIdentifier: 'JS2300005' },
          ],
          onlyOmistajanYhteyshenkilo: false,
        }),
      );
    }
    if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb1') {
      return res(
        ctx.delay(),
        ctx.status(200),
        ctx.json<DeleteInfo>({
          activeHakemukset: [],
          draftHakemukset: [],
          onlyOmistajanYhteyshenkilo: true,
        }),
      );
    }
    return res(
      ctx.delay(),
      ctx.status(200),
      ctx.json<DeleteInfo>({
        activeHakemukset: [],
        draftHakemukset: [],
        onlyOmistajanYhteyshenkilo: false,
      }),
    );
  }),

  rest.delete(`${apiUrl}/kayttajat/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    try {
      await usersDB.remove(id as string);
      return res(ctx.status(204));
    } catch (error) {
      const { status, message } = error as ApiError;
      return res(
        ctx.status(status),
        ctx.json({
          errorMessage: message,
          errorCode: 'HAI1001',
        }),
      );
    }
  }),

  rest.get(`${apiUrl}/hakemukset/:id/liitteet`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),

  rest.post(`${apiUrl}/hakemukset/:id/liitteet`, async (req, res, ctx) => {
    return res(ctx.delay(), ctx.status(200));
  }),

  rest.delete(`${apiUrl}/hakemukset/:id/liitteet/:attachmentId`, async (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.get(`${apiUrl}/hankkeet/:hankeTunnus/liitteet`, async (_, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),

  rest.get(`${apiUrl}/profiili/verified-name`, async (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ firstName: 'Testi Tauno Tahvo', lastName: 'Testinen', givenName: 'Testi' }),
    );
  }),

  rest.get(`${apiUrl}/my-permissions`, async (_, res, ctx) => {
    console.log(`GET ${apiUrl}/my-permissions`);
    return res(
      ctx.status(200),
      ctx.json<SignedInUserByHanke>(userDataByHanke(['HAI22-2'], AccessRightLevel.HAKEMUSASIOINTI)),
    );
  }),
];
