import { rest } from 'msw';
import { JohtoselvitysFormValues } from '../johtoselvitys/types';
import { HankeDataDraft } from '../types/hanke';
import * as hankkeetDB from './data/hankkeet';
import * as hakemuksetDB from './data/hakemukset';

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
        })
      );
    }
    return res(ctx.status(200), ctx.json(hanke));
  }),

  rest.get(`${apiUrl}/hankkeet`, async (req, res, ctx) => {
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
        })
      );
    }
  }),

  rest.delete(`${apiUrl}/hankkeet/:hankeTunnus`, async (req, res, ctx) => {
    const { hankeTunnus } = req.params;
    try {
      const hanke = await hankkeetDB.remove(hankeTunnus as string);
      return res(ctx.status(200), ctx.json(hanke));
    } catch (error) {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Hanke not found',
          errorCode: 'HAI1001',
        })
      );
    }
  }),

  rest.get(`${apiUrl}/public-hankkeet`, async (req, res, ctx) => {
    const hankkeet = await hankkeetDB.readAll();
    return res(ctx.status(200), ctx.json(hankkeet));
  }),

  rest.post(`${apiUrl}/hakemukset`, async (req, res, ctx) => {
    const reqBody: JohtoselvitysFormValues = await req.json();
    const hakemus = await hakemuksetDB.create(reqBody);
    return res(ctx.status(200), ctx.json(hakemus));
  }),

  rest.put(`${apiUrl}/hakemukset/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const reqBody: JohtoselvitysFormValues = await req.json();
    try {
      const hakemus = await hakemuksetDB.update(Number(id as string), reqBody);
      return res(ctx.status(200), ctx.json(hakemus));
    } catch (error) {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Hakemus not found',
          errorCode: 'HAI1001',
        })
      );
    }
  }),

  rest.post(`${apiUrl}/hakemukset/:id/send-application`, async (req, res, ctx) => {
    const { id } = req.params;
    const hakemus = await hakemuksetDB.read(Number(id));

    if (!hakemus) {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Hakemus not found',
          errorCode: 'HAI1001',
        })
      );
    }

    return res(ctx.status(200), ctx.json(hakemus));
  }),
];
