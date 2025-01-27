import { cloneDeep } from 'lodash';
import JohtoselvitysAreaSummary from './JohtoselvitysAreaSummary';
import { JohtoselvitysData } from '../../../types/application';
import applications from '../../../../mocks/data/hakemukset-data';
import { render, screen } from '../../../../../testUtils/render';

const testApplication = cloneDeep(applications[10].applicationData as JohtoselvitysData);

const mockData: JohtoselvitysData = {
  ...testApplication,
  startTime: new Date('2024-08-01'),
  endTime: new Date('2024-08-31'),
};

describe('JohtoselvitysAreaSummary', () => {
  test('renders nothing if no changes', () => {
    const { container } = render(
      <JohtoselvitysAreaSummary data={mockData} originalData={mockData} muutokset={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('renders start time change', () => {
    render(
      <JohtoselvitysAreaSummary
        data={{ ...mockData, startTime: new Date('2024-08-02') }}
        originalData={mockData}
        muutokset={['startTime']}
      />,
    );

    expect(screen.getByText('2.8.2024')).toBeInTheDocument();
  });

  test('renders end time change', () => {
    render(
      <JohtoselvitysAreaSummary
        data={{ ...mockData, endTime: new Date('2024-08-29') }}
        originalData={mockData}
        muutokset={['endTime']}
      />,
    );

    expect(screen.getByText('29.8.2024')).toBeInTheDocument();
  });

  test('renders area changes', () => {
    render(
      <JohtoselvitysAreaSummary data={mockData} originalData={mockData} muutokset={['areas[0]']} />,
    );

    expect(screen.getByText('Työalue')).toBeInTheDocument();
    expect(screen.getByText('Pinta-ala: 235 m²')).toBeInTheDocument();
    expect(screen.queryByText(/poistettu/i)).not.toBeInTheDocument();
  });

  test('renders removed areas', () => {
    render(
      <JohtoselvitysAreaSummary
        data={{ ...mockData, areas: [] }}
        originalData={mockData}
        muutokset={['areas[0]']}
      />,
    );

    expect(screen.getByText(/poistettu/i)).toBeInTheDocument();
    expect(screen.getByText('Työalue')).toBeInTheDocument();
    expect(screen.getByText('Pinta-ala: 235 m²')).toBeInTheDocument();
  });
});
