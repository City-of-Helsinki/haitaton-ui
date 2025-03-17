import { cloneDeep } from 'lodash';
import KaivuilmoitusHaittojenhallintaSummary from './KaivuilmoitusHaittojenhallintaSummary';
import { KaivuilmoitusData } from '../../../types/application';
import hankkeet from '../../../../mocks/data/hankkeet-data';
import applications from '../../../../mocks/data/hakemukset-data';
import { render, screen } from '../../../../../testUtils/render';

const testHanke = cloneDeep(hankkeet[1]);
const testApplication = cloneDeep(applications[12].applicationData as KaivuilmoitusData);

const mockData: KaivuilmoitusData = {
  ...testApplication,
};

describe('Kaivuilmoitus taydennys HaittojenhallintaSummary', () => {
  test('renders nothing if no changes', () => {
    const { container } = render(
      <KaivuilmoitusHaittojenhallintaSummary
        hankealueet={testHanke.alueet!}
        kaivuilmoitusAlueet={mockData.areas}
        muutokset={[]}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('renders haittojenhallinta changes', () => {
    render(
      <KaivuilmoitusHaittojenhallintaSummary
        hankealueet={testHanke.alueet!}
        kaivuilmoitusAlueet={[
          {
            ...mockData.areas[0],
            haittojenhallintasuunnitelma: {
              PYORALIIKENNE: 'Pyöräliikenteen haitat',
              MUUT: 'Muut haitat',
            },
          },
        ]}
        muutokset={[
          'areas[0].haittojenhallintasuunnitelma[PYORALIIKENNE]',
          'areas[0].haittojenhallintasuunnitelma[MUUT]',
        ]}
      />,
    );

    expect(screen.getByText('Työalueet (Hankealue 2)')).toBeInTheDocument();
    expect(screen.getByText('Pyöräliikenteen merkittävyys')).toBeInTheDocument();
    expect(screen.getByText('Pyöräliikenteen haitat')).toBeInTheDocument();
    expect(screen.getByText('Muut haittojenhallintatoimet')).toBeInTheDocument();
    expect(screen.getByText('Muut haitat')).toBeInTheDocument();
    expect(screen.queryByText('Linja-autojen paikallisliikenne')).not.toBeInTheDocument();
    expect(screen.queryByText('Autoliikenteen ruuhkautuminen')).not.toBeInTheDocument();
    expect(screen.queryByText('Raitioliikenne')).not.toBeInTheDocument();
  });
});
