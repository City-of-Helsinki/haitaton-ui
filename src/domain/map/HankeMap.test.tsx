import { render, screen, waitFor } from '../../testUtils/render';
import { changeFilterDate } from '../../testUtils/helperFunctions';
import HankeMap from './HankeMap';
import api from '../api/api';
import { useMapViewportBounds } from '../../common/components/map/hooks/useMapViewportBounds';
import { store } from '../../common/redux/store';
import { actions } from './reducer';

// Mock dependencies
jest.mock('../api/api');
jest.mock('../../common/components/map/hooks/useMapViewportBounds');

const mockApi = api as jest.Mocked<typeof api>;
const mockUseMapViewportBounds = useMapViewportBounds as jest.MockedFunction<
  typeof useMapViewportBounds
>;

const startDateLabel = 'Ajanjakson alku';
const endDateLabel = 'Ajanjakson loppu';
const countOfFilteredHankeAlueet = 'countOfFilteredHankeAlueet';

// Mock grid metadata and hanke data for different test scenarios
const mockGridMetadata = {
  cellSizeMeters: 1000,
  originX: 25440000,
  originY: 6630000,
  maxX: 25500000,
  maxY: 6690000,
};

const createMockHankeData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    hankeTunnus: `HAI22-${i + 1}`,
    nimi: `Test Hanke ${i + 1}`,
    alueet: [
      {
        id: i + 1,
        nimi: `Test Area ${i + 1}`,
        haittaAlkuPvm: '2023-01-01',
        haittaLoppuPvm: '2023-12-31',
        geometriat: {
          featureCollection: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [
                      [25445000 + i * 100, 6635000 + i * 100],
                      [25446000 + i * 100, 6635000 + i * 100],
                      [25446000 + i * 100, 6636000 + i * 100],
                      [25445000 + i * 100, 6636000 + i * 100],
                      [25445000 + i * 100, 6635000 + i * 100],
                    ],
                  ],
                },
                properties: {},
              },
            ],
          },
        },
        tormaystarkastelu: {
          liikennehaittaindeksi: {
            indeksi: 3,
          },
        },
      },
    ],
  }));

describe('HankeMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset Redux store to initial state to prevent test contamination
    const currentYear = new Date().getFullYear();
    store.dispatch(actions.setHankeFilterStartDate(`${currentYear}-01-01`));
    store.dispatch(actions.setHankeFilterEndDate(`${currentYear + 1}-12-31`));

    // Default mock setup
    mockUseMapViewportBounds.mockReturnValue({
      minX: 25445000,
      minY: 6635000,
      maxX: 25446000,
      maxY: 6636000,
    });

    mockApi.get.mockImplementation((url) => {
      if (url === '/public-hankkeet/grid/metadata') {
        return Promise.resolve({ data: mockGridMetadata });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    mockApi.post.mockImplementation((url) => {
      if (url === '/public-hankkeet/grid') {
        return Promise.resolve({ data: createMockHankeData(5) });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });
  test('Render test', async () => {
    const { user } = render(<HankeMap />);

    expect(screen.getByLabelText('Ortokartta')).not.toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
    await user.click(screen.getByText('Ortokartta'));
    expect(screen.getByLabelText('Ortokartta')).toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
  });

  test('Number of projects displayed on the map can be controlled with dateRangeControl', async () => {
    const renderedComponent = render(<HankeMap />);

    await screen.findByPlaceholderText('Etsi osoitteella');
    await screen.findByText('Ajanjakson alku');

    // Wait for initial load with default dates
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('5');
    });

    // Test changing start date to narrow the range
    mockApi.post.mockImplementation((url) => {
      if (url === '/public-hankkeet/grid') {
        return Promise.resolve({ data: createMockHankeData(3) }); // Fewer results with later start date
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    changeFilterDate(startDateLabel, renderedComponent, '1.6.2023');
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('3');
    });

    // Test changing end date to very narrow range
    mockApi.post.mockImplementation((url) => {
      if (url === '/public-hankkeet/grid') {
        return Promise.resolve({ data: createMockHankeData(0) }); // No data for very narrow date range
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    changeFilterDate(endDateLabel, renderedComponent, '1.1.2022');
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('0');
    });

    // Test expanding the date range again
    mockApi.post.mockImplementation((url) => {
      if (url === '/public-hankkeet/grid') {
        return Promise.resolve({ data: createMockHankeData(4) });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    changeFilterDate(endDateLabel, renderedComponent, '12.12.2023');
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('4');
    });

    // Test resetting start date to earlier date
    mockApi.post.mockImplementation((url) => {
      if (url === '/public-hankkeet/grid') {
        return Promise.resolve({ data: createMockHankeData(5) }); // More results with earlier start date
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    changeFilterDate(startDateLabel, renderedComponent, '1.1.2023');
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('5');
    });
  });

  test('handles invalid and partial date inputs gracefully', async () => {
    const renderedComponent = render(<HankeMap />);

    await screen.findByPlaceholderText('Etsi osoitteella');
    await screen.findByText('Ajanjakson alku');

    // Wait for initial load
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('5');
    });

    // Test partial date inputs - should still work with default behavior
    changeFilterDate(startDateLabel, renderedComponent, '1');
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('5');
    });

    changeFilterDate(startDateLabel, renderedComponent, '1.1');
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('5');
    });

    // Test null date inputs
    changeFilterDate(startDateLabel, renderedComponent, null);
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('5');
    });

    changeFilterDate(endDateLabel, renderedComponent, null);
    await waitFor(() => {
      expect(renderedComponent.getByTestId(countOfFilteredHankeAlueet)).toHaveTextContent('5');
    });
  });

  test('loads grid metadata and hanke data on mount', async () => {
    render(<HankeMap />);

    await screen.findByPlaceholderText('Etsi osoitteella');

    // Verify metadata was loaded
    expect(mockApi.get).toHaveBeenCalledWith('/public-hankkeet/grid/metadata');

    // Verify grid data was loaded with correct parameters
    await waitFor(
      () => {
        expect(mockApi.post).toHaveBeenCalledWith(
          '/public-hankkeet/grid',
          expect.objectContaining({
            startDate: expect.any(String),
            endDate: expect.any(String),
            cells: expect.arrayContaining([
              expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
            ]),
          }),
        );
      },
      { timeout: 10000 },
    );
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockApi.get.mockRejectedValueOnce(new Error('Network error'));

    render(<HankeMap />);

    await screen.findByPlaceholderText('Etsi osoitteella');

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load grid metadata:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
