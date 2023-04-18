import React from 'react';
import userEvent from '@testing-library/user-event';
import { IconCross } from 'hds-react';
import { render, screen } from '../../../testUtils/render';
import { ApplicationCancel } from './ApplicationCancel';
import mockApplications from '../../mocks/data/hakemukset-data';

test('Cancel application when it has not been saved', async () => {
  const user = userEvent.setup();

  render(
    <ApplicationCancel
      applicationId={null}
      alluStatus={null}
      hankeTunnus="HAI22-2"
      buttonVariant="secondary"
      buttonIcon={<IconCross />}
    />
  );

  await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));

  // Click confirm button in the confirmation dialog
  await user.click(screen.getByRole('button', { name: 'Vahvista' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
  expect(screen.queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
});

test('Cancel application when it has been saved, but not sent to Allu', async () => {
  const user = userEvent.setup();

  const application = mockApplications[0];

  render(
    <ApplicationCancel
      applicationId={application.id}
      alluStatus={application.alluStatus}
      hankeTunnus="HAI22-2"
      buttonVariant="secondary"
      buttonIcon={<IconCross />}
    />
  );

  await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));

  // Click confirm button in the confirmation dialog
  await user.click(screen.getByRole('button', { name: 'Vahvista' }));

  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
  expect(screen.queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
});

test('Cancel application when it has been saved and sent to Allu but is still pending', async () => {
  const user = userEvent.setup();

  const application = mockApplications[1];

  render(
    <ApplicationCancel
      applicationId={application.id}
      alluStatus={application.alluStatus}
      hankeTunnus="HAI22-2"
      buttonVariant="secondary"
      buttonIcon={<IconCross />}
    />
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
      buttonVariant="secondary"
      buttonIcon={<IconCross />}
    />
  );

  expect(screen.queryByRole('button', { name: 'Peru hakemus' })).not.toBeInTheDocument();
});
