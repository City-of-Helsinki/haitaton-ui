import { Feature } from 'ol';
import { ValidationError } from 'yup';
import { UseFormGetValues } from 'react-hook-form';
import { HankeAlueFormState, HankeDataFormState } from './types';
import {
  convertFormStateToHankeData,
  getAreaDefaultName,
  mapValidationErrorToErrorListItem,
  sortedLiikenneHaittojenhallintatyyppi,
} from './utils';
import { HAITTOJENHALLINTATYYPPI } from '../../types/hanke';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../../common/haittaIndexes/types';
import { t } from '../../../locales/i18nForTests';
import { render, screen } from '../../../testUtils/render';

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

test('Should sort nuisance types correctly', () => {
  const tormaysTarkastelunTulos: HaittaIndexData = {
    autoliikenne: {
      indeksi: 1.0,
      haitanKesto: 1,
      katuluokka: 1,
      liikennemaara: 1,
      kaistahaitta: 1,
      kaistapituushaitta: 1,
    },
    pyoraliikenneindeksi: 3.0,
    linjaautoliikenneindeksi: 1.0,
    raitioliikenneindeksi: 0.0,
    liikennehaittaindeksi: {
      indeksi: 3.0,
      tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
    },
  };

  const sorted: [string, number][] = sortedLiikenneHaittojenhallintatyyppi(tormaysTarkastelunTulos);

  expect(sorted).toEqual([
    [HAITTOJENHALLINTATYYPPI.PYORALIIKENNE, 3.0],
    [HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE, 1.0],
    [HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE, 1.0],
    [HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE, 0.0],
  ]);
});

test('Should sort nuisance types in default order if tormaysTarkastelunTulos is undefined', () => {
  const tormaysTarkastelunTulos: HaittaIndexData | undefined = undefined;

  const sorted = sortedLiikenneHaittojenhallintatyyppi(tormaysTarkastelunTulos);

  expect(sorted).toEqual([
    [HAITTOJENHALLINTATYYPPI.PYORALIIKENNE, 0.0],
    [HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE, 0.0],
    [HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE, 0.0],
    [HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE, 0.0],
  ]);
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
