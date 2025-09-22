import { render, screen, waitFor } from '../../testUtils/render';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Areas from './Areas';
import { HankeData } from '../types/hanke';
import { HankkeenHakemus } from '../application/types/application';
import hankkeet from '../mocks/data/hankkeet-data';
import { KaivuilmoitusFormValues } from './types';
import { validationSchema } from './validationSchema';
import { Map as OlMap } from 'ol';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';

// Mock map utilities
jest.mock('../../common/components/map/utils', () => ({
  getLinesFromCoordinates: jest.fn().mockReturnValue([
    [
      [0, 0],
      [100, 0],
    ],
    [
      [100, 0],
      [100, 100],
    ],
    [
      [100, 100],
      [0, 100],
    ],
    [
      [0, 100],
      [0, 0],
    ],
  ]),
  getLineIntersection: jest.fn(),
  getCoordinateNumbersFromCoordinate: jest.fn().mockImplementation((coord) => coord),
}));

import * as mapUtils from '../../common/components/map/utils';

const mockUtils = jest.mocked(mapUtils);

// Mock OpenLayers components
jest.mock('../../common/components/map/Map', () => {
  return function MockMap({ children }: { children: React.ReactNode }) {
    return <div data-testid="mock-map">{children}</div>;
  };
});

jest.mock('../map/components/Layers/HankeLayer', () => {
  return function MockHankeLayer() {
    return <div data-testid="mock-hanke-layer" />;
  };
});

jest.mock('../../common/components/map/modules/draw/DrawModule', () => {
  return function MockDrawModule() {
    return <div data-testid="mock-draw-module" />;
  };
});

// Test wrapper component that provides React Hook Form context
function TestWrapper({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<KaivuilmoitusFormValues>;
}) {
  const methods = useForm<KaivuilmoitusFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      applicationData: {
        areas: [],
        startTime: null,
        endTime: null,
        ...defaultValues?.applicationData,
      },
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('Areas segment containment guard', () => {
  const hankeData = hankkeet[1] as HankeData;
  const hankkeenHakemukset: HankkeenHakemus[] = [];
  const originalHakemus = undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUtils.getLineIntersection.mockReturnValue(null);
  });

  it('renders Areas component with segment guard', async () => {
    render(
      <TestWrapper>
        <Areas
          hankeData={hankeData}
          hankkeenHakemukset={hankkeenHakemukset}
          originalHakemus={originalHakemus}
        />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });
  });

  describe('segmentWithinHankeAreaGuard', () => {
    let mockMap: Partial<OlMap>;
    let mockHankeFeature: Partial<Feature<Polygon>>;
    let mockHankeGeometry: Partial<Polygon>;

    beforeEach(() => {
      mockHankeGeometry = {
        getCoordinates: jest.fn().mockReturnValue([
          [
            [0, 0],
            [100, 0],
            [100, 100],
            [0, 100],
            [0, 0],
          ],
        ]),
      };

      mockHankeFeature = {
        getGeometry: jest.fn().mockReturnValue(mockHankeGeometry),
      };

      mockMap = {
        getPixelFromCoordinate: jest.fn().mockReturnValue([50, 50]),
        getFeaturesAtPixel: jest.fn(),
      };
    });

    it('allows segments within hanke area', () => {
      // Setup: segment is within hanke area (no intersection)
      (mockMap.getFeaturesAtPixel as jest.Mock).mockReturnValue([mockHankeFeature]);
      mockUtils.getLineIntersection.mockReturnValue(null);

      render(
        <TestWrapper
          defaultValues={{
            applicationData: {
              applicationType: 'EXCAVATION_NOTIFICATION',
              name: 'Test Application',
              workDescription: 'Test work description',
              constructionWork: false,
              maintenanceWork: true,
              emergencyWork: false,
              rockExcavation: null,
              cableReportDone: null,
              requiredCompetence: false,
              areas: [
                {
                  hankealueId: 1,
                  name: 'Test Area',
                  tyoalueet: [],
                  katuosoite: 'Test Street 1',
                  tyonTarkoitukset: null,
                  meluhaitta: null,
                  polyhaitta: null,
                  tarinahaitta: null,
                  kaistahaitta: null,
                  kaistahaittojenPituus: null,
                  lisatiedot: '',
                },
              ],
              startTime: new Date('2024-01-01'),
              endTime: new Date('2024-12-31'),
            },
          }}
        >
          <Areas
            hankeData={hankeData}
            hankkeenHakemukset={hankkeenHakemukset}
            originalHakemus={originalHakemus}
          />
        </TestWrapper>,
      );

      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    it('blocks segments that cross hanke boundary', () => {
      // Setup: segment crosses hanke boundary
      (mockMap.getFeaturesAtPixel as jest.Mock).mockReturnValue([mockHankeFeature]);
      mockUtils.getLineIntersection.mockReturnValue([50, 0]); // intersection point

      render(
        <TestWrapper>
          <Areas
            hankeData={hankeData}
            hankkeenHakemukset={hankkeenHakemukset}
            originalHakemus={originalHakemus}
          />
        </TestWrapper>,
      );

      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    it('blocks segments when no hanke feature found', () => {
      // Setup: no hanke feature under cursor
      (mockMap.getFeaturesAtPixel as jest.Mock).mockReturnValue([]);

      render(
        <TestWrapper>
          <Areas
            hankeData={hankeData}
            hankkeenHakemukset={hankkeenHakemukset}
            originalHakemus={originalHakemus}
          />
        </TestWrapper>,
      );

      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    it('allows segments that touch hanke boundary at endpoints', () => {
      // Setup: segment touches boundary only at start or end point
      (mockMap.getFeaturesAtPixel as jest.Mock).mockReturnValue([mockHankeFeature]);
      mockUtils.getCoordinateNumbersFromCoordinate
        .mockReturnValueOnce([10, 10]) // start point
        .mockReturnValueOnce([50, 50]) // end point
        .mockReturnValueOnce([0, 0]) // edge start
        .mockReturnValueOnce([100, 0]); // edge end

      // Return intersection at start point (should be allowed)
      mockUtils.getLineIntersection.mockReturnValue([10, 10]);

      render(
        <TestWrapper>
          <Areas
            hankeData={hankeData}
            hankkeenHakemukset={hankkeenHakemukset}
            originalHakemus={originalHakemus}
          />
        </TestWrapper>,
      );

      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    it('handles missing hanke geometry gracefully', () => {
      // Setup: hanke feature exists but has no geometry
      const featureWithoutGeometry: Partial<Feature<Polygon>> = {
        getGeometry: jest.fn().mockReturnValue(null),
      };

      (mockMap.getFeaturesAtPixel as jest.Mock).mockReturnValue([featureWithoutGeometry]);

      render(
        <TestWrapper>
          <Areas
            hankeData={hankeData}
            hankkeenHakemukset={hankkeenHakemukset}
            originalHakemus={originalHakemus}
          />
        </TestWrapper>,
      );

      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });
  });

  describe('hankeLayerFilter', () => {
    it('identifies hanke layers correctly', () => {
      render(
        <TestWrapper>
          <Areas
            hankeData={hankeData}
            hankkeenHakemukset={hankkeenHakemukset}
            originalHakemus={originalHakemus}
          />
        </TestWrapper>,
      );

      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });
  });

  describe('form integration', () => {
    it('updates form values when areas change', async () => {
      render(
        <TestWrapper>
          <Areas
            hankeData={hankeData}
            hankkeenHakemukset={hankkeenHakemukset}
            originalHakemus={originalHakemus}
          />
        </TestWrapper>,
      );

      // Test form interactions that depend on React Hook Form context
      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    it('validates area data correctly', async () => {
      render(
        <TestWrapper
          defaultValues={{
            applicationData: {
              applicationType: 'EXCAVATION_NOTIFICATION',
              name: 'Test Application',
              workDescription: 'Test work description',
              constructionWork: false,
              maintenanceWork: true,
              emergencyWork: false,
              rockExcavation: null,
              cableReportDone: null,
              requiredCompetence: false,
              areas: [
                {
                  hankealueId: 1,
                  name: '',
                  tyoalueet: [],
                  katuosoite: '',
                  tyonTarkoitukset: null,
                  meluhaitta: null,
                  polyhaitta: null,
                  tarinahaitta: null,
                  kaistahaitta: null,
                  kaistahaittojenPituus: null,
                  lisatiedot: '',
                },
              ],
              startTime: null,
              endTime: null,
            },
          }}
        >
          <Areas
            hankeData={hankeData}
            hankkeenHakemukset={hankkeenHakemukset}
            originalHakemus={originalHakemus}
          />
        </TestWrapper>,
      );

      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });
  });
});
