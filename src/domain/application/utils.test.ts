import { getCurrentDecisions, getDecisionFilename } from './utils';
import hakemukset from '../mocks/data/hakemukset-data';

describe('getCurrentDecisions', () => {
  test('returns all current decisions in correct order ', () => {
    const paatokset = hakemukset[7].paatokset;

    const currentDecisions = getCurrentDecisions(paatokset);

    expect(currentDecisions).toEqual([
      {
        id: 'f4b3b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b',
        hakemusId: 8,
        hakemustunnus: 'KP2400001-2',
        tyyppi: 'TYO_VALMIS',
        tila: 'NYKYINEN',
        nimi: 'KI 2024-06-27',
        alkupaiva: new Date('2024-05-28'),
        loppupaiva: new Date('2024-05-31'),
        size: 35764,
      },
      {
        id: '59e202c4-7571-4b16-96d0-2945d689bedf',
        hakemusId: 8,
        hakemustunnus: 'KP2400001-2',
        tyyppi: 'TOIMINNALLINEN_KUNTO',
        tila: 'NYKYINEN',
        nimi: 'KI 2024-06-27',
        alkupaiva: new Date('2024-05-28'),
        loppupaiva: new Date('2024-05-31'),
        size: 35764,
      },
      {
        id: '6a24e4a6-8f87-4da7-96f9-5f6b54ea6834',
        hakemusId: 8,
        hakemustunnus: 'KP2400001-2',
        tyyppi: 'PAATOS',
        tila: 'NYKYINEN',
        nimi: 'KI 2024-06-27',
        alkupaiva: new Date('2024-05-28'),
        loppupaiva: new Date('2024-05-31'),
        size: 35764,
      },
    ]);
  });
});

describe('getDecisionFilename', () => {
  test('returns correct filename for decisions', () => {
    const paatokset = hakemukset[7].paatokset;
    const currentDecisions = getCurrentDecisions(paatokset);

    expect(getDecisionFilename(currentDecisions[0])).toEqual('KP2400001-2-tyo-valmis.pdf');
    expect(getDecisionFilename(currentDecisions[1])).toEqual(
      'KP2400001-2-toiminnallinen-kunto.pdf',
    );
    expect(getDecisionFilename(currentDecisions[2])).toEqual('KP2400001-2-paatos.pdf');
  });
});
