import authService from './authService';

// eslint-disable-next-line
const mockUser: any = {
  id_token: 'fffff-aaaaaa-11111',
  session_state: '8eff0245-3e7d-44b1-866d-1ca47d210b17',
  access_token: '.BnutWVN1x7RSAP5bU2a-tXdVPuof_9pBNd_Ozw',
};

describe('authService', () => {
  const { userManager } = authService;

  afterEach(() => {
    localStorage.clear();
    // eslint-disable-next-line
    // @ts-ignore
    localStorage.setItem.mockClear();
    jest.restoreAllMocks();
  });

  describe('getUser', () => {
    it('should resolve to the user value which has been resolved from getUser', async () => {
      expect.assertions(1);
      jest.spyOn(userManager, 'getUser').mockResolvedValueOnce(mockUser);

      const user = await authService.getUser();

      expect(user).toBe(mockUser);
    });
  });

  /*
  Network error and tests fails in Github CI
  describe('login', () => {
    it('should call signinRedirect from oidc with the provided path', () => {
      const path = '/applications';
      const signinRedirect = jest.spyOn(userManager, 'signinRedirect');
      authService.login(path).catch();

      expect(signinRedirect).toHaveBeenNthCalledWith(1, { data: { path } });
    });
  }); */

  describe('endLogin', () => {
    // eslint-disable-next-line
    // @ts-ignore
    global.fetch.mockResponse(JSON.stringify({ data: {} }));

    it('should call signinRedirectCallback from oidc', () => {
      const signinRedirectCallback = jest
        .spyOn(userManager, 'signinRedirectCallback')
        .mockImplementation(() => Promise.resolve(mockUser));

      authService.endLogin();

      expect(signinRedirectCallback).toHaveBeenCalledTimes(1);
    });

    it('should return the same user object returned from signinRedirectCallback', async () => {
      expect.assertions(1);
      jest.spyOn(userManager, 'signinRedirectCallback').mockReturnValue(Promise.resolve(mockUser));

      const user = await authService.endLogin();

      expect(user).toBe(mockUser);
    });
  });

  describe('logout', () => {
    it('should call signoutRedirect from oidc', () => {
      const signoutRedirect = jest.spyOn(userManager, 'signoutRedirect');

      authService.logout();

      expect(signoutRedirect).toHaveBeenCalledTimes(1);
    });

    it('should call clearStaleState', async () => {
      expect.assertions(1);
      jest.spyOn(userManager, 'signoutRedirect').mockResolvedValue(undefined);
      jest.spyOn(userManager, 'clearStaleState').mockResolvedValue();

      await authService.logout();

      expect(userManager.clearStaleState).toHaveBeenCalledTimes(1);
    });
  });
});
