import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { addressData } from './data/helAddressData';
import { handlers } from './handlers';

const serverHandlers = handlers.concat(
  // Add this endpoint for tests
  http.get('https://kartta.hel.fi/ws/geoserver/avoindata/wfs', async () => {
    return HttpResponse.json(addressData);
  }),
  // OIDC discovery endpoint used by hds-react LoginProvider (oidc-client-ts) during tests
  http.get('https://api.hel.fi/sso/openid/.well-known/openid-configuration', () => {
    return HttpResponse.json({
      issuer: 'https://api.hel.fi/sso/openid',
      authorization_endpoint: 'https://api.hel.fi/sso/openid/authorize',
      token_endpoint: 'https://api.hel.fi/sso/openid/token',
      userinfo_endpoint: 'https://api.hel.fi/sso/openid/userinfo',
      jwks_uri: 'https://api.hel.fi/sso/openid/jwks',
      end_session_endpoint: 'https://api.hel.fi/sso/openid/end-session',
      response_types_supported: ['code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
    });
  }),
);

const server = setupServer(...serverHandlers);

export { server };
