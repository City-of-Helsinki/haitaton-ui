import React from 'react';
import userEvent from '@testing-library/user-event';
import { cleanup, render, screen } from '../../../testUtils/render';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import HankeViewContainer from './HankeViewContainer';

afterEach(cleanup);

test('Draft state notification is rendered when hanke is in draft state', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-1" />);

  await waitForLoadingToFinish();

  const draftStateElements = screen.queryAllByText(/hanke on luonnostilassa/i, { exact: false });

  expect(draftStateElements[0]).toBeInTheDocument();
});

test('Add application and End hanke buttons are disabled when hanke is in draft state', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-1" />);

  expect(screen.getByRole('button', { name: /lisää hakemus/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /päätä hanke/i })).toBeDisabled();
});

test('Draft state notification is not rendered when hanke is not in draft state', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  const draftStateElements = screen.queryAllByText(/hanke on luonnostilassa/i, { exact: false });

  expect(draftStateElements.length).toBe(0);
});

test('Correct information about hanke should be displayed', async () => {
  const user = userEvent.setup();

  render(<HankeViewContainer hankeTunnus="HAI22-3" />);

  await waitForLoadingToFinish();

  // Data in basic information tab
  expect(screen.getAllByText('Mannerheimintien kaukolämpö').length).toBe(2);
  expect(screen.getAllByText('HAI22-3').length).toBe(2);
  expect(
    screen.queryByText(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
    )
  ).toBeInTheDocument();
  expect(screen.queryByText('Mannerheimintie 6')).toBeInTheDocument();
  expect(screen.queryByText('2.1.2023')).toBeInTheDocument();
  expect(screen.queryByText('24.2.2023')).toBeInTheDocument();
  expect(screen.queryByText('Ohjelmointi')).toBeInTheDocument();
  expect(screen.queryByText('Kaukolämpö')).toBeInTheDocument();
  expect(
    screen.queryByText('Työmaa ulottuu kadun eri puolille ja/tai usean korttelin mittainen työmaa')
  ).toBeInTheDocument();
  expect(screen.queryByText('Ei')).toBeInTheDocument();
  expect(screen.queryByText('4699 m²')).toBeInTheDocument();

  // Data in side bar
  expect(screen.queryByText('Hankealue 1 (4699 m²)')).toBeInTheDocument();
  expect(screen.queryByText('2.1.2023–24.2.2023')).toBeInTheDocument();

  // Change to areas tab
  await user.click(screen.getByRole('tab', { name: /alueet/i }));

  // Data in areas tab
  expect(screen.queryByText('Hankealue 1')).toBeInTheDocument();
  expect(screen.getAllByText('2.1.2023–24.2.2023').length).toBe(2);
  expect(screen.getByTestId('test-liikennehaittaIndeksi')).toHaveTextContent('3');
  expect(screen.getByTestId('test-pyorailyIndeksi')).toHaveTextContent('3.5');
  expect(screen.getByTestId('test-joukkoliikenneIndeksi')).toHaveTextContent('2');
  expect(screen.getByTestId('test-ruuhkautumisIndeksi')).toHaveTextContent('1.5');
  expect(screen.queryByText('4699 m²')).toBeInTheDocument();
  expect(screen.queryByText('Meluhaitta: Satunnainen haitta')).toBeInTheDocument();
  expect(screen.queryByText('Pölyhaitta: Satunnainen haitta')).toBeInTheDocument();
  expect(screen.queryByText('Tärinähaitta: Lyhytaikainen toistuva haitta')).toBeInTheDocument();
  expect(screen.queryByText('Autoliikenteen kaistahaitta: Ei vaikuta')).toBeInTheDocument();
  expect(screen.queryByText('Kaistahaittojen pituus: Ei vaikuta')).toBeInTheDocument();

  // Change to contacts tab
  await user.click(screen.getByRole('tab', { name: /yhteystiedot/i }));

  // Data in contacts tab
  expect(screen.queryByText('Yritys')).toBeInTheDocument();
  expect(screen.queryByText('Kauppisen maansiirtofirma KY')).toBeInTheDocument();
  expect(screen.queryByText('y-1234567')).toBeInTheDocument();
  expect(screen.queryByText('Lahdenkatu 3')).toBeInTheDocument();
  expect(screen.queryByText('42100 Lahti')).toBeInTheDocument();
});
