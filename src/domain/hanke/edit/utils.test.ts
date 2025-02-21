import { Feature } from 'ol';
import { ValidationError } from 'yup';
import { UseFormGetValues } from 'react-hook-form';
import { HankeAlueFormState, HankeDataFormState } from './types';
import {
  convertFormStateToHankeData,
  getAreaDefaultName,
  getWorkAreasInsideHankealueFeature,
  mapValidationErrorToErrorListItem,
} from './utils';
import { t } from '../../../locales/i18nForTests';
import { render, screen } from '../../../testUtils/render';
import { feature, polygon } from '@turf/helpers';
import {
  ApplicationArea,
  HankkeenHakemus,
  KaivuilmoitusAlue,
  Tyoalue,
} from '../../application/types/application';
import { Position } from 'geojson';

function getArea(areaName: string): HankeAlueFormState {
  return {
    feature: new Feature(),
    nimi: areaName,
    id: null,
    haittaAlkuPvm: new Date('2023-01-12T00:00:00Z'),
    haittaLoppuPvm: new Date('2024-11-27T00:00:00Z'),
    kaistaHaitta: null,
    kaistaPituusHaitta: null,
    meluHaitta: null,
    polyHaitta: null,
    tarinaHaitta: null,
  };
}

function getHankeData(): HankeDataFormState {
  return {
    alueet: [getArea('Hankealue 1')],
    omistajat: [],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
  };
}

test('Should get default area name when there are no areas', () => {
  const areaName = getAreaDefaultName([]);

  expect(areaName).toBe('Hankealue 1');
});

test('Should get correct default area name based on other areas', () => {
  const areaName = getAreaDefaultName([
    getArea('Hankealue 1'),
    getArea('Hankealue 3'),
    getArea('Hankealue 7'),
    getArea('Oma alue 3'),
  ]);

  expect(areaName).toBe('Hankealue 8');

  const secondAreaName = getAreaDefaultName([
    getArea('Hankealue 1'),
    getArea('Kuoppa'),
    getArea('Hankealue 30'),
    getArea('Hankealue 7'),
  ]);

  expect(secondAreaName).toBe('Hankealue 31');

  const thirdAreaName = getAreaDefaultName([
    getArea('Hankealue 1'),
    getArea('Hankealue 3'),
    getArea('Hankealue 7'),
    getArea('Oma alue 9'),
  ]);

  expect(thirdAreaName).toBe('Hankealue 8');
});

test('Should get area data without feature', () => {
  const hankeData = convertFormStateToHankeData(getHankeData());

  expect(hankeData.alueet![0].feature).toBeUndefined();
  expect(hankeData.alueet![0].nimi).toBe('Hankealue 1');
});

describe('mapValidationErrorToErrorListItem', () => {
  test('Should show error for simple error path, for example hanke kuvaus', () => {
    const error = new ValidationError('Test error', undefined, 'kuvaus');
    const getValues: UseFormGetValues<HankeDataFormState> = jest.fn().mockReturnValue({});
    render(mapValidationErrorToErrorListItem(error, t, getValues));

    expect(screen.getByText('Hankkeen kuvaus')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '#kuvaus');
  });

  test('Should show error for hanke area', () => {
    const error = new ValidationError('Test error', undefined, 'alueet[0].meluHaitta');
    const getValues: UseFormGetValues<HankeDataFormState> = jest.fn().mockReturnValue('Test Area');
    render(mapValidationErrorToErrorListItem(error, t, getValues));

    expect(screen.getByText('Test Area: Meluhaitta')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '#alueet.0.meluHaitta');
  });

  test('Should show error when there are no areas', () => {
    const error = new ValidationError('Test error', undefined, 'alueet');
    const getValues: UseFormGetValues<HankeDataFormState> = jest.fn().mockReturnValue({});
    render(mapValidationErrorToErrorListItem(error, t, getValues));

    expect(screen.getByText('Hankealueet: Hankealueen piirtäminen')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '#alueet');
  });

  test('Should show error for haittojenhallintasuunnitelma', () => {
    const error = new ValidationError(
      'Test error',
      undefined,
      'alueet[0].haittojenhallintasuunnitelma.YLEINEN',
    );
    const getValues: UseFormGetValues<HankeDataFormState> = jest.fn().mockReturnValue('Test Area');
    render(mapValidationErrorToErrorListItem(error, t, getValues));

    expect(
      screen.getByText('Test Area: Toimet hankealueen haittojen hallintaan'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '#alueet.0.haittojenhallintasuunnitelma.YLEINEN',
    );
  });

  test('Should show error for contact', () => {
    const error = new ValidationError('Test error', undefined, 'omistajat[0].nimi');
    const getValues: UseFormGetValues<HankeDataFormState> = jest.fn().mockReturnValue({});
    render(mapValidationErrorToErrorListItem(error, t, getValues));

    expect(screen.getByText('Hankkeen omistaja: Nimi')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '#omistajat.0.nimi');
  });
});

describe('getWorkAreasInsideHankealueFeature', () => {
  const hankeFeature = feature(
    polygon([
      [
        [0, 0],
        [0, 3],
        [3, 3],
        [3, 0],
        [0, 0],
      ],
    ]).geometry,
  );
  function johtoselvitysWorkArea(coordinates: Position[][]): ApplicationArea {
    return {
      geometry: {
        type: 'Polygon',
        coordinates: coordinates,
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3067',
          },
        },
      },
    };
  }

  function kaivuilmoitusWorkArea(coordinates: Position[][]): Tyoalue {
    return {
      geometry: {
        type: 'Polygon',
        coordinates: coordinates,
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3067',
          },
        },
      },
      area: 1,
    };
  }

  function kaivuilmoitusArea(coordinates: Position[][]): KaivuilmoitusAlue {
    return {
      name: '',
      hankealueId: 0,
      tyoalueet: [kaivuilmoitusWorkArea(coordinates)],
      area: 1,
      katuosoite: '',
      meluhaitta: 'EI_MELUHAITTAA',
      polyhaitta: 'EI_POLYHAITTAA',
      tarinahaitta: 'EI_TARINAHAITTAA',
      kaistahaitta: 'EI_VAIKUTA',
      kaistahaittojenPituus: 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
      tyonTarkoitukset: [],
    } as KaivuilmoitusAlue;
  }

  function johtoselvityshakemus(coordinates: Position[][]): HankkeenHakemus {
    return {
      id: 0,
      alluStatus: null,
      applicationType: 'CABLE_REPORT',
      applicationData: {
        name: 'JS',
        startTime: new Date(),
        endTime: new Date(),
        areas: [johtoselvitysWorkArea(coordinates)],
      },
    };
  }

  function kaivuilmoitus(coordinates: Position[][]): HankkeenHakemus {
    return {
      id: 0,
      alluStatus: null,
      applicationType: 'EXCAVATION_NOTIFICATION',
      applicationData: {
        name: 'KP',
        startTime: new Date(),
        endTime: new Date(),
        areas: [kaivuilmoitusArea(coordinates)],
      },
    };
  }

  test('returns empty array if all work areas are completely outside hankealue', () => {
    const hakemus1 = johtoselvityshakemus([
      [
        [4, 4],
        [4, 5],
        [5, 5],
        [5, 4],
        [4, 4],
      ],
    ]);
    const hakemus2 = kaivuilmoitus([
      [
        [4, 4],
        [4, 5],
        [5, 5],
        [5, 4],
        [4, 4],
      ],
    ]);

    const workAreas = getWorkAreasInsideHankealueFeature(hankeFeature, [hakemus1, hakemus2]);

    expect(workAreas).toEqual([]);
  });

  test('returns empty array if all work areas are only partially inside hankealue', () => {
    const hakemus1 = johtoselvityshakemus([
      [
        [1, 1],
        [4, 1],
        [4, 4],
        [1, 4],
        [1, 1],
      ],
    ]);
    const hakemus2 = kaivuilmoitus([
      [
        [1, 1],
        [4, 1],
        [4, 4],
        [1, 4],
        [1, 1],
      ],
    ]);

    const workAreas = getWorkAreasInsideHankealueFeature(hankeFeature, [hakemus1, hakemus2]);

    expect(workAreas).toEqual([]);
  });

  test('returns array of the johtoselvitys work area that is completely inside hankealue', () => {
    const hakemus1 = johtoselvityshakemus([
      [
        [1, 1],
        [2, 1],
        [2, 2],
        [1, 2],
        [1, 1],
      ],
    ]);
    const hakemus2 = kaivuilmoitus([
      [
        [1, 1],
        [4, 1],
        [4, 4],
        [1, 4],
        [1, 1],
      ],
    ]);

    const workAreas = getWorkAreasInsideHankealueFeature(hankeFeature, [hakemus1, hakemus2]);

    expect(workAreas).toEqual([
      johtoselvitysWorkArea([
        [
          [1, 1],
          [2, 1],
          [2, 2],
          [1, 2],
          [1, 1],
        ],
      ]),
    ]);
  });

  test('returns array of the kaivuilmoitus work area that is completely inside hankealue', () => {
    const hakemus1 = johtoselvityshakemus([
      [
        [1, 1],
        [4, 1],
        [4, 4],
        [1, 4],
        [1, 1],
      ],
    ]);
    const hakemus2 = kaivuilmoitus([
      [
        [1, 1],
        [2, 1],
        [2, 2],
        [1, 2],
        [1, 1],
      ],
    ]);

    const workAreas = getWorkAreasInsideHankealueFeature(hankeFeature, [hakemus1, hakemus2]);

    expect(workAreas).toEqual([
      kaivuilmoitusWorkArea([
        [
          [1, 1],
          [2, 1],
          [2, 2],
          [1, 2],
          [1, 1],
        ],
      ]),
    ]);
  });

  test('returns all work areas that are completely inside hankealue', () => {
    const hakemus1 = johtoselvityshakemus([
      [
        [1, 1],
        [2, 1],
        [2, 2],
        [1, 2],
        [1, 1],
      ],
    ]);
    const hakemus2 = kaivuilmoitus([
      [
        [1, 1],
        [2, 1],
        [2, 2],
        [1, 2],
        [1, 1],
      ],
    ]);

    const workAreas = getWorkAreasInsideHankealueFeature(hankeFeature, [hakemus1, hakemus2]);

    expect(workAreas).toEqual([
      johtoselvitysWorkArea([
        [
          [1, 1],
          [2, 1],
          [2, 2],
          [1, 2],
          [1, 1],
        ],
      ]),
      kaivuilmoitusWorkArea([
        [
          [1, 1],
          [2, 1],
          [2, 2],
          [1, 2],
          [1, 1],
        ],
      ]),
    ]);
  });
});
