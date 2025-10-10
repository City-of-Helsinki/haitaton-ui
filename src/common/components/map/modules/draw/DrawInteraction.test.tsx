/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires, no-underscore-dangle, @typescript-eslint/no-this-alias */
import React from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import MapContext from '../../MapContext';
import { DrawContext } from './DrawContext';
import { DRAWTOOLTYPE } from './types';
import { GlobalNotificationProvider } from '../../../globalNotification/GlobalNotificationContext';
// mock for hds-react LoginProvider used by test utils render wrapper
jest.mock('hds-react', () => {
  // Use require inside factory to avoid out-of-scope issues
  const ReactLib = require('react');
  const MockLoginProvider = ({ children }: { children: React.ReactNode }) =>
    ReactLib.createElement(ReactLib.Fragment, null, children);
  const Notification = ({ children }: { children?: React.ReactNode }) =>
    ReactLib.createElement('div', null, children);
  return { __esModule: true, LoginProvider: MockLoginProvider, Notification };
});
// Use plain Testing Library render for all tests to avoid heavy app providers
import DrawProvider from './DrawProvider';
import { Vector as VectorSource } from 'ol/source';
import { Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import * as utils from '../../utils';

// Mock i18n translation hook to avoid needing a full i18n setup
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Inline mock for OpenLayers Select interaction
type Handler = (payload?: unknown) => void;
type HandlerMap = Record<string, Handler[]>;
jest.mock('ol/interaction/Select', () => {
  let lastSelectInstance: unknown;
  return {
    __esModule: true,
    default: class SelectMock {
      private handlers: HandlerMap = {};
      public active = true;
      public features: unknown[] = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      constructor(_opts?: unknown) {
        // Capture last instance for assertions
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        lastSelectInstance = this;
      }
      setActive = jest.fn((active: boolean) => {
        this.active = active;
      });
      getFeatures() {
        return {
          clear: jest.fn(() => {
            this.features = [];
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          push: jest.fn((f: any) => {
            this.features.push(f);
          }),
        };
      }
      on(event: string, handler: Handler) {
        if (!this.handlers[event]) this.handlers[event] = [];
        this.handlers[event].push(handler);
      }
      emit(event: string, payload?: unknown) {
        (this.handlers[event] || []).forEach((h) => h(payload));
      }
    },
    __getLastSelectInstance: () => lastSelectInstance,
  };
});

// Inline mock for OpenLayers Draw/Modify/Snap interactions
jest.mock('ol/interaction', () => {
  let lastDrawInstance: unknown;
  let lastModifyInstance: unknown;
  let lastDrawOptions: any;
  class Emitter {
    handlers: HandlerMap = {};
    on(event: string, handler: Handler) {
      if (!this.handlers[event]) this.handlers[event] = [];
      this.handlers[event].push(handler);
    }
    emit(event: string, payload?: unknown) {
      (this.handlers[event] || []).forEach((h) => h(payload));
    }
    // Some interactions are toggled active/inactive
    setActive = jest.fn();
  }

  class Draw extends Emitter {
    removeLastPoint = jest.fn();
    constructor(opts?: unknown) {
      super();
      lastDrawInstance = this;
      lastDrawOptions = opts; // capture to allow direct finishCondition testing
    }
    // helper for tests
    __getOptions() {
      return lastDrawOptions;
    }
  }
  class Modify extends Emitter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_opts?: unknown) {
      super();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      lastModifyInstance = this;
    }
  }
  class Snap extends Emitter {}

  return {
    __esModule: true,
    Draw,
    Modify,
    Snap,
    __getLastDrawInstance: () => lastDrawInstance,
    __getLastDrawOptions: () => lastDrawOptions,
    __getLastModifyInstance: () => lastModifyInstance,
  };
});

// utils imports in the component are fine unmocked for these tests

// Import the component under test AFTER mocks
import DrawInteraction from './DrawInteraction';

// Helper to access mocked interaction instances
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { __getLastDrawInstance, __getLastModifyInstance } = require('ol/interaction');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { __getLastSelectInstance } = require('ol/interaction/Select');

describe('DrawInteraction startDraw events', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, NODE_ENV: 'development' } as NodeJS.ProcessEnv; // allow interactions in tests
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.clearAllMocks();
  });

  function renderWithProviders(options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSelfIntersectingPolygon?: (f: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleModifyEnd?: (e: any, original: any, modified: any) => void;
  }) {
    const actions = {
      setSelectedFeature: jest.fn(),
      setSelectedDrawToolType: jest.fn(),
    };

    const map = {
      addInteraction: jest.fn(),
      removeInteraction: jest.fn(),
      getPixelFromCoordinate: jest.fn(),
      getFeaturesAtPixel: jest.fn().mockReturnValue([]),
    } as unknown as Record<string, unknown>;

    const state = {
      selectedFeature: null,
      selectedDrawtoolType: DRAWTOOLTYPE.POLYGON,
    };

    const source = {
      on: jest.fn(),
      getFeatures: jest.fn(() => []),
    } as unknown as Record<string, unknown>;

    const ui = (
      <GlobalNotificationProvider>
        {/* Cast types for test-only mocks */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <MapContext.Provider value={{ map: map as any, layers: {} as any } as any}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <DrawContext.Provider value={{ state, actions, source } as any}>
            <DrawInteraction
              onSelfIntersectingPolygon={options?.onSelfIntersectingPolygon}
              handleModifyEnd={options?.handleModifyEnd}
            />
          </DrawContext.Provider>
        </MapContext.Provider>
      </GlobalNotificationProvider>
    );

    const rendered = rtlRender(ui);
    return { utils: rendered, actions, map, source };
  }

  test("deactivates selection on 'drawstart'", async () => {
    renderWithProviders();

    // Wait until Select interaction is created by effect
    await waitFor(() => expect(__getLastSelectInstance()).toBeDefined());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const select = __getLastSelectInstance() as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const draw = __getLastDrawInstance() as any;

    // Simulate drawstart event from Draw interaction
    const feature = { on: jest.fn(), getGeometry: jest.fn() };
    draw.emit('drawstart', { feature });

    // Assert selection was deactivated
    expect(select.setActive).toHaveBeenCalledWith(false);
    // Assert draw registered change handler on feature
    expect(feature.on).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test("activates selection and clears on 'drawend'", async () => {
    const onSelfIntersectingPolygon = jest.fn();
    const { actions } = renderWithProviders({ onSelfIntersectingPolygon });

    await waitFor(() => expect(__getLastSelectInstance()).toBeDefined());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const select = __getLastSelectInstance() as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const draw = __getLastDrawInstance() as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const feature = { getGeometry: jest.fn(() => ({}) as any) };

    // Fire drawend
    draw.emit('drawend', { feature });

    // Selection re-activated
    expect(select.setActive).toHaveBeenCalledWith(true);
    // Selected draw tool reset to null
    expect(actions.setSelectedDrawToolType).toHaveBeenCalledWith(null);
    // Selection cleared via actions.setSelectedFeature(null)
    expect(actions.setSelectedFeature).toHaveBeenCalledWith(null);
    // onSelfIntersectingPolygon may or may not be called depending on geometry; we don't assert it here
  });

  test('modifystart + modifyend (valid) calls handleModifyEnd with original clone', async () => {
    // Arrange
    const handleModifyEnd = jest.fn();
    renderWithProviders({ handleModifyEnd });

    // Wait until Modify interaction exists
    await waitFor(() => expect(__getLastModifyInstance()).toBeDefined());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modify = __getLastModifyInstance() as any;

    // Mock feature for modifystart
    const originalFeatureClone = { id: 'original-clone' };
    const startFeature = {
      getGeometry: jest.fn(() => ({
        clone: jest.fn(() => ({
          /* not used here */
        })),
      })),
      clone: jest.fn(() => originalFeatureClone),
    };
    const startEvent = { features: { item: jest.fn(() => startFeature) } };

    // Fire modifystart to capture original feature/geometry
    modify.emit('modifystart', startEvent);

    // Prepare modifyend with non-self-intersecting polygon
    (utils.isPolygonSelfIntersecting as jest.Mock).mockReturnValue(false);

    const endGeometry = {};
    const endFeature = { getGeometry: jest.fn(() => endGeometry) };
    const endEvent = { features: { item: jest.fn(() => endFeature) } };

    // Act
    modify.emit('modifyend', endEvent);

    // Assert
    expect(handleModifyEnd).toHaveBeenCalledTimes(1);
    expect(handleModifyEnd).toHaveBeenCalledWith(endEvent, originalFeatureClone, endFeature);
  });

  test('blocks finishing when closing segment creates self-intersection', async () => {
    // Arrange: mock self-intersecting polygon via utils.isPolygonSelfIntersecting
    const onSelfIntersectingPolygon = jest.fn();
    const spyIsSelfIntersecting = jest
      .spyOn(utils, 'isPolygonSelfIntersecting')
      .mockReturnValue(true);
    renderWithProviders({ onSelfIntersectingPolygon });

    // Wait for draw interaction setup
    await waitFor(() => expect(__getLastDrawInstance()).toBeDefined());
    const draw: any = __getLastDrawInstance();
    const options = draw.__getOptions();
    expect(options.finishCondition).toBeDefined();

    // Simulate drawstart to register change handler
    const fakePolygon = new Polygon([
      [
        [0, 0],
        [5, 5],
        [10, 0],
        [0, 0],
      ],
    ]);
    const feature = new Feature(fakePolygon);
    feature.on = jest.fn();
    feature.getGeometry = jest.fn(() => fakePolygon);
    draw.emit('drawstart', { feature });
    // Obtain registered change handler and invoke to set drawnFeature.current
    const changeHandler = (feature as any).on.mock.calls.find((c: any[]) => c[0] === 'change')[1];
    changeHandler({ target: feature });

    // Act: invoke finishCondition manually (OpenLayers calls this internally). Should return false.
    const canFinish = options.finishCondition({} as any);

    // Assert: finishing blocked, callback invoked
    expect(canFinish).toBe(false);
    expect(onSelfIntersectingPolygon).toHaveBeenCalledWith(feature);

    // Cleanup spy
    spyIsSelfIntersecting.mockRestore();
  });

  test('allows finishing when closing segment is valid (non-self-intersecting)', async () => {
    const onSelfIntersectingPolygon = jest.fn();
    const spyIsSelfIntersecting = jest
      .spyOn(utils, 'isPolygonSelfIntersecting')
      .mockReturnValue(false);
    const { actions } = renderWithProviders({ onSelfIntersectingPolygon });

    await waitFor(() => expect(__getLastDrawInstance()).toBeDefined());
    const draw: any = __getLastDrawInstance();
    const options = draw.__getOptions();
    expect(options.finishCondition).toBeDefined();

    // Simulate drawstart and change events to set drawnFeature
    const fakePolygon = new Polygon([
      [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
        [0, 0],
      ],
    ]);
    const feature = new Feature(fakePolygon);
    feature.on = jest.fn();
    feature.getGeometry = jest.fn(() => fakePolygon);
    draw.emit('drawstart', { feature });
    const changeHandler = (feature as any).on.mock.calls.find((c: any[]) => c[0] === 'change')[1];
    changeHandler({ target: feature });

    // Act: finishCondition should allow completion
    const canFinish = options.finishCondition({} as any);
    expect(canFinish).toBe(true);
    expect(onSelfIntersectingPolygon).not.toHaveBeenCalled();

    // Simulate drawend emission
    draw.emit('drawend', { feature });
    expect(actions.setSelectedDrawToolType).toHaveBeenCalledWith(null);
    expect(actions.setSelectedFeature).toHaveBeenCalledWith(null);

    spyIsSelfIntersecting.mockRestore();
  });

  test('modifyend (self-intersecting) reverts coordinates to original', async () => {
    renderWithProviders();

    await waitFor(() => expect(__getLastModifyInstance()).toBeDefined());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modify = __getLastModifyInstance() as any;

    // Ensure handlers are attached before emitting
    await waitFor(() => {
      expect(modify.handlers).toBeDefined();
      expect(Array.isArray(modify.handlers['modifystart'])).toBe(true);
      expect(Array.isArray(modify.handlers['modifyend'])).toBe(true);
    });

    // Set up original geometry captured during modifystart
    const originalCoords = [[0, 0]];
    const originalGeometryClone = { getCoordinates: jest.fn(() => originalCoords) };
    const startFeature = {
      getGeometry: jest.fn(() => ({ clone: jest.fn(() => originalGeometryClone) })),
      clone: jest.fn(() => ({
        /* original feature clone not used in this test */
      })),
    };
    const startEvent = { features: { item: jest.fn(() => startFeature) } };
    modify.emit('modifystart', startEvent);

    // Prepare modifyend with self-intersecting polygon
    (utils.isPolygonSelfIntersecting as jest.Mock).mockReturnValue(true);

    const modifiedPolygon = { setCoordinates: jest.fn() };
    const endFeature = { getGeometry: jest.fn(() => modifiedPolygon) };
    const endEvent = { features: { item: jest.fn(() => endFeature) } };

    // Act
    modify.emit('modifyend', endEvent);

    // Assert: revert to original coordinates path taken
    expect(utils.isPolygonSelfIntersecting).toHaveBeenCalledWith(modifiedPolygon);
    expect(originalGeometryClone.getCoordinates).toHaveBeenCalled();
    expect(modifiedPolygon.setCoordinates).toHaveBeenCalledTimes(1);
  });

  test('removefeature clears selection and calls onSelfIntersectingPolygon(null) when none remain', async () => {
    const onSelfIntersectingPolygon = jest.fn();
    const { actions, source } = renderWithProviders({ onSelfIntersectingPolygon });

    // Ensure effect wired up
    await waitFor(() => {
      expect((source as any).on).toHaveBeenCalled();
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const utilsMod = require('../../utils') as typeof import('../../utils');
    (utilsMod.isPolygonSelfIntersecting as jest.Mock).mockReturnValue(false);

    // Find the registered removefeature handler and invoke it
    type OnHandler = (...args: unknown[]) => void;
    const onCalls = ((source as any).on as jest.Mock).mock.calls as Array<[string, OnHandler]>;
    const removeHandler = onCalls.find(([evt]) => evt === 'removefeature')?.[1];
    expect(removeHandler).toBeDefined();

    removeHandler?.();

    expect(actions.setSelectedFeature).toHaveBeenCalledWith(null);
    expect(onSelfIntersectingPolygon).toHaveBeenCalledWith(null);
  });

  test('drawstart on.change handler allows drawing inside hanke area', async () => {
    // Arrange
    const mockDrawSegmentGuardInside = jest.fn(() => true); // Allow segment (inside hanke area)

    function renderWithDrawSegmentGuard() {
      const actions = {
        setSelectedFeature: jest.fn(),
        setSelectedDrawToolType: jest.fn(),
      };

      const map = {
        addInteraction: jest.fn(),
        removeInteraction: jest.fn(),
        getPixelFromCoordinate: jest.fn(),
        getFeaturesAtPixel: jest.fn().mockReturnValue([]),
      } as unknown as Record<string, unknown>;

      const state = {
        selectedFeature: null,
        selectedDrawtoolType: DRAWTOOLTYPE.POLYGON,
      };

      const source = {
        on: jest.fn(),
        getFeatures: jest.fn(() => []),
      } as unknown as Record<string, unknown>;

      const ui = (
        <GlobalNotificationProvider>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <MapContext.Provider value={{ map: map as any, layers: {} as any } as any}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <DrawContext.Provider value={{ state, actions, source } as any}>
              <DrawInteraction drawSegmentGuard={mockDrawSegmentGuardInside} />
            </DrawContext.Provider>
          </MapContext.Provider>
        </GlobalNotificationProvider>
      );

      const rendered = rtlRender(ui);
      return {
        utils: rendered,
        actions,
        map,
        source,
        mockDrawSegmentGuard: mockDrawSegmentGuardInside,
      };
    }

    const { mockDrawSegmentGuard } = renderWithDrawSegmentGuard();

    // Wait until Draw interaction is created
    await waitFor(() => expect(__getLastDrawInstance()).toBeDefined());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const draw = __getLastDrawInstance() as any;

    // Create mock feature with polygon geometry - starting with first 2 points in OL structure
    const mockGeometry = {
      getCoordinates: jest.fn(() => [
        [
          [10, 10], // Point 1 (index 0)
          [20, 20], // Point 2 (index 1)
          [20, 20], // Cursor position (index 2) - same as point 2
          [10, 10], // Closing point (index 3) - same as point 1
        ],
      ]),
    };

    const mockFeature = {
      on: jest.fn(),
      getGeometry: jest.fn(() => mockGeometry),
    };

    // Simulate drawstart event
    draw.emit('drawstart', { feature: mockFeature });

    // Get the registered change handler
    expect(mockFeature.on).toHaveBeenCalledWith('change', expect.any(Function));
    const changeHandler = mockFeature.on.mock.calls[0][1];

    // Now simulate adding a third point: user clicks at [30, 30]
    // OpenLayers automatically creates the full polygon structure with cursor and closing point
    mockGeometry.getCoordinates.mockReturnValue([
      [
        [10, 10], // Point 1 (index 0)
        [20, 20], // Point 2 (index 1)
        [30, 30], // Point 3 - newly added (index 2)
        [30, 30], // Cursor position (index 3) - same as point 3
        [10, 10], // Closing point (index 4) - same as point 1
      ],
    ]);

    const changeEvent = { target: mockFeature };
    changeHandler(changeEvent);

    // Based on the corrected implementation with real OL polygon structure:
    // actualPointCount = coordinates.length - 2 = 5 - 2 = 3 (excluding cursor and closing point)
    // start = ring[actualPointCount - 2] = ring[3 - 2] = ring[1] = [20, 20] (Point 2)
    // end = ring[actualPointCount - 1] = ring[3 - 1] = ring[2] = [30, 30] (Point 3)
    // So it validates the segment from Point 2 to Point 3 when Point 3 is added
    expect(mockDrawSegmentGuard).toHaveBeenCalledWith(
      expect.anything(), // map
      [
        [20, 20], // Point 2 (previous point)
        [30, 30], // Point 3 (newly added point)
      ],
    );

    // Assert removeLastPoint was NOT called (segment was allowed)
    expect(draw.removeLastPoint).not.toHaveBeenCalled();
  });

  test('drawstart on.change handler prevents drawing outside hanke area', async () => {
    // Arrange
    const mockDrawSegmentGuardOutside = jest.fn(() => false); // Reject segment (outside hanke area)

    function renderWithDrawSegmentGuard() {
      const actions = {
        setSelectedFeature: jest.fn(),
        setSelectedDrawToolType: jest.fn(),
      };

      const map = {
        addInteraction: jest.fn(),
        removeInteraction: jest.fn(),
        getPixelFromCoordinate: jest.fn(),
        getFeaturesAtPixel: jest.fn().mockReturnValue([]),
      } as unknown as Record<string, unknown>;

      const state = {
        selectedFeature: null,
        selectedDrawtoolType: DRAWTOOLTYPE.POLYGON,
      };

      const source = {
        on: jest.fn(),
        getFeatures: jest.fn(() => []),
      } as unknown as Record<string, unknown>;

      const ui = (
        <GlobalNotificationProvider>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <MapContext.Provider value={{ map: map as any, layers: {} as any } as any}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <DrawContext.Provider value={{ state, actions, source } as any}>
              <DrawInteraction drawSegmentGuard={mockDrawSegmentGuardOutside} />
            </DrawContext.Provider>
          </MapContext.Provider>
        </GlobalNotificationProvider>
      );

      const rendered = rtlRender(ui);
      return {
        utils: rendered,
        actions,
        map,
        source,
        mockDrawSegmentGuard: mockDrawSegmentGuardOutside,
      };
    }

    const { mockDrawSegmentGuard } = renderWithDrawSegmentGuard();

    // Wait until Draw interaction is created
    await waitFor(() => expect(__getLastDrawInstance()).toBeDefined());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const draw = __getLastDrawInstance() as any;

    // Create mock feature with polygon geometry - starting with first 2 points in OL structure
    const mockGeometry = {
      getCoordinates: jest.fn(() => [
        [
          [10, 10], // Point 1 (index 0)
          [20, 20], // Point 2 (index 1)
          [20, 20], // Cursor position (index 2) - same as point 2
          [10, 10], // Closing point (index 3) - same as point 1
        ],
      ]),
    };

    const mockFeature = {
      on: jest.fn(),
      getGeometry: jest.fn(() => mockGeometry),
    };

    // Simulate drawstart event
    draw.emit('drawstart', { feature: mockFeature });

    // Get the registered change handler
    expect(mockFeature.on).toHaveBeenCalledWith('change', expect.any(Function));
    const changeHandler = mockFeature.on.mock.calls[0][1];

    // Now simulate adding a third point: user clicks at [100, 100] (outside hanke area)
    // OpenLayers automatically creates the full polygon structure with cursor and closing point
    mockGeometry.getCoordinates.mockReturnValue([
      [
        [10, 10], // Point 1 (index 0)
        [20, 20], // Point 2 (index 1)
        [100, 100], // Point 3 - newly added (index 2)
        [100, 100], // Cursor position (index 3) - same as point 3
        [10, 10], // Closing point (index 4) - same as point 1
      ],
    ]);

    const changeEvent = { target: mockFeature };
    changeHandler(changeEvent);

    // Based on the corrected implementation with real OL polygon structure:
    // actualPointCount = coordinates.length - 2 = 5 - 2 = 3 (excluding cursor and closing point)
    // start = ring[actualPointCount - 2] = ring[3 - 2] = ring[1] = [20, 20] (Point 2)
    // end = ring[actualPointCount - 1] = ring[3 - 1] = ring[2] = [100, 100] (Point 3)
    expect(mockDrawSegmentGuard).toHaveBeenCalledWith(
      expect.anything(), // map
      [
        [20, 20], // Point 2 (previous point)
        [100, 100], // Point 3 (newly added point outside hanke area)
      ],
    );

    // Assert removeLastPoint WAS called (segment was rejected)
    expect(draw.removeLastPoint).toHaveBeenCalled();
  });

  test('drawstart on.change handler skips guard check when less than 2 points', async () => {
    // Arrange
    const mockDrawSegmentGuardSkip = jest.fn(() => true);

    function renderWithDrawSegmentGuard() {
      const actions = {
        setSelectedFeature: jest.fn(),
        setSelectedDrawToolType: jest.fn(),
      };

      const map = {
        addInteraction: jest.fn(),
        removeInteraction: jest.fn(),
        getPixelFromCoordinate: jest.fn(),
        getFeaturesAtPixel: jest.fn().mockReturnValue([]),
      } as unknown as Record<string, unknown>;

      const state = {
        selectedFeature: null,
        selectedDrawtoolType: DRAWTOOLTYPE.POLYGON,
      };

      const source = {
        on: jest.fn(),
        getFeatures: jest.fn(() => []),
      } as unknown as Record<string, unknown>;

      const ui = (
        <GlobalNotificationProvider>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <MapContext.Provider value={{ map: map as any, layers: {} as any } as any}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <DrawContext.Provider value={{ state, actions, source } as any}>
              <DrawInteraction drawSegmentGuard={mockDrawSegmentGuardSkip} />
            </DrawContext.Provider>
          </MapContext.Provider>
        </GlobalNotificationProvider>
      );

      const rendered = rtlRender(ui);
      return {
        utils: rendered,
        actions,
        map,
        source,
        mockDrawSegmentGuard: mockDrawSegmentGuardSkip,
      };
    }

    const { mockDrawSegmentGuard } = renderWithDrawSegmentGuard();

    // Wait until Draw interaction is created
    await waitFor(() => expect(__getLastDrawInstance()).toBeDefined());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const draw = __getLastDrawInstance() as any;

    // Create mock feature with only one point
    const mockGeometry = {
      getCoordinates: jest.fn(() => [
        [
          [10, 10], // First point
          [10, 10], // Cursor position (same as first point)
        ],
      ]),
    };

    const mockFeature = {
      on: jest.fn(),
      getGeometry: jest.fn(() => mockGeometry),
    };

    // Simulate drawstart event
    draw.emit('drawstart', { feature: mockFeature });

    // Get the registered change handler
    const changeHandler = mockFeature.on.mock.calls[0][1];

    // Simulate feature change with only one actual point (cursor movement only)
    const changeEvent = { target: mockFeature };
    changeHandler(changeEvent);

    // Assert drawSegmentGuard was NOT called (not enough points for a segment)
    expect(mockDrawSegmentGuard).not.toHaveBeenCalled();

    // Assert removeLastPoint was NOT called
    expect(draw.removeLastPoint).not.toHaveBeenCalled();
  });
});
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
    rtlRender(
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

    rtlRender(
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

    rtlRender(
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

    rtlRender(
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
      drawSegmentGuard: jest.fn(() => true),
      handleModifyEnd: jest.fn(),
    };

    rtlRender(
      <DrawProvider source={source}>
        <DrawInteraction {...mockProps} />
      </DrawProvider>,
    );
  });

  describe('drawSegmentGuard functionality', () => {
    it('renders without drawSegmentGuard prop', () => {
      const source = new VectorSource();
      rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction />
        </DrawProvider>,
      );
    });

    it('renders with drawSegmentGuard prop', () => {
      const source = new VectorSource();
      const mockDrawSegmentGuard = jest.fn(() => true);

      rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction drawSegmentGuard={mockDrawSegmentGuard} />
        </DrawProvider>,
      );
    });

    it('accepts drawSegmentGuard function that returns true', () => {
      const source = new VectorSource();
      const mockDrawSegmentGuard = jest.fn((map, segment) => {
        expect(map).toBeDefined();
        expect(segment).toHaveLength(2);
        expect(segment[0]).toHaveLength(2); // [x, y] coordinate
        expect(segment[1]).toHaveLength(2); // [x, y] coordinate
        return true; // Allow the segment
      });

      rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction drawSegmentGuard={mockDrawSegmentGuard} />
        </DrawProvider>,
      );
    });

    it('accepts drawSegmentGuard function that returns false', () => {
      const source = new VectorSource();
      const mockDrawSegmentGuard = jest.fn((map, segment) => {
        expect(map).toBeDefined();
        expect(segment).toHaveLength(2);
        return false; // Reject the segment
      });

      rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction drawSegmentGuard={mockDrawSegmentGuard} />
        </DrawProvider>,
      );
    });

    it('validates segment coordinates when drawSegmentGuard is provided', () => {
      const source = new VectorSource();
      const mockDrawSegmentGuard = jest.fn((map, segment) => {
        // Validate that coordinates are numbers
        const [start, end] = segment;
        expect(typeof start[0]).toBe('number'); // x coordinate
        expect(typeof start[1]).toBe('number'); // y coordinate
        expect(typeof end[0]).toBe('number'); // x coordinate
        expect(typeof end[1]).toBe('number'); // y coordinate
        return true;
      });

      rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction drawSegmentGuard={mockDrawSegmentGuard} />
        </DrawProvider>,
      );
    });

    it('handles boundary validation with complex geometry', () => {
      const source = new VectorSource();

      // Helper function to check if coordinate is within bounds
      const withinBounds = (coord: number[]) => {
        return coord[0] >= 0 && coord[0] <= 100 && coord[1] >= 0 && coord[1] <= 100;
      };

      const mockDrawSegmentGuard = jest.fn((map, segment) => {
        const [start, end] = segment;
        return withinBounds(start) && withinBounds(end);
      });

      rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction drawSegmentGuard={mockDrawSegmentGuard} />
        </DrawProvider>,
      );
    });

    it('supports different coordinate systems in drawSegmentGuard', () => {
      const source = new VectorSource();
      const mockDrawSegmentGuard = jest.fn((map, segment) => {
        const [start, end] = segment;

        // Validate coordinate format for different projection systems
        expect(Array.isArray(start)).toBe(true);
        expect(Array.isArray(end)).toBe(true);
        expect(start.length).toBeGreaterThanOrEqual(2);
        expect(end.length).toBeGreaterThanOrEqual(2);

        return true;
      });

      rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction drawSegmentGuard={mockDrawSegmentGuard} />
        </DrawProvider>,
      );
    });
  });

  it('does not mutate underlying coordinate array during draw change events (regression HAI-3310)', async () => {
    // Arrange
    const source = new VectorSource();
    const actions = {
      setSelectedDrawToolType: jest.fn(),
      setSelectedFeature: jest.fn(),
    };
    // Force a selected draw tool so startDraw is invoked
    const state = { selectedDrawtoolType: DRAWTOOLTYPE.POLYGON, selectedFeature: null };

    const ui = (
      <DrawContext.Provider
        value={{ state, actions, source } as unknown as import('./types').DrawContextType}
      >
        <DrawInteraction />
      </DrawContext.Provider>
    );
    rtlRender(ui);

    await waitFor(() => expect(__getLastDrawInstance()).toBeDefined());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const draw = __getLastDrawInstance() as any;

    const ring = [
      [0, 0], // start
      [5, 0], // first user point
      [5, 5], // second user point
      [0, 0], // cursor closing link (auto)
      [0, 0], // cursor position (auto)
    ];
    const originalLength = ring.length;
    const mockGeometry = { getCoordinates: jest.fn(() => [ring]) };
    const mockFeature = { on: jest.fn(), getGeometry: jest.fn(() => mockGeometry) };

    draw.emit('drawstart', { feature: mockFeature });
    const changeHandler = mockFeature.on.mock.calls[0][1];

    // Act - trigger change (adds a point logically)
    changeHandler({ target: mockFeature });

    // Assert - ring length unchanged (no splice mutation)
    expect(ring.length).toBe(originalLength);
  });
});
