import api from '../../api/api';

// Type definitions for API responses
interface MockHankeAlue {
  id: number;
  nimi: string;
  haittaAlkuPvm: string;
  haittaLoppuPvm: string;
  geometriat: {
    featureCollection: {
      type: string;
      features: Array<{
        type: string;
        geometry: {
          type: string;
          coordinates: number[][][];
        };
        properties: object;
      }>;
    };
  };
  tormaystarkastelu: {
    liikennehaittaindeksi: {
      indeksi: number;
    };
  };
}

interface MockHanke {
  hankeTunnus: string;
  nimi: string;
  alueet: MockHankeAlue[];
}

// Helper function for expected hanke area structure
const createExpectedHankeArea = (startDate: string, endDate: string) =>
  expect.objectContaining({
    id: expect.any(Number),
    nimi: expect.stringContaining('Test Area'),
    haittaAlkuPvm: startDate,
    haittaLoppuPvm: endDate,
    geometriat: expect.objectContaining({
      featureCollection: expect.objectContaining({
        type: 'FeatureCollection',
        features: expect.any(Array),
      }),
    }),
    tormaystarkastelu: expect.objectContaining({
      liikennehaittaindeksi: expect.objectContaining({
        indeksi: expect.any(Number),
      }),
    }),
  });

// Helper function for expected hanke structure
const createExpectedHanke = (startDate: string, endDate: string) =>
  expect.objectContaining({
    hankeTunnus: expect.stringMatching(/^HAI22-/),
    nimi: expect.stringContaining('Test Hanke'),
    alueet: expect.arrayContaining([createExpectedHankeArea(startDate, endDate)]),
  });

// Helper function to validate GeoJSON structure
const validateGeoJSONStructure = (alue: MockHankeAlue) => {
  expect(alue.geometriat.featureCollection).toMatchObject({
    type: 'FeatureCollection',
    features: expect.arrayContaining([
      expect.objectContaining({
        type: 'Feature',
        geometry: expect.objectContaining({
          type: expect.any(String),
          coordinates: expect.any(Array),
        }),
        properties: expect.any(Object),
      }),
    ]),
  });
};

// Helper function to validate all areas in a hanke
const validateHankeAreas = (hanke: MockHanke) => {
  hanke.alueet.forEach(validateGeoJSONStructure);
};

// Helper function to validate date parameters
const validateDateParameters = (startDate: string, endDate: string) => (alue: MockHankeAlue) => {
  expect(alue.haittaAlkuPvm).toBe(startDate);
  expect(alue.haittaLoppuPvm).toBe(endDate);
};

// Helper function to validate all areas in a hanke for date parameters
const validateHankeDateParameters = (startDate: string, endDate: string) => (hanke: MockHanke) => {
  hanke.alueet.forEach(validateDateParameters(startDate, endDate));
};

describe('Grid API Integration', () => {
  describe('Grid Metadata API', () => {
    test('successfully fetches grid metadata', async () => {
      const response = await api.get('/public-hankkeet/grid/metadata');

      expect(response.data).toEqual({
        cellSizeMeters: 1000,
        originX: 25486422,
        originY: 6643836,
        maxX: 25515423,
        maxY: 6687837,
      });
    });
  });

  describe('Grid Data API', () => {
    test('successfully fetches hanke data with valid parameters', async () => {
      const requestData = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        cells: [
          { x: 5, y: 5 },
          { x: 5, y: 6 },
        ],
      };

      const response = await api.post('/public-hankkeet/grid', requestData);

      expect(response.data).toHaveLength(2);
      expect(response.data[0]).toMatchObject(createExpectedHanke('2023-01-01', '2023-12-31'));
    });

    test('returns empty array when no cells provided', async () => {
      const requestData = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        cells: [],
      };

      const response = await api.post('/public-hankkeet/grid', requestData);

      expect(response.data).toEqual([]);
    });

    test('handles missing start date', async () => {
      const requestData = {
        endDate: '2023-12-31',
        cells: [{ x: 5, y: 5 }],
      };

      await expect(api.post('/public-hankkeet/grid', requestData)).rejects.toThrow();
    });

    test('handles missing end date', async () => {
      const requestData = {
        startDate: '2023-01-01',
        cells: [{ x: 5, y: 5 }],
      };

      await expect(api.post('/public-hankkeet/grid', requestData)).rejects.toThrow();
    });

    test('limits response size based on cell count', async () => {
      const requestData = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        cells: Array.from({ length: 100 }, (_, i) => ({ x: i % 10, y: Math.floor(i / 10) })),
      };

      const response = await api.post('/public-hankkeet/grid', requestData);

      // Should be limited to 5 items regardless of cell count
      expect(response.data).toHaveLength(5);
    });

    test('validates GeoJSON structure in response', async () => {
      const requestData = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        cells: [{ x: 5, y: 5 }],
      };

      const response = await api.post('/public-hankkeet/grid', requestData);

      // Verify GeoJSON structure
      response.data.forEach(validateHankeAreas);
    });
  });

  describe('API Request/Response Integration', () => {
    test('handles concurrent grid requests correctly', async () => {
      const requests = Array.from({ length: 3 }, (_, i) =>
        api.post('/public-hankkeet/grid', {
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          cells: [{ x: i, y: i }],
        }),
      );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.data).toHaveLength(1);
        expect(response.status).toBe(200);
      });
    });

    test('preserves request parameters in response data', async () => {
      const startDate = '2023-06-01';
      const endDate = '2023-06-30';

      const response = await api.post('/public-hankkeet/grid', {
        startDate,
        endDate,
        cells: [{ x: 10, y: 10 }],
      });

      response.data.forEach(validateHankeDateParameters(startDate, endDate));
    });
  });
});
