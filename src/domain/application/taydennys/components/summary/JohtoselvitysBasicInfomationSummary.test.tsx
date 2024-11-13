import { cloneDeep } from 'lodash';
import { render, screen } from '../../../../../testUtils/render';
import BasicInformationSummary from './JohtoselvitysBasicInformationSummary';
import { JohtoselvitysData } from '../../../types/application';
import applications from '../../../../mocks/data/hakemukset-data';

const testApplication = cloneDeep(applications[10].applicationData as JohtoselvitysData);

const mockData: JohtoselvitysData = {
  ...testApplication,
  name: 'Test Name',
  workDescription: 'Test Description',
  rockExcavation: true,
  postalAddress: {
    streetAddress: {
      streetName: 'Test Street',
    },
  },
};

describe('BasicInformationSummary', () => {
  test('renders nothing if no changes are detected', () => {
    const { container } = render(
      <BasicInformationSummary data={mockData} originalData={mockData} muutokset={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders name change correctly', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, name: 'New Name' }}
        originalData={mockData}
        muutokset={['name']}
      />,
    );
    expect(screen.getByText('New Name')).toBeInTheDocument();
  });

  test('renders postal address change correctly', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, postalAddress: { streetAddress: { streetName: 'New Street' } } }}
        originalData={mockData}
        muutokset={['postalAddress']}
      />,
    );
    expect(screen.getByText('New Street')).toBeInTheDocument();
  });

  test('renders work description change correctly', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, workDescription: 'New Description' }}
        originalData={mockData}
        muutokset={['workDescription']}
      />,
    );
    expect(screen.getByText('New Description')).toBeInTheDocument();
  });

  test('renders rock excavation change correctly', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, rockExcavation: false }}
        originalData={mockData}
        muutokset={['rockExcavation']}
      />,
    );
    expect(screen.getByText('Louhitaanko työn yhteydessä')).toBeInTheDocument();
    expect(screen.getByText('Ei')).toBeInTheDocument();
  });

  test('renders work is about changes correctly', () => {
    render(
      <BasicInformationSummary
        data={{ ...mockData, constructionWork: true }}
        originalData={mockData}
        muutokset={['constructionWork']}
      />,
    );
    expect(screen.getByText('Uuden rakenteen tai johdon rakentamisesta')).toBeInTheDocument();
  });

  test('renders removed work is about changes correctly', () => {
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
});
