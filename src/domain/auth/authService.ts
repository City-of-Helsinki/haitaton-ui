import { Log, User, UserManager, UserManagerSettings, WebStorageStateStore } from 'oidc-client';
import { LOCALSTORAGE_OIDC_KEY, LOGIN_CALLBACK_PATH } from './constants';
import { getProfiiliNimi } from './profiiliApi';

const { origin } = window.location;

export class AuthService {
  userManager: UserManager;

  constructor() {
    const settings: UserManagerSettings = {
      automaticSilentRenew: true,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      authority: window._env_.REACT_APP_OIDC_AUTHORITY,
      client_id: window._env_.REACT_APP_OIDC_CLIENT_ID,
      redirect_uri: `${origin}${LOGIN_CALLBACK_PATH}`,
      response_type: 'code',
      scope: window._env_.REACT_APP_OIDC_SCOPE,
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

  public async getUser(): Promise<User | null> {
    const user = await this.userManager.getUser();
    if (user) {
      const profiiliNimi = await getProfiiliNimi();
      return {
        ...user,
        profile: {
          ...user.profile,
          name: profiiliNimi.givenName + ' ' + profiiliNimi.lastName,
        },
        toStorageString: () => JSON.stringify(user),
      };
    } else {
      return null;
    }
  }

  // eslint-disable-next-line
  public isAuthenticated(): boolean {
    const oidcStorage = localStorage.getItem(LOCALSTORAGE_OIDC_KEY);

    return !!oidcStorage && !!JSON.parse(oidcStorage).access_token;
  }

  public async login(): Promise<void> {
    try {
      return this.userManager.signinRedirect();
    } catch (error) {
      if ((<Error>error).message !== 'Network Error') {
        // eslint-disable-next-line no-console
        console.error((<Error>error).message);
      }
      return Promise.reject(new Error('Unkonwn error'));
    }
  }

  public async endLogin(): Promise<User> {
    return await this.userManager.signinCallback();
  }

  public async logout(): Promise<void> {
    await this.userManager.clearStaleState();
    await this.userManager.signoutRedirect();
  }
}

export default new AuthService();
