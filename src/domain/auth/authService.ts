import { UserManager, User, UserManagerSettings, Log, WebStorageStateStore } from 'oidc-client';
import { LOGIN_CALLBACK_PATH } from './constants';

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
      redirect_uri: `${origin}${LOGIN_CALLBACK_PATH}`,
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

    /* this.userManager.events.addUserLoaded(async (user) => {
      this.fetchApiToken(user);
    }); */
  }

  public getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  // eslint-disable-next-line
  public isAuthenticated(): boolean {
    const userKey = `oidc.user:${process.env.REACT_APP_OIDC_AUTHORITY}:${process.env.REACT_APP_OIDC_CLIENT_ID}`;
    const oidcStorage = localStorage.getItem(userKey);

    return !!oidcStorage && !!JSON.parse(oidcStorage).access_token;
  }

  public async login(): Promise<void> {
    try {
      return this.userManager.signinRedirect();
    } catch (error) {
      if (error.message !== 'Network Error') {
        // eslint-disable-next-line no-console
        console.error(error.message);
      }
      return Promise.reject(new Error('no reason'));
    }
  }

  public async endLogin(): Promise<User> {
    const user = await this.userManager.signinRedirectCallback();
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
}

export default new AuthService();
