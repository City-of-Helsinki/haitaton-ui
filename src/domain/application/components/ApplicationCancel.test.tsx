import React from 'react';
import { rest } from 'msw';
import { IconCross } from 'hds-react';
import { render, screen } from '../../../testUtils/render';
import { ApplicationCancel } from './ApplicationCancel';
import mockApplications from '../../mocks/data/hakemukset-data';
import { server } from '../../mocks/test-server';

test('Cancel application when it has not been saved', async () => {
  const { user } = render(
    <ApplicationCancel
      applicationId={null}
      alluStatus={null}
      hankeTunnus="HAI22-2"
      buttonIcon={<IconCross />}
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));

  // Click confirm button in the confirmation dialog
  await user.click(screen.getByRole('button', { name: 'Vahvista' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
  expect(screen.queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
});

test('Cancel application when it has been saved, but not sent to Allu', async () => {
  const application = mockApplications[0];

  const { user } = render(
    <ApplicationCancel
      applicationId={application.id}
      alluStatus={application.alluStatus}
      hankeTunnus="HAI22-2"
      buttonIcon={<IconCross />}
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));

  // Click confirm button in the confirmation dialog
  await user.click(screen.getByRole('button', { name: 'Vahvista' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
  expect(screen.queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
});

test('Cancel application when generated hanke is also deleted, directs to hanke list', async () => {
  server.use(
    rest.delete('/api/hakemukset/:id', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ hankeDeleted: true }));
    }),
  );
  const application = mockApplications[0];
  const { user } = render(
    <ApplicationCancel
      applicationId={application.id}
      alluStatus={application.alluStatus}
      hankeTunnus="HAI22-2"
      buttonIcon={<IconCross />}
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));
  await user.click(screen.getByRole('button', { name: 'Vahvista' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku');
  expect(screen.queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
});

test('Cancel application when it has been saved and sent to Allu but is still pending', async () => {
  const application = mockApplications[1];

  const { user } = render(
    <ApplicationCancel
      applicationId={application.id}
      alluStatus={application.alluStatus}
      hankeTunnus="HAI22-2"
      buttonIcon={<IconCross />}
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));

  // Click confirm button in the confirmation dialog
  await user.click(screen.getByRole('button', { name: 'Vahvista' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
  expect(screen.queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
});

test('Cancel application when it has already been cancelled', async () => {
  server.use(
    rest.delete('/api/hakemukset/:id', async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ hankeDeleted: false }));
    }),
  );
  const application = mockApplications[5];
  const { user } = render(
    <ApplicationCancel
      applicationId={application.id}
      alluStatus={application.alluStatus}
      hankeTunnus="HAI22-2"
      buttonIcon={<IconCross />}
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));

  // Click confirm button in the confirmation dialog
  await user.click(screen.getByRole('button', { name: 'Vahvista' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
  expect(screen.queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
});

test('Canceling application is not possible when it in handling in Allu', () => {
  const application = mockApplications[2];

  render(
    <ApplicationCancel
      applicationId={application.id}
      alluStatus={application.alluStatus}
      hankeTunnus="HAI22-2"
      buttonIcon={<IconCross />}
    />,
  );

  expect(screen.queryByRole('button', { name: 'Peru hakemus' })).not.toBeInTheDocument();
});
