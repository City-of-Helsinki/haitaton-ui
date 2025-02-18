import { Profile, User } from 'hds-react';

const authority = 'https://api.hel.fi/sso/openid';
const client_id = 'test-client';

const tokenExpirationTimeInSeconds = 3600;

export function createUser(placeUserToStorage = true, userProfile?: Partial<Profile>): User {
  const nowAsSeconds = Math.round(Date.now() / 1000);
  const expires_in = tokenExpirationTimeInSeconds;
  const expires_at = nowAsSeconds + expires_in;

  const user: User = {
    access_token: placeUserToStorage ? 'access_token' : '',
    expires_at,
    id_token: 'id_token',
    profile: {
      sub: 'sub',
      iss: 'issuer',
      aud: 'aud',
      exp: expires_at,
      iat: nowAsSeconds,
      given_name: 'Test',
      family_name: 'User',
      name: 'Test User',
      email: 'test.user@mail.com',
      amr: ['validAmr'],
      ...userProfile,
    },
    refresh_token: 'refresh_token',
    scope: 'openid profile',
    session_state: String(`${Math.random()}${Math.random()}`),
    state: '',
    token_type: 'Bearer',
    expires_in,
    expired: false,
    scopes: ['openid', 'profile'],
    toStorageString() {
      return JSON.stringify(this);
    },
  };

  if (placeUserToStorage) {
    sessionStorage.setItem(`oidc.user:${authority}:${client_id}`, user.toStorageString());
  }

  return user;
}
