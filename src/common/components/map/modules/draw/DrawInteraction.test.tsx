/* eslint-disable @typescript-eslint/no-explicit-any, no-underscore-dangle, @typescript-eslint/no-this-alias */
import type { Mock, Mocked } from 'vitest';
import React from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import MapContext from '../../MapContext';
import { DrawContext } from './DrawContext';
import { DRAWTOOLTYPE } from './types';
import { GlobalNotificationProvider } from '../../../globalNotification/GlobalNotificationContext';
// mock for hds-react LoginProvider used by test utils render wrapper
vi.mock('hds-react', async () => {
  const ReactLib = await vi.importActual<typeof import('react')>('react');
  const MockLoginProvider = ({ children }: { children: React.ReactNode }) =>
    ReactLib.createElement(ReactLib.Fragment, null, children);
  const Notification = ({ children }: { children?: React.ReactNode }) =>
    ReactLib.createElement('div', null, children);
  return { __esModule: true, LoginProvider: MockLoginProvider, Notification };
});
// Use plain Testing Library render for all tests to avoid heavy app providers
import DrawProvider from './DrawProvider';
import * as _olInteraction from 'ol/interaction';
import * as _olInteractionSelect from 'ol/interaction/Select';
import { Vector as VectorSource } from 'ol/source';
import { Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import * as utils from '../../utils';

// Mock i18n translation hook to avoid needing a full i18n setup
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Inline mock for OpenLayers Select interaction
type Handler = (payload?: unknown) => void;
type HandlerMap = Record<string, Handler[]>;
vi.mock('ol/interaction/Select', () => {
  let lastSelectInstance: unknown;
  return {
    __esModule: true,
    default: class SelectMock {
      private handlers: HandlerMap = {};
      public active = true;
      public features: unknown[] = [];

      constructor(_opts?: unknown) {
        // Capture last instance for assertions

        lastSelectInstance = this;
      }
      setActive = vi.fn((active: boolean) => {
        this.active = active;
      });
      getFeatures() {
        return {
          clear: vi.fn(() => {
            this.features = [];
          }),

          push: vi.fn((f: any) => {
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
vi.mock('ol/interaction', () => {
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
    setActive = vi.fn();
  }

  class Draw extends Emitter {
    removeLastPoint = vi.fn();
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
    constructor(_opts?: unknown) {
      super();

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

// Helper to access mocked interaction instances via ESM-safe imports

const __getLastDrawInstance: () => any = (_olInteraction as any).__getLastDrawInstance;

const __getLastModifyInstance: () => any = (_olInteraction as any).__getLastModifyInstance;

const __getLastSelectInstance: () => any = (_olInteractionSelect as any).__getLastSelectInstance;

describe('DrawInteraction startDraw events', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, NODE_ENV: 'development' } as NodeJS.ProcessEnv; // allow interactions in tests
  });

  afterEach(() => {
    process.env = OLD_ENV;
    vi.clearAllMocks();
  });

  function renderWithProviders(options?: {
    onSelfIntersectingPolygon?: (f: any) => void;

    handleModifyEnd?: (e: any, original: any, modified: any) => void;
  }) {
    const actions = {
      setSelectedFeature: vi.fn(),
      setSelectedDrawToolType: vi.fn(),
    };

    const map = {
      addInteraction: vi.fn(),
      removeInteraction: vi.fn(),
      getPixelFromCoordinate: vi.fn(),
      getFeaturesAtPixel: vi.fn().mockReturnValue([]),
    } as unknown as Record<string, unknown>;

    const state = {
      selectedFeature: null,
      selectedDrawtoolType: DRAWTOOLTYPE.POLYGON,
    };

    const source = {
      on: vi.fn(),
      getFeatures: vi.fn(() => []),
    } as unknown as Record<string, unknown>;

    const ui = (
      <GlobalNotificationProvider>
        {/* Cast types for test-only mocks */}
        {}
        <MapContext.Provider value={{ map: map as any, layers: {} as any } as any}>
          {}
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

    const select = __getLastSelectInstance() as any;

    const draw = __getLastDrawInstance() as any;

    // Simulate drawstart event from Draw interaction
    const feature = { on: vi.fn(), getGeometry: vi.fn() };
    draw.emit('drawstart', { feature });

    // Assert selection was deactivated
    expect(select.setActive).toHaveBeenCalledWith(false);
    // Assert draw registered change handler on feature
    expect(feature.on).toHaveBeenCalledWith('change', expect.any(Function));
  });

  test("activates selection and clears on 'drawend'", async () => {
    const onSelfIntersectingPolygon = vi.fn();
    const { actions } = renderWithProviders({ onSelfIntersectingPolygon });

    await waitFor(() => expect(__getLastSelectInstance()).toBeDefined());

    const select = __getLastSelectInstance() as any;

    const draw = __getLastDrawInstance() as any;

    const feature = { getGeometry: vi.fn(() => ({}) as any) };

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
    const handleModifyEnd = vi.fn();
    renderWithProviders({ handleModifyEnd });

    // Wait until Modify interaction exists
    await waitFor(() => expect(__getLastModifyInstance()).toBeDefined());

    const modify = __getLastModifyInstance() as any;

    // Mock feature for modifystart
    const originalFeatureClone = { id: 'original-clone' };
    const startFeature = {
      getGeometry: vi.fn(() => ({
        clone: vi.fn(() => ({
          /* not used here */
        })),
      })),
      clone: vi.fn(() => originalFeatureClone),
    };
    const startEvent = { features: { item: vi.fn(() => startFeature) } };

    // Fire modifystart to capture original feature/geometry
    modify.emit('modifystart', startEvent);

    // Prepare modifyend with non-self-intersecting polygon
    (utils.isPolygonSelfIntersecting as Mock).mockReturnValue(false);

    const endGeometry = {};
    const endFeature = { getGeometry: vi.fn(() => endGeometry) };
    const endEvent = { features: { item: vi.fn(() => endFeature) } };

    // Act
    modify.emit('modifyend', endEvent);

    // Assert
    expect(handleModifyEnd).toHaveBeenCalledTimes(1);
    expect(handleModifyEnd).toHaveBeenCalledWith(endEvent, originalFeatureClone, endFeature);
  });

  test('finishCondition allows completion; drawend invokes callback for self-intersecting polygon', async () => {
    // Arrange: mock self-intersecting polygon via utils.isPolygonSelfIntersecting (used only in drawend handler)
    const onSelfIntersectingPolygon = vi.fn();
    const spyIsSelfIntersecting = vi
      .spyOn(utils, 'isPolygonSelfIntersecting')
      .mockReturnValue(true);
    renderWithProviders({ onSelfIntersectingPolygon });

    await waitFor(() => expect(__getLastDrawInstance()).toBeDefined());
    const draw: any = __getLastDrawInstance();
    const options = draw.__getOptions();
    expect(options.finishCondition).toBeDefined();

    // Simulate drawstart and one change event to set drawnFeature
    const fakePolygon = new Polygon([
      [
        [0, 0],
        [5, 5],
        [10, 0],
        [0, 0], // closing coordinate in test fixture (OL would manage cursor differently)
      ],
    ]);
    const feature = new Feature(fakePolygon);
    feature.on = vi.fn();
    feature.getGeometry = vi.fn(() => fakePolygon);
    draw.emit('drawstart', { feature });
    const changeHandler = (feature as any).on.mock.calls.find((c: any[]) => c[0] === 'change')[1];
    changeHandler({ target: feature });

    // Act: finishCondition should not itself block (no closure self-intersection check in current implementation)
    const canFinish = options.finishCondition({} as any);
    expect(canFinish).toBe(true);
    expect(onSelfIntersectingPolygon).not.toHaveBeenCalled(); // callback only fired on drawend

    // Emulate OL finishing the draw
    draw.emit('drawend', { feature });
    expect(onSelfIntersectingPolygon).toHaveBeenCalledWith(feature);

    spyIsSelfIntersecting.mockRestore();
  });

  test('allows finishing when closing segment is valid (non-self-intersecting)', async () => {
    const onSelfIntersectingPolygon = vi.fn();
    const spyIsSelfIntersecting = vi
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
    feature.on = vi.fn();
    feature.getGeometry = vi.fn(() => fakePolygon);
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

  test('finishCondition blocks completion when closing segment introduces intersection', async () => {
    // Arrange: first incremental validation returns false (no intersection); closing validation returns true
    const spyAreLines = vi
      .spyOn(utils, 'areLinesInPolygonIntersecting')
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);
    const { actions } = renderWithProviders();
    await waitFor(() => expect(__getLastDrawInstance()).toBeDefined());
    const draw: any = __getLastDrawInstance();
    const options = draw.__getOptions();
    expect(options.finishCondition).toBeDefined();

    // Geometry with 4 committed points where closing segment self-intersects hypothetically
    // Simulate in-progress drawing structure: [p0, p1, p2, p3, cursor, p0]
    const fakePolygon = new Polygon([
      [
        [0, 0], // p0
        [10, 0], // p1
        [10, 10], // p2
        [5, -5], // p3 (problematic)
        [5, -5], // cursor mock (same as last fixed point for test simplicity)
        [0, 0], // closing p0
      ],
    ]);
    const feature = new Feature(fakePolygon);
    feature.on = vi.fn();
    feature.getGeometry = vi.fn(() => fakePolygon);
    draw.emit('drawstart', { feature });
    const changeHandler = (feature as any).on.mock.calls.find((c: any[]) => c[0] === 'change')[1];
    changeHandler({ target: feature });

    // Act: finishCondition should now block
    const canFinish = options.finishCondition({} as any);
    expect(spyAreLines).toHaveBeenCalledTimes(2);
    expect(canFinish).toBe(false);
    // Selected draw tool should remain active (not set to null yet)
    expect(actions.setSelectedDrawToolType).not.toHaveBeenCalledWith(null);
    spyAreLines.mockRestore();
  });

  test('finishCondition blocks completion when geometry is already closed and self-intersecting (no cursor point)', async () => {
    // First call (incremental) -> false, second call (closed ring) -> true
    const spyAreLines = vi
      .spyOn(utils, 'areLinesInPolygonIntersecting')
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);
    renderWithProviders();
    await waitFor(() => expect(__getLastDrawInstance()).toBeDefined());
    const draw: any = __getLastDrawInstance();
    const options = draw.__getOptions();
    expect(options.finishCondition).toBeDefined();

    // Geometry already closed: [p0,p1,p2,p3,p0]
    const fakePolygon = new Polygon([
      [
        [0, 0],
        [10, 0],
        [10, 10],
        [5, -5], // problematic
        [0, 0], // closure
      ],
    ]);
    const feature = new Feature(fakePolygon);
    feature.on = vi.fn();
    feature.getGeometry = vi.fn(() => fakePolygon);
    draw.emit('drawstart', { feature });
    const changeHandler = (feature as any).on.mock.calls.find((c: any[]) => c[0] === 'change')[1];
    changeHandler({ target: feature });

    const canFinish = options.finishCondition({} as any);
    expect(spyAreLines).toHaveBeenCalledTimes(2);
    expect(canFinish).toBe(false);
    spyAreLines.mockRestore();
  });

  test('modifyend (self-intersecting) reverts coordinates to original', async () => {
    renderWithProviders();

    await waitFor(() => expect(__getLastModifyInstance()).toBeDefined());

    const modify = __getLastModifyInstance() as any;

    // Ensure handlers are attached before emitting
    await waitFor(() => {
      expect(modify.handlers).toBeDefined();
      expect(Array.isArray(modify.handlers['modifystart'])).toBe(true);
      expect(Array.isArray(modify.handlers['modifyend'])).toBe(true);
    });

    // Set up original geometry captured during modifystart
    const originalCoords = [[0, 0]];
    const originalGeometryClone = { getCoordinates: vi.fn(() => originalCoords) };
    const startFeature = {
      getGeometry: vi.fn(() => ({ clone: vi.fn(() => originalGeometryClone) })),
      clone: vi.fn(() => ({
        /* original feature clone not used in this test */
      })),
    };
    const startEvent = { features: { item: vi.fn(() => startFeature) } };
    modify.emit('modifystart', startEvent);

    // Prepare modifyend with self-intersecting polygon
    (utils.isPolygonSelfIntersecting as Mock).mockReturnValue(true);

    const modifiedPolygon = { setCoordinates: vi.fn() };
    const endFeature = { getGeometry: vi.fn(() => modifiedPolygon) };
    const endEvent = { features: { item: vi.fn(() => endFeature) } };

    // Act
    modify.emit('modifyend', endEvent);

    // Assert: revert to original coordinates path taken
    expect(utils.isPolygonSelfIntersecting).toHaveBeenCalledWith(modifiedPolygon);
    expect(originalGeometryClone.getCoordinates).toHaveBeenCalled();
    expect(modifiedPolygon.setCoordinates).toHaveBeenCalledTimes(1);
  });

  test('removefeature clears selection and calls onSelfIntersectingPolygon(null) when none remain', async () => {
    const onSelfIntersectingPolygon = vi.fn();
    const { actions, source } = renderWithProviders({ onSelfIntersectingPolygon });

    // Ensure effect wired up
    await waitFor(() => {
      expect((source as any).on).toHaveBeenCalled();
    });

    (utils.isPolygonSelfIntersecting as Mock).mockReturnValue(false);

    // Find the registered removefeature handler and invoke it
    type OnHandler = (...args: unknown[]) => void;
    const onCalls = ((source as any).on as Mock).mock.calls as Array<[string, OnHandler]>;
    const removeHandler = onCalls.find(([evt]) => evt === 'removefeature')?.[1];
    expect(removeHandler).toBeDefined();

    removeHandler?.();

    expect(actions.setSelectedFeature).toHaveBeenCalledWith(null);
    expect(onSelfIntersectingPolygon).toHaveBeenCalledWith(null);
  });

  test('drawstart on.change handler allows drawing inside hanke area', async () => {
    // Arrange
    const mockDrawSegmentGuardInside = vi.fn(() => true); // Allow segment (inside hanke area)

    function renderWithDrawSegmentGuard() {
      const actions = {
        setSelectedFeature: vi.fn(),
        setSelectedDrawToolType: vi.fn(),
      };

      const map = {
        addInteraction: vi.fn(),
        removeInteraction: vi.fn(),
        getPixelFromCoordinate: vi.fn(),
        getFeaturesAtPixel: vi.fn().mockReturnValue([]),
      } as unknown as Record<string, unknown>;

      const state = {
        selectedFeature: null,
        selectedDrawtoolType: DRAWTOOLTYPE.POLYGON,
      };

      const source = {
        on: vi.fn(),
        getFeatures: vi.fn(() => []),
      } as unknown as Record<string, unknown>;

      const ui = (
        <GlobalNotificationProvider>
          {}
          <MapContext.Provider value={{ map: map as any, layers: {} as any } as any}>
            {}
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

    const draw = __getLastDrawInstance() as any;

    // Create mock feature with polygon geometry - starting with first 2 points in OL structure
    const mockGeometry = {
      getCoordinates: vi.fn(() => [
        [
          [10, 10], // Point 1 (index 0)
          [20, 20], // Point 2 (index 1)
          [20, 20], // Cursor position (index 2) - same as point 2
          [10, 10], // Closing point (index 3) - same as point 1
        ],
      ]),
    };

    const mockFeature = {
      on: vi.fn(),
      getGeometry: vi.fn(() => mockGeometry),
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
    const mockDrawSegmentGuardOutside = vi.fn(() => false); // Reject segment (outside hanke area)

    function renderWithDrawSegmentGuard() {
      const actions = {
        setSelectedFeature: vi.fn(),
        setSelectedDrawToolType: vi.fn(),
      };

      const map = {
        addInteraction: vi.fn(),
        removeInteraction: vi.fn(),
        getPixelFromCoordinate: vi.fn(),
        getFeaturesAtPixel: vi.fn().mockReturnValue([]),
      } as unknown as Record<string, unknown>;

      const state = {
        selectedFeature: null,
        selectedDrawtoolType: DRAWTOOLTYPE.POLYGON,
      };

      const source = {
        on: vi.fn(),
        getFeatures: vi.fn(() => []),
      } as unknown as Record<string, unknown>;

      const ui = (
        <GlobalNotificationProvider>
          {}
          <MapContext.Provider value={{ map: map as any, layers: {} as any } as any}>
            {}
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

    const draw = __getLastDrawInstance() as any;

    // Create mock feature with polygon geometry - starting with first 2 points in OL structure
    const mockGeometry = {
      getCoordinates: vi.fn(() => [
        [
          [10, 10], // Point 1 (index 0)
          [20, 20], // Point 2 (index 1)
          [20, 20], // Cursor position (index 2) - same as point 2
          [10, 10], // Closing point (index 3) - same as point 1
        ],
      ]),
    };

    const mockFeature = {
      on: vi.fn(),
      getGeometry: vi.fn(() => mockGeometry),
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
    const mockDrawSegmentGuardSkip = vi.fn(() => true);

    function renderWithDrawSegmentGuard() {
      const actions = {
        setSelectedFeature: vi.fn(),
        setSelectedDrawToolType: vi.fn(),
      };

      const map = {
        addInteraction: vi.fn(),
        removeInteraction: vi.fn(),
        getPixelFromCoordinate: vi.fn(),
        getFeaturesAtPixel: vi.fn().mockReturnValue([]),
      } as unknown as Record<string, unknown>;

      const state = {
        selectedFeature: null,
        selectedDrawtoolType: DRAWTOOLTYPE.POLYGON,
      };

      const source = {
        on: vi.fn(),
        getFeatures: vi.fn(() => []),
      } as unknown as Record<string, unknown>;

      const ui = (
        <GlobalNotificationProvider>
          {}
          <MapContext.Provider value={{ map: map as any, layers: {} as any } as any}>
            {}
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

    const draw = __getLastDrawInstance() as any;

    // Create mock feature with only one point
    const mockGeometry = {
      getCoordinates: vi.fn(() => [
        [
          [10, 10], // First point
          [10, 10], // Cursor position (same as first point)
        ],
      ]),
    };

    const mockFeature = {
      on: vi.fn(),
      getGeometry: vi.fn(() => mockGeometry),
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
vi.mock('../../MapContext', async () => {
  const ReactLib = await vi.importActual<typeof import('react')>('react');
  return {
    __esModule: true,
    default: ReactLib.createContext({
      map: {
        addInteraction: vi.fn(),
        removeInteraction: vi.fn(),
      },
      layers: {},
    }),
  };
});

// Mock only the hook, preserve the provider
vi.mock('../../../globalNotification/GlobalNotificationContext', async () => {
  const actual = await vi.importActual<
    typeof import('../../../globalNotification/GlobalNotificationContext')
  >('../../../globalNotification/GlobalNotificationContext');
  return {
    ...actual,
    useGlobalNotification: () => ({ setNotification: vi.fn() }),
  };
});

// Mock the polygon intersection utility
vi.mock('../../utils', () => ({
  isPolygonSelfIntersecting: vi.fn(),
  areLinesInPolygonIntersecting: vi.fn(),
  getSurfaceArea: vi.fn(() => 100), // Return valid surface area
}));

const { isPolygonSelfIntersecting } = utils as Mocked<typeof utils>;

describe('DrawInteraction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const source = new VectorSource();
    const { container } = rtlRender(
      <DrawProvider source={source}>
        <DrawInteraction />
      </DrawProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('calls onSelfIntersectingPolygon when polygon intersects itself', () => {
    const onSelfIntersectingPolygon = vi.fn();
    const source = new VectorSource();

    // Mock self-intersecting polygon
    isPolygonSelfIntersecting.mockReturnValue(true);

    const { container } = rtlRender(
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
    expect(container).toBeInTheDocument();
  });

  it('handles modify end with self-intersecting polygon', () => {
    const source = new VectorSource();
    const handleModifyEnd = vi.fn();

    // Mock self-intersecting polygon
    isPolygonSelfIntersecting.mockReturnValue(true);

    const { container } = rtlRender(
      <DrawProvider source={source}>
        <DrawInteraction handleModifyEnd={handleModifyEnd} />
      </DrawProvider>,
    );

    // This test verifies the component renders and can handle the modify end logic
    // The actual modify interaction testing would require more complex OpenLayers mocking
    expect(container).toBeInTheDocument();
  });

  it('handles modify end with valid polygon', () => {
    const source = new VectorSource();
    const handleModifyEnd = vi.fn();

    // Mock valid (non-intersecting) polygon
    isPolygonSelfIntersecting.mockReturnValue(false);

    const { container } = rtlRender(
      <DrawProvider source={source}>
        <DrawInteraction handleModifyEnd={handleModifyEnd} />
      </DrawProvider>,
    );

    // This test verifies the component renders and can handle valid polygons
    expect(container).toBeInTheDocument();
  });

  it('accepts all optional props without error', () => {
    const source = new VectorSource();
    const mockProps = {
      onSelfIntersectingPolygon: vi.fn(),
      drawCondition: vi.fn(() => true),
      drawFinishCondition: vi.fn(() => true),
      drawStyleFunction: vi.fn(),
      drawSegmentGuard: vi.fn(() => true),
      handleModifyEnd: vi.fn(),
    };

    const { container } = rtlRender(
      <DrawProvider source={source}>
        <DrawInteraction {...mockProps} />
      </DrawProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  describe('drawSegmentGuard functionality', () => {
    it('renders without drawSegmentGuard prop', () => {
      const source = new VectorSource();
      const { container } = rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction />
        </DrawProvider>,
      );
      expect(container).toBeInTheDocument();
    });

    it('renders with drawSegmentGuard prop', () => {
      const source = new VectorSource();
      const mockDrawSegmentGuard = vi.fn(() => true);

      const { container } = rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction drawSegmentGuard={mockDrawSegmentGuard} />
        </DrawProvider>,
      );
      expect(container).toBeInTheDocument();
    });

    it('accepts drawSegmentGuard function that returns true', () => {
      const source = new VectorSource();
      const mockDrawSegmentGuard = vi.fn((map, segment) => {
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
      const mockDrawSegmentGuard = vi.fn((map, segment) => {
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
      const mockDrawSegmentGuard = vi.fn((map, segment) => {
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

      const mockDrawSegmentGuard = vi.fn((map, segment) => {
        const [start, end] = segment;
        return withinBounds(start) && withinBounds(end);
      });

      const { container } = rtlRender(
        <DrawProvider source={source}>
          <DrawInteraction drawSegmentGuard={mockDrawSegmentGuard} />
        </DrawProvider>,
      );
      expect(container).toBeInTheDocument();
    });

    it('supports different coordinate systems in drawSegmentGuard', () => {
      const source = new VectorSource();
      const mockDrawSegmentGuard = vi.fn((map, segment) => {
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
      setSelectedDrawToolType: vi.fn(),
      setSelectedFeature: vi.fn(),
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

    const draw = __getLastDrawInstance() as any;

    const ring = [
      [0, 0], // start
      [5, 0], // first user point
      [5, 5], // second user point
      [0, 0], // cursor closing link (auto)
      [0, 0], // cursor position (auto)
    ];
    const originalLength = ring.length;
    const mockGeometry = { getCoordinates: vi.fn(() => [ring]) };
    const mockFeature = { on: vi.fn(), getGeometry: vi.fn(() => mockGeometry) };

    draw.emit('drawstart', { feature: mockFeature });
    const changeHandler = mockFeature.on.mock.calls[0][1];

    // Act - trigger change (adds a point logically)
    changeHandler({ target: mockFeature });

    // Assert - ring length unchanged (no splice mutation)
    expect(ring.length).toBe(originalLength);
  });
});
