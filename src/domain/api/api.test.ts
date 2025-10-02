import { http, HttpResponse } from 'msw';
import { server } from '../mocks/test-server';
import api, { setLogoutHandler } from './api';

describe('API Session Termination', () => {
  let mockLogoutHandler: jest.MockedFunction<() => void>;

  beforeEach(() => {
    mockLogoutHandler = jest.fn();
    setLogoutHandler(mockLogoutHandler);
  });

  afterEach(() => {
    setLogoutHandler(null);
    jest.clearAllMocks();
  });

  it('should call logout handler for HAI0006 error code', async () => {
    const errorResponse = {
      errorCode: 'HAI0006',
      errorMessage: 'Session terminated',
    };

    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json(errorResponse, { status: 401 });
      }),
    );

    try {
      await api.get('/test');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Expected to throw due to 401 error
      expect(error).toBeDefined();
    }

    expect(mockLogoutHandler).toHaveBeenCalledTimes(1);
  });

  it('should call logout handler for HAI4008 error code', async () => {
    const errorResponse = {
      errorCode: 'HAI4008',
      errorMessage: 'Verified name call was unauthorized',
    };

    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json(errorResponse, { status: 401 });
      }),
    );

    try {
      await api.get('/test');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Expected to throw due to 401 error
      expect(error).toBeDefined();
    }

    expect(mockLogoutHandler).toHaveBeenCalledTimes(1);
  });

  it('should not call logout handler for other 401 errors', async () => {
    const errorResponse = {
      errorCode: 'OTHER_ERROR',
      errorMessage: 'Some other unauthorized error',
    };

    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json(errorResponse, { status: 401 });
      }),
    );

    try {
      await api.get('/test');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Expected to throw due to 401 error
      expect(error).toBeDefined();
    }

    expect(mockLogoutHandler).not.toHaveBeenCalled();
  });

  it('should not call logout handler for 401 without error code', async () => {
    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }),
    );

    try {
      await api.get('/test');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Expected to throw due to 401 error
      expect(error).toBeDefined();
    }

    expect(mockLogoutHandler).not.toHaveBeenCalled();
  });

  it('should not call logout handler for non-401 errors', async () => {
    const errorResponse = {
      errorCode: 'HAI0006',
      errorMessage: 'Session terminated',
    };

    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json(errorResponse, { status: 500 });
      }),
    );

    try {
      await api.get('/test');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Expected to throw due to 401 error
      expect(error).toBeDefined();
    }

    expect(mockLogoutHandler).not.toHaveBeenCalled();
  });

  it('should handle the case when no logout handler is set', async () => {
    setLogoutHandler(null);

    const errorResponse = {
      errorCode: 'HAI0006',
      errorMessage: 'Session terminated',
    };

    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json(errorResponse, { status: 401 });
      }),
    );

    // Should not throw an error even when logout handler is null
    try {
      await api.get('/test');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Expected to throw the original error
      expect(error).toBeDefined();
    }

    // No logout handler to call, so this should not throw
  });

  it('should still reject the promise after calling logout handler', async () => {
    const errorResponse = {
      errorCode: 'HAI0006',
      errorMessage: 'Session terminated',
    };

    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json(errorResponse, { status: 401 });
      }),
    );

    await expect(api.get('/test')).rejects.toThrow();
    expect(mockLogoutHandler).toHaveBeenCalledTimes(1);
  });

  it('should log warning message when session termination is detected', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const errorResponse = {
      errorCode: 'HAI0006',
      errorMessage: 'Session terminated',
    };

    server.use(
      http.get('/api/test', () => {
        return HttpResponse.json(errorResponse, { status: 401 });
      }),
    );

    try {
      await api.get('/test');
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Expected to throw due to 401 error
      expect(error).toBeDefined();
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      'Session terminated with error code: HAI0006. Logging out...',
    );

    consoleSpy.mockRestore();
  });
});
