import { rest } from 'msw';
import { HankeDataDraft } from '../types/hanke';
import * as hankkeetDB from './data/hankkeet';

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

  rest.get(`${apiUrl}/public-hankkeet`, async (req, res, ctx) => {
    const hankkeet = await hankkeetDB.readAll();
    return res(ctx.status(200), ctx.json(hankkeet));
  }),
];
