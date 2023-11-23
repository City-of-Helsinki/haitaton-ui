import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { addressData } from './data/helAddressData';
import { handlers } from './handlers';

const serverHandlers = handlers.concat(
  // Add this endpoint for tests
  rest.get('https://kartta.hel.fi/ws/geoserver/avoindata/wfs', async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(addressData));
  }),
);

const server = setupServer(...serverHandlers);

export { server };
