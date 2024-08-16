import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../locales/i18nForTests';
import { store } from '../common/redux/store';
import { GlobalNotificationProvider } from '../common/components/globalNotification/GlobalNotificationContext';
import GlobalNotification from '../common/components/globalNotification/GlobalNotification';
import { FeatureFlagsProvider } from '../common/components/featureFlags/FeatureFlagsContext';
import { LoginProvider } from 'hds-react';
import { loginProviderProps } from '../domain/auth/loginProviderProps';

type Props = {
  children: React.ReactNode;
};

const AllTheProviders = ({ children }: Readonly<Props>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retryDelay: 0,
        retry: false,
      },
    },
  });

  return (
    <LoginProvider {...loginProviderProps}>
      <BrowserRouter>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
              <FeatureFlagsProvider>
                <GlobalNotificationProvider>
                  {children}
                  <GlobalNotification />
                </GlobalNotificationProvider>
              </FeatureFlagsProvider>
            </I18nextProvider>
          </QueryClientProvider>
        </ReduxProvider>
      </BrowserRouter>
    </LoginProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options: RenderOptions = {},
  route = '/',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userEventOptions?: any,
) => {
  window.history.pushState({}, 'Test page', route);
  window.scrollTo = function () {};
  return {
    user: userEvent.setup(userEventOptions),
    ...render(ui, {
      wrapper: AllTheProviders,
      ...options,
    }),
  };
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
