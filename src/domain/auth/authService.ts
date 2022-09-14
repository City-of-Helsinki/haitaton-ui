import { UserManager, User, UserManagerSettings, Log, WebStorageStateStore } from 'oidc-client';
import { LOGIN_CALLBACK_PATH, LOCALSTORAGE_OIDC_KEY } from './constants';

const { origin } = window.location;

export class AuthService {
  userManager: UserManager;

  constructor() {
    const settings: UserManagerSettings = {
      automaticSilentRenew: true,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      authority: process.env.REACT_APP_OIDC_AUTHORITY,
      client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
      redirect_uri: `${origin}${LOGIN_CALLBACK_PATH}`,
      response_type: 'code',
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
    this.logout = this.logout.bind(this);

    // Events
    this.userManager.events.addAccessTokenExpired(() => {
      this.logout();
    });

    this.userManager.events.addUserSignedOut(() => {
      this.userManager.clearStaleState();
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
    const oidcStorage = localStorage.getItem(LOCALSTORAGE_OIDC_KEY);

    return !!oidcStorage && !!JSON.parse(oidcStorage).access_token;
  }

  public async login(path = '/'): Promise<void> {
    try {
      return this.userManager.signinRedirect({ data: { path } });
    } catch (error) {
      if ((<Error>error).message !== 'Network Error') {
        // eslint-disable-next-line no-console
        console.error((<Error>error).message);
      }
      return Promise.reject(new Error('Unkonwn error'));
    }
  }

  public async endLogin(): Promise<User> {
    const user = await this.userManager.signinCallback();

    return user;
  }

  public async logout(): Promise<void> {
    this.userManager.clearStaleState();
    await this.userManager.signoutRedirect();
  }
}

export default new AuthService();
