import { http, HttpResponse, delay } from 'msw';
import { HankeDataDraft } from '../types/hanke';
import * as hankkeetDB from './data/hankkeet';
import * as hakemuksetDB from './data/hakemukset';
import * as usersDB from './data/users';
import {
  DeleteInfo,
  HankeUser,
  IdentificationResponse,
  SignedInUser,
} from '../hanke/hankeUsers/hankeUser';
import { Yhteyshenkilo, YhteyshenkiloWithoutName } from '../hanke/edit/types';
import {
  Application,
  HankkeenHakemus,
  JohtoselvitysCreateData,
  JohtoselvitysData,
  JohtoselvitysUpdateData,
  KaivuilmoitusCreateData,
  KaivuilmoitusData,
  KaivuilmoitusUpdateData,
  NewJohtoselvitysData,
} from '../application/types/application';
import { defaultJohtoselvitysData } from './data/defaultJohtoselvitysData';
import { PathParams } from 'msw/lib/core/utils/matching/matchRequestUrl';
import ApiError from './apiError';

const apiUrl = '/api';

type BackendError = {
  errorMessage: string;
  errorCode: string;
};

export const handlers = [
  // Private hankkeet endpoints miss handling of user at this point
  http.get<PathParams, undefined, HankeDataDraft>(
    `${apiUrl}/hankkeet/:hankeTunnus`,
    async ({ params }) => {
      const { hankeTunnus } = params;
      const hanke = await hankkeetDB.read(hankeTunnus as string);
      return HttpResponse.json(hanke);
    },
  ),

  http.get<PathParams, undefined, HankeDataDraft[]>(`${apiUrl}/hankkeet`, async () => {
    const hankkeet = await hankkeetDB.readAll();
    return HttpResponse.json(hankkeet);
  }),

  http.post<PathParams, HankeDataDraft, Partial<HankeDataDraft>>(
    `${apiUrl}/hankkeet`,
    async ({ request }) => {
      const reqBody: HankeDataDraft = await request.json();
      const hanke = await hankkeetDB.create(reqBody);
      return HttpResponse.json(hanke);
    },
  ),

  http.put<PathParams, HankeDataDraft, HankeDataDraft | BackendError>(
    `${apiUrl}/hankkeet/:hankeTunnus`,
    async ({ params, request }) => {
      const { hankeTunnus } = params;
      const reqBody: HankeDataDraft = await request.json();
      try {
        const hanke = await hankkeetDB.update(hankeTunnus as string, reqBody);
        return HttpResponse.json(hanke, { status: 200 });
      } catch (error) {
        return HttpResponse.json(
          {
            errorMessage: 'Hanke not found',
            errorCode: 'HAI1001',
          },
          { status: 404 },
        );
      }
    },
  ),

  http.delete<PathParams, undefined, HankeDataDraft>(
    `${apiUrl}/hankkeet/:hankeTunnus`,
    async ({ params }) => {
      const { hankeTunnus } = params;
      const hanke = await hankkeetDB.remove(hankeTunnus as string);
      return HttpResponse.json(hanke);
    },
  ),

  http.get<PathParams, undefined, { applications: HankkeenHakemus[] }>(
    `${apiUrl}/hankkeet/:hankeTunnus/hakemukset`,
    async ({ params }) => {
      const { hankeTunnus } = params;
      const hakemukset = await hakemuksetDB.readAllForHanke(hankeTunnus as string);
      return HttpResponse.json({ applications: hakemukset });
    },
  ),

  http.get<PathParams, undefined, HankeDataDraft[]>(`${apiUrl}/public-hankkeet`, async () => {
    const hankkeet = await hankkeetDB.readAll();
    return HttpResponse.json(hankkeet);
  }),

  http.get(`${apiUrl}/hakemukset/:id`, async ({ params }) => {
    const { id } = params;
    const hakemus = await hakemuksetDB.read(Number(id as string));
    return HttpResponse.json(hakemus);
  }),

  http.post<
    PathParams,
    JohtoselvitysCreateData | KaivuilmoitusCreateData,
    Application<JohtoselvitysData> | Application<KaivuilmoitusData>
  >(`${apiUrl}/hakemukset`, async ({ request }) => {
    const reqBody: JohtoselvitysCreateData | KaivuilmoitusCreateData = await request.json();
    const hakemus = await hakemuksetDB.create(reqBody);
    return HttpResponse.json(hakemus);
  }),

  http.post<PathParams, NewJohtoselvitysData, Application>(
    `${apiUrl}/johtoselvityshakemus`,
    async ({ request }) => {
      const { nimi }: NewJohtoselvitysData = await request.json();
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
      return HttpResponse.json(hakemus);
    },
  ),

  http.put<PathParams, JohtoselvitysUpdateData, Application>(
    `${apiUrl}/hakemukset/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const reqBody: JohtoselvitysUpdateData = await request.json();
      const hakemus = await hakemuksetDB.update(Number(id as string), reqBody);
      return HttpResponse.json(hakemus);
    },
  ),

  http.post(`${apiUrl}/hakemukset/:id/laheta`, async ({ params }) => {
    const { id } = params;
    const hakemus = await hakemuksetDB.sendHakemus(Number(id));
    return HttpResponse.json(hakemus);
  }),

  http.post(`${apiUrl}/hakemukset/:id/toiminnallinen-kunto`, async () => {
    return new HttpResponse();
  }),

  http.post(`${apiUrl}/hakemukset/:id/tyo-valmis`, async () => {
    return new HttpResponse();
  }),

  http.delete(`${apiUrl}/hakemukset/:id`, async ({ params }) => {
    const { id } = params;
    await hakemuksetDB.remove(Number(id));
    return HttpResponse.json(null);
  }),

  http.get(`${apiUrl}/hankkeet/:hankeTunnus/kayttajat`, async ({ params }) => {
    const { hankeTunnus } = params;
    const users = await usersDB.readAll(hankeTunnus as string);
    return HttpResponse.json({ kayttajat: users });
  }),

  http.post<PathParams, Yhteyshenkilo>(
    `${apiUrl}/hankkeet/:hankeTunnus/kayttajat`,
    async ({ params, request }) => {
      const { hankeTunnus } = params;
      const user: Yhteyshenkilo = await request.json();
      const createdUser = await usersDB.create(hankeTunnus as string, user);
      return HttpResponse.json(createdUser);
    },
  ),

  http.put<PathParams, { kayttajat: Pick<HankeUser, 'id' | 'kayttooikeustaso'>[] }>(
    `${apiUrl}/hankkeet/:hankeTunnus/kayttajat`,
    async ({ params, request }) => {
      const { hankeTunnus } = params;
      const { kayttajat } = await request.json();
      await usersDB.updatePermissions(hankeTunnus as string, kayttajat);
      return new HttpResponse(null, { status: 204 });
    },
  ),

  http.put<PathParams, YhteyshenkiloWithoutName>(
    `${apiUrl}/hankkeet/:hankeTunnus/kayttajat/self`,
    async ({ params, request }) => {
      const { hankeTunnus } = params;
      const reqBody: YhteyshenkiloWithoutName = await request.json();
      const user = await usersDB.update(
        hankeTunnus as string,
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        reqBody,
      );
      return HttpResponse.json(user);
    },
  ),

  http.put<PathParams, Yhteyshenkilo | YhteyshenkiloWithoutName>(
    `${apiUrl}/hankkeet/:hankeTunnus/kayttajat/:userId`,
    async ({ params, request }) => {
      const { hankeTunnus, userId } = params;
      const reqBody: Yhteyshenkilo | YhteyshenkiloWithoutName = await request.json();
      const updatedUser = await usersDB.update(hankeTunnus as string, userId as string, reqBody);
      return HttpResponse.json(updatedUser);
    },
  ),

  http.get<PathParams, undefined, SignedInUser>(
    `${apiUrl}/hankkeet/:hankeTunnus/whoami`,
    async () => {
      const currentUser = await usersDB.readCurrent();
      return HttpResponse.json({
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
      });
    },
  ),

  http.get(`${apiUrl}/kayttajat/:id`, async ({ params }) => {
    const { id } = params;
    const user = await usersDB.read(id as string);
    return HttpResponse.json(user);
  }),

  http.post(`${apiUrl}/kayttajat`, async () => {
    return HttpResponse.json<IdentificationResponse>({
      kayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      hankeTunnus: 'HAI22-2',
      hankeNimi: 'Aidasmäentien vesihuollon rakentaminen',
    });
  }),

  http.post(`${apiUrl}/kayttajat/:kayttajaId/kutsu`, async ({ params }) => {
    const { kayttajaId } = params;
    const user = await usersDB.resendInvitation(kayttajaId as string);
    await delay();
    return HttpResponse.json(user);
  }),

  http.get(`${apiUrl}/kayttajat/:id/deleteInfo`, async ({ params }) => {
    const { id } = params;
    await delay();
    if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa7') {
      return HttpResponse.json<DeleteInfo>({
        activeHakemukset: [
          { nimi: 'Hakemus 1', alluStatus: 'PENDING', applicationIdentifier: 'JS2300001' },
          { nimi: 'Hakemus 2', alluStatus: 'HANDLING', applicationIdentifier: 'JS2300002' },
        ],
        draftHakemukset: [],
        onlyOmistajanYhteyshenkilo: false,
      });
    }
    if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa8') {
      return HttpResponse.json<DeleteInfo>({
        activeHakemukset: [
          { nimi: 'Hakemus 1', alluStatus: 'PENDING', applicationIdentifier: 'JS2300001' },
          { nimi: 'Hakemus 3', alluStatus: 'PENDING', applicationIdentifier: 'JS2300003' },
        ],
        draftHakemukset: [],
        onlyOmistajanYhteyshenkilo: false,
      });
    }
    if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa9') {
      return HttpResponse.json<DeleteInfo>({
        activeHakemukset: [],
        draftHakemukset: [
          { nimi: 'Hakemus 4', alluStatus: null, applicationIdentifier: 'JS2300004' },
          { nimi: 'Hakemus 5', alluStatus: null, applicationIdentifier: 'JS2300005' },
        ],
        onlyOmistajanYhteyshenkilo: false,
      });
    }
    if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb1') {
      return HttpResponse.json<DeleteInfo>({
        activeHakemukset: [],
        draftHakemukset: [],
        onlyOmistajanYhteyshenkilo: true,
      });
    }
    return HttpResponse.json<DeleteInfo>({
      activeHakemukset: [],
      draftHakemukset: [],
      onlyOmistajanYhteyshenkilo: false,
    });
  }),

  http.delete(`${apiUrl}/kayttajat/:id`, async ({ params }) => {
    const { id } = params;
    await usersDB.remove(id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${apiUrl}/hakemukset/:id/liitteet`, async () => {
    return HttpResponse.json([]);
  }),

  http.post(`${apiUrl}/hakemukset/:id/liitteet`, async () => {
    await delay(500);
    return new HttpResponse();
  }),

  http.delete(`${apiUrl}/hakemukset/:id/liitteet/:attachmentId`, async () => {
    return new HttpResponse();
  }),

  http.get(`${apiUrl}/hankkeet/:hankeTunnus/liitteet`, async () => {
    return HttpResponse.json([]);
  }),

  http.get(`${apiUrl}/profiili/verified-name`, async () => {
    return HttpResponse.json({
      firstName: 'Testi Tauno Tahvo',
      lastName: 'Testinen',
      givenName: 'Testi',
    });
  }),

  http.post(`${apiUrl}/hakemukset/:id/taydennys`, async ({ params }) => {
    const { id } = params;
    try {
      const taydennys = await hakemuksetDB.createTaydennys(Number(id));
      return HttpResponse.json(taydennys, { status: 200 });
    } catch (error) {
      return HttpResponse.json((<ApiError>error).message, { status: (<ApiError>error).status });
    }
  }),

  http.put<PathParams, JohtoselvitysUpdateData | KaivuilmoitusUpdateData>(
    `${apiUrl}/taydennykset/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const updates = await request.json();
      try {
        const taydennys = await hakemuksetDB.updateTaydennys(id as string, updates);
        return HttpResponse.json(taydennys, { status: 200 });
      } catch (error) {
        return HttpResponse.json((<ApiError>error).message, { status: (<ApiError>error).status });
      }
    },
  ),
];
