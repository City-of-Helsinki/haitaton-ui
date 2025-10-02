import { render } from '@testing-library/react';
import SessionTerminationHandler from './SessionTerminationHandler';
import { setLogoutHandler } from '../../api/api';

// Mock the dependencies
jest.mock('hds-react', () => ({
  useOidcClient: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('../../../common/components/globalNotification/GlobalNotificationContext', () => ({
  useGlobalNotification: jest.fn(),
}));

jest.mock('../../api/api', () => ({
  setLogoutHandler: jest.fn(),
}));

import { useOidcClient } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';

const mockUseOidcClient = jest.mocked(useOidcClient);
const mockUseTranslation = jest.mocked(useTranslation);
const mockUseGlobalNotification = jest.mocked(useGlobalNotification);
const mockSetLogoutHandler = jest.mocked(setLogoutHandler);

describe('SessionTerminationHandler', () => {
  const mockLogout = jest.fn();
  const mockSetNotification = jest.fn();
  const mockT = jest.fn((key: string) => key);

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseOidcClient.mockReturnValue({
      logout: mockLogout,
    } as unknown as ReturnType<typeof useOidcClient>);

    mockUseTranslation.mockReturnValue({
      t: mockT,
    } as unknown as ReturnType<typeof useTranslation>);

    mockUseGlobalNotification.mockReturnValue({
      setNotification: mockSetNotification,
      isOpen: false,
      options: undefined,
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should set up logout handler on mount', () => {
    render(<SessionTerminationHandler />);

    expect(mockSetLogoutHandler).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should clean up logout handler on unmount', () => {
    const { unmount } = render(<SessionTerminationHandler />);

    // Clear the initial call
    mockSetLogoutHandler.mockClear();

    unmount();

    expect(mockSetLogoutHandler).toHaveBeenCalledWith(null);
  });

  it('should show notification and logout when handler is called', () => {
    render(<SessionTerminationHandler />);

    // Get the handler that was set
    const logoutHandler = mockSetLogoutHandler.mock.calls[0][0] as () => void;

    // Call the handler
    logoutHandler();

    // Should show notification
    expect(mockSetNotification).toHaveBeenCalledWith(true, {
      message: 'authentication:sessionTerminated',
      type: 'info',
      autoClose: true,
      autoCloseDuration: 5000,
      dismissible: false,
    });

    // Should not have called logout yet
    expect(mockLogout).not.toHaveBeenCalled();

    // Fast-forward time by 4 seconds
    jest.advanceTimersByTime(4000);

    // Now logout should be called
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should not call logout if oidcClient is not available', () => {
    mockUseOidcClient.mockReturnValue(undefined as unknown as ReturnType<typeof useOidcClient>);

    render(<SessionTerminationHandler />);

    // Get the handler that was set
    const logoutHandler = mockSetLogoutHandler.mock.calls[0][0] as () => void;

    // Call the handler
    logoutHandler();

    // Should not show notification or call logout
    expect(mockSetNotification).not.toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('should render nothing', () => {
    const { container } = render(<SessionTerminationHandler />);

    expect(container.firstChild).toBeNull();
  });
});
