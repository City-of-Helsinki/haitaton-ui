import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, RenderOptions } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../locales/i18nForTests';
import { store } from '../common/redux/store';

const queryClient = new QueryClient();

type Props = {
  children: React.ReactChildren;
};

const AllTheProviders = ({ children }: Props) => (
  <BrowserRouter>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </ReduxProvider>
  </BrowserRouter>
);

const customRender = (ui: React.ReactElement, options: RenderOptions = {}, route = '/') => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: AllTheProviders as React.ComponentType<React.PropsWithChildren<unknown>>, ...options });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
