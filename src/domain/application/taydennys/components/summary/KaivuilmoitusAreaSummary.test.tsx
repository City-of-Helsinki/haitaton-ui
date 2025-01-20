import { cloneDeep } from 'lodash';
import KaivuilmoitusAreaSummary from './KaivuilmoitusAreaSummary';
import { KaivuilmoitusData } from '../../../types/application';
import applications from '../../../../mocks/data/hakemukset-data';
import { render, screen } from '../../../../../testUtils/render';

const testApplication = cloneDeep(applications[12].applicationData as KaivuilmoitusData);

const mockData: KaivuilmoitusData = {
  ...testApplication,
  startTime: new Date('2024-08-01'),
  endTime: new Date('2024-08-31'),
};

describe('Kaivuilmoitus taydennys AreaSummary', () => {
  test('renders nothing if no changes', () => {
    const { container } = render(
      <KaivuilmoitusAreaSummary data={mockData} originalData={mockData} muutokset={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('renders start time change', () => {
    render(
      <KaivuilmoitusAreaSummary
        data={{ ...mockData, startTime: new Date('2024-08-02') }}
        originalData={mockData}
        muutokset={['startTime']}
      />,
    );

    expect(screen.getByText('2.8.2024')).toBeInTheDocument();
  });

  test('renders end time change', () => {
    render(
      <KaivuilmoitusAreaSummary
        data={{ ...mockData, endTime: new Date('2024-08-29') }}
        originalData={mockData}
        muutokset={['endTime']}
      />,
    );

    expect(screen.getByText('29.8.2024')).toBeInTheDocument();
  });

  test('renders area changes', () => {
    render(
      <KaivuilmoitusAreaSummary
        data={{
          ...mockData,
          areas: [
            {
              ...mockData.areas[0],
              katuosoite: 'Aidasmäentie 6',
              tyonTarkoitukset: ['VIEMARI', 'KAUKOLAMPO'],
              meluhaitta: 'JATKUVA_MELUHAITTA',
              polyhaitta: 'SATUNNAINEN_POLYHAITTA',
              tarinahaitta: 'EI_TARINAHAITTAA',
              kaistahaitta: 'USEITA_AJOSUUNTIA_POISTUU_KAYTOSTA',
              kaistahaittojenPituus: 'PITUUS_ALLE_10_METRIA',
              lisatiedot: 'Lorem ipsum',
            },
          ],
        }}
        originalData={mockData}
        muutokset={[
          'areas[0]',
          'areas[0].tyoalueet[0]',
          'areas[0].tyoalueet[0].geometry',
          'areas[0].katuosoite',
          'areas[0].tyonTarkoitukset',
          'areas[0].meluhaitta',
          'areas[0].polyhaitta',
          'areas[0].tarinahaitta',
          'areas[0].kaistahaitta',
          'areas[0].kaistahaittojenPituus',
          'areas[0].lisatiedot',
        ]}
      />,
    );

    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' && element?.textContent === 'Työalueet (Hankealue 2)',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Työalue 1 (158 m²)')).toBeInTheDocument();
    expect(screen.getByText('Työalue 2 (30 m²)')).toBeInTheDocument();
    expect(screen.getByText('Pinta-ala: 188 m²')).toBeInTheDocument();
    expect(screen.getByText('Katuosoite: Aidasmäentie 6')).toBeInTheDocument();
    expect(screen.getByText('Työn tarkoitus: Viemäri, Kaukolämpö')).toBeInTheDocument();
    expect(screen.getByText('Meluhaitta: Jatkuva meluhaitta')).toBeInTheDocument();
    expect(screen.getByText('Pölyhaitta: Satunnainen pölyhaitta')).toBeInTheDocument();
    expect(screen.getByText('Tärinähaitta: Ei tärinähaittaa')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Autoliikenteen kaistahaitta: Useita autoliikenteen ajosuuntia poistuu käytöstä',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Kaistahaittojen pituus: Alle 10 m')).toBeInTheDocument();
    expect(screen.getByText('Lisätietoja alueesta: Lorem ipsum')).toBeInTheDocument();
  });

  test('renders removed areas', () => {
    render(
      <KaivuilmoitusAreaSummary
        data={{ ...mockData, areas: [] }}
        originalData={mockData}
        muutokset={['areas[0]']}
      />,
    );

    expect(screen.getByText(/poistettu/i)).toBeInTheDocument();
    expect(screen.getByText('Työalue 1 (158 m²)')).toBeInTheDocument();
    expect(screen.getByText('Työalue 2 (30 m²)')).toBeInTheDocument();
    expect(screen.getByText('Pinta-ala: 188 m²')).toBeInTheDocument();
    expect(screen.getByText('Katuosoite: Aidasmäentie 5')).toBeInTheDocument();
    expect(screen.getByText('Työn tarkoitus: Vesi')).toBeInTheDocument();
    expect(screen.getByText('Meluhaitta: Toistuva meluhaitta')).toBeInTheDocument();
    expect(screen.getByText('Pölyhaitta: Jatkuva pölyhaitta')).toBeInTheDocument();
    expect(screen.getByText('Tärinähaitta: Satunnainen tärinähaitta')).toBeInTheDocument();
  });
});
