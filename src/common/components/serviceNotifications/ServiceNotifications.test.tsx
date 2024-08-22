import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../testUtils/render';
import ServiceNotifications from './ServiceNotifications';
import { BannerType } from '../../../locales/banners';
import { server } from '../../../domain/mocks/test-server';
import { rest } from 'msw';
import i18n from '../../../locales/i18n';
import { I18nextProvider } from 'react-i18next';

const BANNERS = {
  [BannerType.INFO]: {
    label: { fi: 'Info-viesti', sv: 'Info meddelande', en: 'Info message' },
    text: {
      fi: 'Tämä on info-viesti',
      sv: 'Detta är ett info meddelande',
      en: 'This is an info message',
    },
  },
  [BannerType.WARNING]: {
    label: { fi: 'Varoitusviesti', sv: 'Varningsmeddelande', en: 'Warning message' },
    text: {
      fi: 'Tämä on varoitusviesti',
      sv: 'Detta är ett varningsmeddelande',
      en: 'This is a warning message',
    },
  },
  [BannerType.ERROR]: {
    label: { fi: 'Virheviesti', sv: 'Felmeddelande', en: 'Error message' },
    text: {
      fi: 'Tämä on virheviesti',
      sv: 'Detta är ett felmeddelande',
      en: 'This is an error message',
    },
  },
};

describe('ServiceNotifications', () => {
  it.each(Object.values(BannerType))(
    'renders %s notification and handles close action',
    async (bannerType) => {
      server.use(
        rest.get('/api/banners', async (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              [bannerType]: BANNERS[bannerType],
            }),
          );
        }),
      );

      render(
        <I18nextProvider i18n={i18n}>
          <ServiceNotifications />
        </I18nextProvider>,
      );

      expect(await screen.findByText(BANNERS[bannerType].label.fi)).toBeInTheDocument();
      expect(screen.getByText(BANNERS[bannerType].text.fi)).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Sulje ilmoitus');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(BANNERS[bannerType].label.fi)).not.toBeInTheDocument();
        expect(screen.queryByText(BANNERS[bannerType].text.fi)).not.toBeInTheDocument();
      });
    },
  );

  test('sessionStorage prevents rendering closed notifications', async () => {
    server.use(
      rest.get('/api/banners', async (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(BANNERS));
      }),
    );

    sessionStorage.setItem('info-notification-closed', 'true');
    sessionStorage.setItem('warning-notification-closed', 'true');
    sessionStorage.setItem('error-notification-closed', 'true');

    render(
      <I18nextProvider i18n={i18n}>
        <ServiceNotifications />
      </I18nextProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText(BANNERS[BannerType.INFO].label.fi)).not.toBeInTheDocument();
      expect(screen.queryByText(BANNERS[BannerType.INFO].text.fi)).not.toBeInTheDocument();
      expect(screen.queryByText(BANNERS[BannerType.WARNING].label.fi)).not.toBeInTheDocument();
      expect(screen.queryByText(BANNERS[BannerType.WARNING].text.fi)).not.toBeInTheDocument();
      expect(screen.queryByText(BANNERS[BannerType.ERROR].label.fi)).not.toBeInTheDocument();
      expect(screen.queryByText(BANNERS[BannerType.ERROR].text.fi)).not.toBeInTheDocument();
    });
  });
});
