import { render, screen } from '../../../testUtils/render';
import ApplicationList from './ApplicationList';
import { hankkeenHakemukset } from '../../mocks/data/hakemukset-data';
import { waitFor } from '@testing-library/react';

describe('Application list', () => {
  test('Correct information about each application should be displayed', async () => {
    const { user } = render(
      <ApplicationList hankeTunnus="HAI22-2" applications={hankkeenHakemukset} />,
    );

    // application types
    expect(screen.getAllByText('Johtoselvitys').length).toBe(3);
    expect(screen.getAllByText('Kaivuilmoitus').length).toBe(8);
    // application statuses
    expect(screen.getAllByText('Luonnos').length).toBe(5); // 2 x 2 + 1 as 'Luonnos' is both the application identifier and the status of the application when it's in draft state + 1 muutosilmoitus in draft state
    expect(screen.getAllByText('Käsittelyssä').length).toBe(1);
    expect(screen.getAllByText('Päätös').length).toBe(3);
    expect(screen.getAllByText('Työ valmis').length).toBe(1);
    expect(screen.getAllByText('Täydennyspyyntö').length).toBe(2);
    // application names
    expect(screen.getByText('Aidasmäentien viimeiset kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien laajennetut kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien toiset kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien valmiit kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien toiminnallisen kunnon kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien parantaminen')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien vanha parantaminen')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien putkityöt')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien vihoviimeiset kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien muutoskaivuut')).toBeInTheDocument();
    // decisions of two applications in 'Päätös' state
    expect(screen.getAllByText('Lataa viimeisin päätös (PDF)').length).toBe(5);
    expect(screen.getAllByText('Lataa toiminnallinen kunto (PDF)').length).toBe(2);
    expect(screen.getByText('Lataa työ valmis (PDF)')).toBeInTheDocument();
    // muutosilmoitus
    expect(screen.getByText('Muutosilmoitus')).toBeInTheDocument();

    // 2nd page
    await user.click(screen.getByText('Seuraava'));

    expect(screen.getAllByText('Johtoselvitys').length).toBe(2);
    // application statuses
    expect(screen.getAllByText('Luonnos').length).toBe(2);
    expect(screen.getAllByText('Odottaa käsittelyä').length).toBe(1);
    // application names
    expect(screen.getByText('Mannerheimintien kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien kuopat')).toBeInTheDocument();
  });

  test('Navigating to application view from name works', async () => {
    const { user } = render(
      <ApplicationList hankeTunnus="HAI22-2" applications={hankkeenHakemukset} />,
    );

    await user.click(screen.getAllByText('Luonnos')[1]);

    expect(window.location.pathname).toBe('/fi/hakemus/7');
  });

  test('Navigating to application view from icon works', async () => {
    const { user } = render(
      <ApplicationList hankeTunnus="HAI22-2" applications={hankkeenHakemukset} />,
    );

    await user.click(screen.getByTestId('applicationViewLink-7'));

    expect(window.location.pathname).toBe('/fi/hakemus/7');
  });

  test('Navigating to application form works', async () => {
    const { user } = render(
      <ApplicationList hankeTunnus="HAI22-2" applications={hankkeenHakemukset} />,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('applicationEditLink-7')).toBeInTheDocument();
      },
      { interval: 100, timeout: 5000 },
    );

    await user.click(screen.getByTestId('applicationEditLink-7'));

    expect(window.location.pathname).toBe('/fi/kaivuilmoitus/7/muokkaa');
  });

  test('Navigating to muutosilmoitus form works', async () => {
    const { user } = render(
      <ApplicationList hankeTunnus="HAI22-2" applications={hankkeenHakemukset} />,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('muutosilmoitusEditLink-14')).toBeInTheDocument();
      },
      { interval: 100, timeout: 5000 },
    );

    await user.click(screen.getByTestId('muutosilmoitusEditLink-14'));

    expect(window.location.pathname).toBe('/fi/kaivuilmoitus-muutosilmoitus/14/muokkaa');
  });
});
