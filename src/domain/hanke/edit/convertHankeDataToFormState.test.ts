import { convertHankeDataToFormState } from './utils';
import { HankeData } from '../../types/hanke';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';

describe('convertHankeDataToFormState', () => {
  test('converts GeoJSON featureCollection into OpenLayers Feature with Polygon geometry and matching coordinates', () => {
    const coords = [
      [
        [5, 5],
        [6, 5],
        [6, 6],
        [5, 5],
      ],
    ];

    const hankeData = {
      hankeTunnus: 'TROUND',
      nimi: 'Roundtrip',
      alueet: [
        {
          id: 10,
          nimi: 'GeoArea',
          geometriat: {
            featureCollection: {
              type: 'FeatureCollection',
              crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::3879' } },
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: coords,
                  },
                  properties: { hankeTunnus: 'TROUND' },
                },
              ],
            },
          },
        },
      ],
    } as unknown as HankeData;

    const converted = convertHankeDataToFormState(hankeData);

    expect(converted).toHaveProperty('alueet');
    const area = converted.alueet![0];
    expect(area).toBeTruthy();

    // Feature should be recreated
    expect(area.feature).toBeInstanceOf(Feature);
    const geom = area.feature!.getGeometry();
    expect(geom).toBeInstanceOf(Polygon);
    const gotCoords = (geom as Polygon).getCoordinates();
    expect(gotCoords).toEqual(coords);
  });
});
