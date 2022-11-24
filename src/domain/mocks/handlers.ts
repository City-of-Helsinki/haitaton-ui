import { rest } from 'msw';
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

  rest.get(`${apiUrl}/public-hankkeet`, async (req, res, ctx) => {
    const hankkeet = await hankkeetDB.readAll();
    return res(ctx.status(200), ctx.json(hankkeet));
  }),
];
