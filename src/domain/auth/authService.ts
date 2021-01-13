import { UserManager, User, UserManagerSettings, Log, WebStorageStateStore } from 'oidc-client';
import pickProfileApiToken from './pickProfileApiToken';

const { origin } = window.location;
export const API_TOKEN = 'apiToken';

export class AuthService {
  userManager: UserManager;

  constructor() {
    const settings: UserManagerSettings = {
      automaticSilentRenew: true,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      authority: process.env.REACT_APP_OIDC_AUTHORITY,
      client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
      redirect_uri: `${origin}/callback`,
      silent_redirect_uri: `${origin}/silent_renew.html`,
      response_type: 'id_token token',
      scope: process.env.REACT_APP_OIDC_SCOPE,
      post_logout_redirect_uri: `${origin}/`,
    };

    // Show oidc debugging info in the console only while developing
    if (process.env.NODE_ENV === 'development') {
      Log.logger = console;
      Log.level = Log.INFO;
    }

    // User Manager instance
    this.userManager = new UserManager(settings);

    // Public methods
    this.getUser = this.getUser.bind(this);
    this.getToken = this.getToken.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.login = this.login.bind(this);
    this.endLogin = this.endLogin.bind(this);
    this.renewToken = this.renewToken.bind(this);
    this.logout = this.logout.bind(this);

    // Events
    this.userManager.events.addAccessTokenExpired(() => {
      this.logout();
    });

    this.userManager.events.addUserSignedOut(() => {
      this.userManager.clearStaleState();
      localStorage.removeItem(API_TOKEN);
    });

    this.userManager.events.addUserLoaded(async (user) => {
      this.fetchApiToken(user);
    });
  }

  public getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  // eslint-disable-next-line
  public getToken(): string | null {
    return localStorage.getItem(API_TOKEN);
  }

  public isAuthenticated(): boolean {
    const userKey = `oidc.user:${process.env.REACT_APP_OIDC_AUTHORITY}:${process.env.REACT_APP_OIDC_CLIENT_ID}`;
    const oidcStorage = localStorage.getItem(userKey);
    const apiTokens = this.getToken();

    return !!oidcStorage && !!JSON.parse(oidcStorage).access_token && !!apiTokens;
  }

  public async login(path = '/'): Promise<void> {
    try {
      return this.userManager.signinRedirect({ data: { path } });
    } catch (error) {
      if (error.message !== 'Network Error') {
        // Sentry.captureException(error);
        console.error(error);
      }
      return Promise.reject(new Error('no reason'));
    }
  }

  public async endLogin(): Promise<User> {
    const user = await this.userManager.signinRedirectCallback();

    await this.fetchApiToken(user);

    return user;
  }

  public renewToken(): Promise<User> {
    return this.userManager.signinSilent();
  }

  public async logout(): Promise<void> {
    localStorage.removeItem(API_TOKEN);
    this.userManager.clearStaleState();
    await this.userManager.signoutRedirect();
  }

  // eslint-disable-next-line
  async fetchApiToken(user: User): Promise<void> {
    const url = `${process.env.REACT_APP_OIDC_AUTHORITY}api-tokens/`;
    const response = await fetch(url, {
      headers: {
        Authorization: `bearer ${user.access_token}`,
      },
    });
    const result = await response.json();
    const apiToken = pickProfileApiToken(result);

    localStorage.setItem(API_TOKEN, apiToken);
  }
}

export default new AuthService();
