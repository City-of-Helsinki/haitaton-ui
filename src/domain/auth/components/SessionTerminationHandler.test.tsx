import { render } from '@testing-library/react';
import SessionTerminationHandler from './SessionTerminationHandler';
import { setLogoutHandler } from '../../api/api';

// Mock the dependencies
vi.mock('hds-react', () => ({
  useOidcClient: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../common/components/globalNotification/GlobalNotificationContext', () => ({
  useGlobalNotification: vi.fn(),
}));

vi.mock('../../api/api', () => ({
  setLogoutHandler: vi.fn(),
}));

import { useOidcClient } from 'hds-react';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';

const mockUseOidcClient = vi.mocked(useOidcClient);
const mockUseGlobalNotification = vi.mocked(useGlobalNotification);
const mockSetLogoutHandler = vi.mocked(setLogoutHandler);

describe('SessionTerminationHandler', () => {
  const mockLogout = vi.fn();
  const mockSetNotification = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseOidcClient.mockReturnValue({
      logout: mockLogout,
    } as unknown as ReturnType<typeof useOidcClient>);

    mockUseGlobalNotification.mockReturnValue({
      setNotification: mockSetNotification,
      isOpen: false,
      options: undefined,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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
    vi.advanceTimersByTime(4000);

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
