import { convertFormStateToHankeData } from './utils';
import { HankeDataFormState } from './types';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';

describe('convertFormStateToHankeData', () => {
  test('serializes OpenLayers Feature into GeoJSON featureCollection and excludes feature property', () => {
    const coords = [
      [
        [0, 0],
        [2, 0],
        [2, 2],
        [0, 0],
      ],
    ];
    const feature = new Feature(new Polygon(coords));

    const formState = {
      hankeTunnus: 'TTEST',
      nimi: 'Test',
      kuvaus: '',
      tyomaaKatuosoite: '',
      vaihe: null,
      tyomaaTyyppi: [],
      onYKTHanke: null,
      alkuPvm: null,
      loppuPvm: null,
      omistajat: [],
      rakennuttajat: [],
      toteuttajat: [],
      muut: [],
      alueet: [
        {
          id: 1,
          nimi: 'Area 1',
          feature,
          geometriat: { featureCollection: { type: 'FeatureCollection', features: [] } },
          haittaAlkuPvm: null,
          haittaLoppuPvm: null,
          kaistaHaitta: null,
          kaistaPituusHaitta: null,
          meluHaitta: null,
          polyHaitta: null,
          tarinaHaitta: null,
        },
      ],
      tormaystarkasteluTulos: null,
      status: 'DRAFT',
    } as unknown as HankeDataFormState;

    const result = convertFormStateToHankeData(formState);

    expect(result).toHaveProperty('alueet');
    const area = (result.alueet && result.alueet[0])!;
    expect(area).toBeTruthy();
    // feature should not be present in the serialized payload
    // serialized payload should not include a non-serializable OpenLayers Feature
    expect((area as unknown as Record<string, unknown>).feature).toBeUndefined();
    // geometriat.featureCollection should be present and be a FeatureCollection
    expect(area.geometriat).toBeTruthy();
    const fc = area.geometriat!.featureCollection;
    expect(fc.type).toBe('FeatureCollection');
    expect(Array.isArray(fc.features)).toBe(true);
    expect(fc.features[0].geometry.type).toBe('Polygon');
    // Coordinates should match the input polygon coordinates (as numbers)
    expect(fc.features[0].geometry.coordinates).toEqual(coords);
  });
});
