import { cloneDeep } from 'lodash';
import { render, screen } from '../../../../../testUtils/render';
import BasicInformationSummary from './KaivuilmoitusBasicInformationSummary';
import { KaivuilmoitusData } from '../../../types/application';
import applications from '../../../../mocks/data/hakemukset-data';

const testApplication = cloneDeep(applications[12].applicationData as KaivuilmoitusData);

const mockData: KaivuilmoitusData = {
  ...testApplication,
  name: 'Test Name',
  workDescription: 'Test Description',
};

describe('Kaivuilmoitus taydennys BasicInformationSummary', () => {
  test('renders nothing if no changes are detected', () => {
    const { container } = render(
      <BasicInformationSummary data={mockData} originalData={mockData} muutokset={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('renders name change', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, name: 'New Name' }}
        originalData={mockData}
        muutokset={['name']}
      />,
    );

    expect(screen.getByText('New Name')).toBeInTheDocument();
  });

  test('renders work description change', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, workDescription: 'New Description' }}
        originalData={mockData}
        muutokset={['workDescription']}
      />,
    );

    expect(screen.getByText('New Description')).toBeInTheDocument();
  });

  test('renders work is about changes', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, constructionWork: true }}
        originalData={mockData}
        muutokset={['constructionWork']}
      />,
    );

    expect(screen.getByText('Uuden rakenteen tai johdon rakentamisesta')).toBeInTheDocument();
  });

  test('renders removed work is about changes', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, constructionWork: false }}
        originalData={{ ...mockData, constructionWork: true }}
        muutokset={['constructionWork']}
      />,
    );

    expect(screen.getByText(/poistettu/i)).toBeInTheDocument();
    expect(screen.getByText('Uuden rakenteen tai johdon rakentamisesta')).toBeInTheDocument();
  });

  test('renders cable reports change', () => {
    const cableReports = ['JS2500001', 'JS2500002'];
    render(
      <BasicInformationSummary
        data={{ ...mockData, cableReports }}
        originalData={mockData}
        muutokset={['cableReports']}
      />,
    );

    expect(screen.getByText(cableReports.join(', '))).toBeInTheDocument();
  });

  test('renders placement contracts change', () => {
    const placementContracts = ['SL0000001', 'SL0000002'];
    render(
      <BasicInformationSummary
        data={{ ...mockData, placementContracts }}
        originalData={mockData}
        muutokset={['placementContracts']}
      />,
    );

    expect(screen.getByText(placementContracts.join(', '))).toBeInTheDocument();
  });

  test('renders required competence change', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, requiredCompetence: false }}
        originalData={mockData}
        muutokset={['requiredCompetence']}
      />,
    );

    expect(screen.getByText('Työhön vaadittava pätevyys')).toBeInTheDocument();
    expect(screen.getByText('Ei')).toBeInTheDocument();
  });
});
