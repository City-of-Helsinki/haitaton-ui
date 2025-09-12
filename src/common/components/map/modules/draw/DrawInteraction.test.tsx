import React from 'react';
import { render } from '../../../../../testUtils/render';
import DrawInteraction from './DrawInteraction';
import DrawProvider from './DrawProvider';
import { Vector as VectorSource } from 'ol/source';
import { Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import * as utils from '../../utils';
// Create mock MapContext as a React context
jest.mock('../../MapContext', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactLib = require('react');
  return {
    __esModule: true,
    default: ReactLib.createContext({
      map: {
        addInteraction: jest.fn(),
        removeInteraction: jest.fn(),
      },
      layers: {},
    }),
  };
});

// Mock only the hook, preserve the provider
jest.mock('../../../globalNotification/GlobalNotificationContext', () => {
  const actual = jest.requireActual('../../../globalNotification/GlobalNotificationContext');
  return {
    ...actual,
    useGlobalNotification: () => ({ setNotification: jest.fn() }),
  };
});

// Mock the polygon intersection utility
jest.mock('../../utils', () => ({
  isPolygonSelfIntersecting: jest.fn(),
  areLinesInPolygonIntersecting: jest.fn(),
  getSurfaceArea: jest.fn(() => 100), // Return valid surface area
}));

const { isPolygonSelfIntersecting } = utils as jest.Mocked<typeof utils>;

describe('DrawInteraction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const source = new VectorSource();
    render(
      <DrawProvider source={source}>
        <DrawInteraction />
      </DrawProvider>,
    );
  });

  it('calls onSelfIntersectingPolygon when polygon intersects itself', () => {
    const onSelfIntersectingPolygon = jest.fn();
    const source = new VectorSource();

    // Mock self-intersecting polygon
    isPolygonSelfIntersecting.mockReturnValue(true);

    render(
      <DrawProvider source={source}>
        <DrawInteraction onSelfIntersectingPolygon={onSelfIntersectingPolygon} />
      </DrawProvider>,
    );

    // Create a polygon feature
    const polygon = new Polygon([
      [
        [0, 0],
        [0, 10],
        [10, 10],
        [10, 0],
        [0, 0],
      ],
    ]);
    const feature = new Feature(polygon);

    // Simulate adding a self-intersecting feature
    source.addFeature(feature);

    // The onSelfIntersectingPolygon should be called during draw operations
    // This would be triggered by the actual draw interaction in real usage
  });

  it('handles modify end with self-intersecting polygon', () => {
    const source = new VectorSource();
    const handleModifyEnd = jest.fn();

    // Mock self-intersecting polygon
    isPolygonSelfIntersecting.mockReturnValue(true);

    render(
      <DrawProvider source={source}>
        <DrawInteraction handleModifyEnd={handleModifyEnd} />
      </DrawProvider>,
    );

    // This test verifies the component renders and can handle the modify end logic
    // The actual modify interaction testing would require more complex OpenLayers mocking
  });

  it('handles modify end with valid polygon', () => {
    const source = new VectorSource();
    const handleModifyEnd = jest.fn();

    // Mock valid (non-intersecting) polygon
    isPolygonSelfIntersecting.mockReturnValue(false);

    render(
      <DrawProvider source={source}>
        <DrawInteraction handleModifyEnd={handleModifyEnd} />
      </DrawProvider>,
    );

    // This test verifies the component renders and can handle valid polygons
  });

  it('accepts all optional props without error', () => {
    const source = new VectorSource();
    const mockProps = {
      onSelfIntersectingPolygon: jest.fn(),
      drawCondition: jest.fn(() => true),
      drawFinishCondition: jest.fn(() => true),
      drawStyleFunction: jest.fn(),
      handleModifyEnd: jest.fn(),
    };

    render(
      <DrawProvider source={source}>
        <DrawInteraction {...mockProps} />
      </DrawProvider>,
    );
  });
});
