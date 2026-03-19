import type { Mocked, MockedFunction } from 'vitest';
import React from 'react';
import { render, waitFor, screen } from '../../../../testUtils/render';
import SimpleHankeLayer from './SimpleHankeLayer';
import api from '../../../api/api';
import { useMapViewportBounds } from '../../../../common/components/map/hooks/useMapViewportBounds';
import { Vector as VectorSource } from 'ol/source';
import { StyleLike } from 'ol/style/Style';

// Mock dependencies
vi.mock('../../../api/api');
vi.mock('../../../../common/components/map/hooks/useMapViewportBounds');

// Define proper interface for VectorLayer props
interface MockVectorLayerProps {
  source: VectorSource;
  className: string;
  zIndex?: number;
  style?: StyleLike;
}

vi.mock('../../../../common/components/map/layers/VectorLayer', () => {
  return function MockVectorLayer({
    source,
    style,
    className,
    zIndex,
    ...props
  }: MockVectorLayerProps) {
    return (
      <div
        data-testid="vector-layer"
        data-source={source ? 'mocked-source' : 'no-source'}
        data-style={typeof style === 'function' ? 'function' : 'other'}
        data-classname={className}
        data-zindex={zIndex}
        {...props}
      />
    );
  };
});

const mockApi = api as Mocked<typeof api>;
const mockUseMapViewportBounds = useMapViewportBounds as MockedFunction<
  typeof useMapViewportBounds
>;

// Mock grid metadata response
const mockGridMetadata = {
  cellSizeMeters: 1000,
  originX: 25440000,
  originY: 6630000,
  maxX: 25500000,
  maxY: 6690000,
};

// Mock hanke data response
const mockHankeData = [
  {
    hankeTunnus: 'HAI22-1',
    nimi: 'Test Hanke',
    alueet: [
      {
        id: 1,
        nimi: 'Test Area',
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
                      [25445000, 6635000],
                      [25446000, 6635000],
                      [25446000, 6636000],
                      [25445000, 6636000],
                      [25445000, 6635000],
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
  },
];

describe('SimpleHankeLayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock API responses
    mockApi.get.mockImplementation((url) => {
      if (url === '/public-hankkeet/grid/metadata') {
        return Promise.resolve({ data: mockGridMetadata });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    mockApi.post.mockImplementation((url) => {
      if (url === '/public-hankkeet/grid') {
        return Promise.resolve({ data: mockHankeData });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  test('renders vector layer with correct props', () => {
    mockUseMapViewportBounds.mockReturnValue(null);

    render(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    const vectorLayer = screen.getByTestId('vector-layer');
    expect(vectorLayer).toBeInTheDocument();
    expect(vectorLayer).toHaveAttribute('data-classname', 'hankeGeometryLayer');
    expect(vectorLayer).toHaveAttribute('data-zindex', '1');
    expect(vectorLayer).toHaveAttribute('data-style', 'function');
  });

  test('loads grid metadata on mount', async () => {
    mockUseMapViewportBounds.mockReturnValue(null);

    render(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/public-hankkeet/grid/metadata');
    });
  });

  test('loads hanke data when all dependencies are available', async () => {
    const mockBounds = {
      minX: 25445000,
      minY: 6635000,
      maxX: 25446000,
      maxY: 6636000,
    };

    mockUseMapViewportBounds.mockReturnValue(mockBounds);

    render(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    // Wait for metadata to load first
    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/public-hankkeet/grid/metadata');
    });

    // Then wait for hanke data to load
    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/public-hankkeet/grid', {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        cells: expect.arrayContaining([
          expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
        ]),
      });
    });
  });

  test('does not load hanke data when startDate is missing', async () => {
    const mockBounds = {
      minX: 25445000,
      minY: 6635000,
      maxX: 25446000,
      maxY: 6636000,
    };

    mockUseMapViewportBounds.mockReturnValue(mockBounds);

    render(<SimpleHankeLayer startDate={null} endDate="2023-12-31" />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/public-hankkeet/grid/metadata');
    });

    // Should not call the grid API without startDate
    expect(mockApi.post).not.toHaveBeenCalled();
  });

  test('does not load hanke data when endDate is missing', async () => {
    const mockBounds = {
      minX: 25445000,
      minY: 6635000,
      maxX: 25446000,
      maxY: 6636000,
    };

    mockUseMapViewportBounds.mockReturnValue(mockBounds);

    render(<SimpleHankeLayer startDate="2023-01-01" endDate={null} />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/public-hankkeet/grid/metadata');
    });

    // Should not call the grid API without endDate
    expect(mockApi.post).not.toHaveBeenCalled();
  });

  test('does not load hanke data when bounds are missing', async () => {
    mockUseMapViewportBounds.mockReturnValue(null);

    render(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/public-hankkeet/grid/metadata');
    });

    // Should not call the grid API without bounds
    expect(mockApi.post).not.toHaveBeenCalled();
  });

  test('handles metadata loading error gracefully', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockUseMapViewportBounds.mockReturnValue(null);

    render(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load grid metadata:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('handles hanke data loading error gracefully', async () => {
    mockApi.post.mockRejectedValueOnce(new Error('Network error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockBounds = {
      minX: 25445000,
      minY: 6635000,
      maxX: 25446000,
      maxY: 6636000,
    };

    mockUseMapViewportBounds.mockReturnValue(mockBounds);

    render(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load hanke data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('debounces data loading calls', async () => {
    const mockBounds = {
      minX: 25445000,
      minY: 6635000,
      maxX: 25446000,
      maxY: 6636000,
    };

    mockUseMapViewportBounds.mockReturnValue(mockBounds);

    const { rerender } = render(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    // Wait for initial metadata load
    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/public-hankkeet/grid/metadata');
    });

    // Change bounds rapidly
    mockUseMapViewportBounds.mockReturnValue({
      ...mockBounds,
      minX: mockBounds.minX + 100,
    });
    rerender(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    mockUseMapViewportBounds.mockReturnValue({
      ...mockBounds,
      minX: mockBounds.minX + 200,
    });
    rerender(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    // Should only call once after debouncing
    await waitFor(
      () => {
        expect(mockApi.post).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 },
    );
  });

  test('clears source when no grid cells are generated', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Use bounds that are outside the grid
    const mockBounds = {
      minX: 20000000,
      minY: 6000000,
      maxX: 20001000,
      maxY: 6001000,
    };

    mockUseMapViewportBounds.mockReturnValue(mockBounds);

    render(<SimpleHankeLayer startDate="2023-01-01" endDate="2023-12-31" />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('No grid cells generated - clearing map');
    });

    consoleSpy.mockRestore();
  });
});
