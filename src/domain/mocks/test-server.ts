import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { addressData } from './data/helAddressData';
import { handlers } from './handlers';

const serverHandlers = handlers.concat(
  // Add this endpoint for tests
  http.get('https://kartta.hel.fi/ws/geoserver/avoindata/wfs', async () => {
    return HttpResponse.json(addressData);
  }),
);

const server = setupServer(...serverHandlers);

export { server };
