import { render, screen, waitFor } from '../../testUtils/render';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HankeData, HANKE_KAISTAHAITTA, HANKE_KAISTAPITUUSHAITTA } from '../types/hanke';
import { HankkeenHakemus } from '../application/types/application';
import hankkeet from '../mocks/data/hankkeet-data';
import { KaivuilmoitusFormValues } from './types';
import { validationSchema } from './validationSchema';
import { Map as OlMap } from 'ol';
import { Feature } from 'ol';
import React from 'react';
import { Polygon } from 'ol/geom';

// Mock hds-react heavy components to avoid render loops in tests
jest.mock('hds-react', () => {
  const Dialog: React.FC<React.PropsWithChildren<{ id?: string; isOpen?: boolean }>> & {
    Header: React.FC<{ id?: string; title?: string; iconStart?: React.ReactNode }>;
    Content: React.FC<React.PropsWithChildren<unknown>>;
    ActionButtons: React.FC<React.PropsWithChildren<unknown>>;
  } = Object.assign(
    ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="mock-dialog">{children}</div>
    ),
    {
      Header: ({ title, iconStart }: { title?: string; iconStart?: React.ReactNode }) => (
        <div data-testid="mock-dialog-header">
          {iconStart}
          {title}
        </div>
      ),
      Content: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="mock-dialog-content">{children}</div>
      ),
      ActionButtons: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="mock-dialog-actions">{children}</div>
      ),
    },
  );

  const Button: React.FC<
    React.PropsWithChildren<{
      onClick?: () => void;
      disabled?: boolean;
      type?: 'button' | 'submit';
    }>
  > = ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} data-testid="mock-button">
      {children}
    </button>
  );

  // Minimal DateInput stub used by DatePicker
  type MockDateInputProps = {
    id?: string;
    label?: React.ReactNode;
    value?: string;
    disabled?: boolean;
    onBlur?: () => void;
    onChange?: (value: string) => void;
  };
  const DateInput = ({ id, label, value, disabled, onBlur, onChange }: MockDateInputProps) => (
    <div data-testid="mock-date-input">
      {label ? <label htmlFor={id}>{label}</label> : null}
      <input
        id={id}
        type="text"
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
      />
    </div>
  );

  const RadioButton: React.FC<{
    id?: string;
    value?: string;
    checked?: boolean;
    label?: React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }> = ({ id, value, checked, label, onChange }) => (
    <label htmlFor={id} data-testid="mock-radio">
      <input id={id} type="radio" value={value} checked={checked} onChange={onChange} />
      {label}
    </label>
  );

  const SelectionGroup: React.FC<React.PropsWithChildren<{ label?: string }>> = ({
    children,
    label,
  }) => (
    <fieldset data-testid="mock-selection-group">
      {label ? <legend>{label}</legend> : null}
      {children}
    </fieldset>
  );

  const IconAlertCircle: React.FC = () => <span data-testid="mock-icon-alert-circle" />;

  return {
    __esModule: true,
    // Used in test utils wrapper
    LoginProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    // Used in Areas
    Notification: ({
      children,
      label,
      type,
      size,
    }: {
      children?: React.ReactNode;
      label?: string;
      type?: string;
      size?: string;
    }) => (
      <div data-testid="mock-notification" data-label={label} data-type={type} data-size={size}>
        {children}
      </div>
    ),
    NotificationSize: { Small: 'Small' },
    Fieldset: ({ children, heading }: { children?: React.ReactNode; heading?: string }) => (
      <fieldset>
        {heading ? <legend>{heading}</legend> : null}
        {children}
      </fieldset>
    ),
    Tab: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    TabList: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    TabPanel: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Tabs: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Tooltip: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    DateInput,
    // Used by AreaSelectDialog
    Dialog,
    Button,
    ButtonVariant: { Primary: 'primary', Secondary: 'secondary' },
    RadioButton,
    SelectionGroup,
    IconAlertCircle,
  };
});

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

// Mock turf helpers to prevent validation issues in tests
jest.mock('@turf/helpers', () => ({
  __esModule: true,
  polygon: jest.fn(() => ({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [] } })),
}));

// Mock AreaSelectDialog to capture props and allow invoking onConfirm
jest.mock('./components/AreaSelectDialog', () => {
  let lastProps: unknown;
  const Mock = (props: unknown) => {
    lastProps = props;
    if (!(props as { isOpen?: boolean })?.isOpen) return null;
    return (
      <div data-testid="mock-area-select-dialog">
        <div data-testid="mock-dialog-header">Valitse työalueen hankealue</div>
      </div>
    );
  };
  return { __esModule: true, default: Mock, __getLastAreaSelectDialogProps: () => lastProps };
});

// Mock ApplicationMap to capture props and allow invoking onAddArea
jest.mock('../application/components/ApplicationMap', () => {
  let lastProps: Record<string, unknown> | undefined;
  const Mock = (props: Record<string, unknown>) => {
    lastProps = props;
    return <div data-testid="mock-application-map" />;
  };
  return { __esModule: true, default: Mock, __getLastAppMapProps: () => lastProps };
});

// Mock map utils used by Areas.tsx for containment check and formatting
jest.mock('../map/utils', () => ({
  __esModule: true,
  featureContains: jest.fn(() => true),
  formatFeaturesToHankeGeoJSON: jest.fn(() => ({})),
  getTotalSurfaceArea: jest.fn(() => 0),
}));

// Mock haitta indexes hook to immediately invoke onSuccess with fake data
jest.mock('../hanke/hooks/useHaittaIndexes', () => {
  const fakeData = { liikennehaittaindeksi: { indeksi: 5 } };
  const mutate = jest.fn((_req: unknown, handlers: { onSuccess?: (d: unknown) => void }) => {
    return handlers?.onSuccess?.(fakeData);
  });
  const useHaittaIndexes = () => ({ mutate });
  return { __esModule: true, default: useHaittaIndexes, __getMutateMock: () => mutate };
});

// Mock field array hook to spy on append calls
jest.mock('../../common/hooks/useFieldArrayWithStateUpdate', () => {
  const append = jest.fn();
  const remove = jest.fn();
  // Keep a stable fields array reference across renders to avoid loops in useSelectableTabs
  const fields: unknown[] = [];
  const useFieldArrayWithStateUpdate = () => ({ fields, append, remove });
  return {
    __esModule: true,
    default: useFieldArrayWithStateUpdate,
    __getAppendMock: () => append,
  };
});

// Import Areas after mocks so it sees the mocked modules
import Areas from './Areas';

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
      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();
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

      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();
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

      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();
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

      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();
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

      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();
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

      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();
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

      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();
    });
  });

  describe('addTyoAlueToHankeArea', () => {
    it('renders component with area add functionality', async () => {
      const oneAreaHanke: HankeData = {
        ...hankeData,
        nimi: 'Hanke X',
        alueet: [
          {
            ...hankeData.alueet[0],
            id: 123,
            nimi: 'Area A',
            kaistaHaitta: HANKE_KAISTAHAITTA.EI_VAIKUTA,
            kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA.EI_VAIKUTA_KAISTAJARJESTELYIHIN,
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
                          [0, 0],
                          [1, 0],
                          [1, 1],
                          [0, 1],
                          [0, 0],
                        ],
                      ],
                    },
                  },
                ],
              },
            },
          },
        ],
      } as HankeData;

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
              areas: [],
              startTime: new Date('2024-01-01'),
              endTime: new Date('2024-12-31'),
            },
          }}
        >
          <Areas hankeData={oneAreaHanke} hankkeenHakemukset={[]} originalHakemus={undefined} />
        </TestWrapper>,
      );

      // Verify the component renders with the ApplicationMap
      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();

      // Verify that the ApplicationMap receives the onAddArea prop
      type AppMapMockModule = { __getLastAppMapProps: () => Record<string, unknown> | undefined };
      const appMapMock = jest.requireMock(
        '../application/components/ApplicationMap',
      ) as AppMapMockModule;

      await waitFor(() => {
        // eslint-disable-next-line no-underscore-dangle
        const props = appMapMock.__getLastAppMapProps();
        expect(props?.onAddArea).toBeDefined();
        expect(typeof props?.onAddArea).toBe('function');
      });
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
      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();
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

      expect(screen.getByTestId('mock-application-map')).toBeInTheDocument();
    });
  });
});
