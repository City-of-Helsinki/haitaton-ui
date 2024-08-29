import { render, screen } from '../../../testUtils/render';
import ApplicationList from './ApplicationList';
import { hankkeenHakemukset } from '../../mocks/data/hakemukset-data';

describe('Application list', () => {
  test('Correct information about each application should be displayed', async () => {
    render(<ApplicationList applications={hankkeenHakemukset} />);

    // application types
    expect(screen.getAllByText('Johtoselvitys').length).toBe(3);
    expect(screen.getAllByText('Kaivuilmoitus').length).toBe(3);
    // application statuses
    expect(screen.getAllByText('Luonnos').length).toBe(6); // 3 x 2 as 'Luonnos' is both the application identifier and the status of the application when it's in draft state
    expect(screen.getAllByText('Odottaa käsittelyä').length).toBe(1);
    expect(screen.getAllByText('Käsittelyssä').length).toBe(1);
    expect(screen.getAllByText('Päätös').length).toBe(1);
    // application names
    expect(screen.getByText('Aidasmäentien viimeiset kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien laajennetut kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Aidasmäentien toiset kaivuut')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien parantaminen')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien kuopat')).toBeInTheDocument();
    expect(screen.getByText('Mannerheimintien kaivuut')).toBeInTheDocument();
    // decisions of the single application in 'Päätös' state
    expect(screen.getByText('Lataa päätös (PDF)')).toBeInTheDocument();
    expect(screen.getByText('Lataa toiminnallinen kunto (PDF)')).toBeInTheDocument();
    expect(screen.getByText('Lataa työ valmis (PDF)')).toBeInTheDocument();
  });
});
