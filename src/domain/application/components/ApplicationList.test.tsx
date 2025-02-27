import { render, screen } from '../../../testUtils/render';
import ApplicationList from './ApplicationList';
import { hankkeenHakemukset } from '../../mocks/data/hakemukset-data';

describe('Application list', () => {
  test('Correct information about each application should be displayed', async () => {
    const { user } = render(
      <ApplicationList hankeTunnus="HAI22-2" applications={hankkeenHakemukset} />,
    );

    // application types
    expect(screen.getAllByText('Johtoselvitys').length).toBe(4);
    expect(screen.getAllByText('Kaivuilmoitus').length).toBe(7);
    // application statuses
    expect(screen.getAllByText('Luonnos').length).toBe(5); // 2 x 2 + 1 as 'Luonnos' is both the application identifier and the status of the application when it's in draft state + 1 muutosilmoitus in draft state
    expect(screen.getAllByText('Odottaa käsittelyä').length).toBe(1);
    expect(screen.getAllByText('Käsittelyssä').length).toBe(1);
    expect(screen.getAllByText('Päätös').length).toBe(2);
    expect(screen.getAllByText('Työ valmis').length).toBe(1);
    expect(screen.getAllByText('Täydennyspyyntö').length).toBe(2);
    // application names
    expect(screen.getAllByText('Aidasmäentien viimeiset kaivuut').length).toBe(2);
    expect(screen.getByText('Aidasmäentien laajennetut kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien toiset kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien valmiit kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien toiminnallisen kunnon kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien parantaminen')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien kuopat')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien vanha parantaminen')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien putkityöt')).toBeInTheDocument();
    // decisions of two applications in 'Päätös' state
    expect(screen.getAllByText('Lataa viimeisin päätös (PDF)').length).toBe(4);
    expect(screen.getAllByText('Lataa toiminnallinen kunto (PDF)').length).toBe(2);
    expect(screen.getByText('Lataa työ valmis (PDF)')).toBeInTheDocument();
    // muutosilmoitus
    expect(screen.getByText('Muutosilmoitus')).toBeInTheDocument();

    // 2nd page
    await user.click(screen.getByText('Seuraava'));

    expect(screen.getAllByText('Johtoselvitys').length).toBe(1);
    // application statuses
    expect(screen.getAllByText('Luonnos').length).toBe(2);
    // application names
    expect(screen.getByText('Mannerheimintien kaivuut')).toBeInTheDocument();
  });
});
