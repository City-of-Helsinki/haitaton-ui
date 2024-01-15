import { Feature } from 'ol';
import { HankeAlueFormState, HankeDataFormState } from './types';
import { convertFormStateToHankeData, getAreaDefaultName } from './utils';

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
