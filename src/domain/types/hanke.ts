import { PartialExcept } from '../../common/types/utils';
import { HankeGeoJSON } from '../../common/types/hanke';
import { HaittaIndexData } from '../common/haittaIndexes/types';
import { Haittojenhallintasuunnitelma } from '../common/haittojenhallinta/types';

export enum HANKE_VAIHE {
  OHJELMOINTI = 'OHJELMOINTI',
  SUUNNITTELU = 'SUUNNITTELU',
  RAKENTAMINEN = 'RAKENTAMINEN',
}
export type HANKE_VAIHE_KEY = keyof typeof HANKE_VAIHE;

export enum HANKE_TYOMAATYYPPI {
  VESI = 'VESI',
  VIEMARI = 'VIEMARI',
  SADEVESI = 'SADEVESI',
  SAHKO = 'SAHKO',
  TIETOLIIKENNE = 'TIETOLIIKENNE',
  LIIKENNEVALO = 'LIIKENNEVALO',
  ULKOVALAISTUS = 'ULKOVALAISTUS',
  KAAPPITYO = 'KAAPPITYO',
  KAUKOLAMPO = 'KAUKOLAMPO',
  KAUKOKYLMA = 'KAUKOKYLMA',
  KAASUJOHTO = 'KAASUJOHTO',
  KISKOTYO = 'KISKOTYO',
  MUU = 'MUU',
  KADUNRAKENNUS = 'KADUNRAKENNUS',
  KADUN_KUNNOSSAPITO = 'KADUN_KUNNOSSAPITO',
  KIINTEISTOLIITTYMA = 'KIINTEISTOLIITTYMA',
  SULKU_TAI_KAIVO = 'SULKU_TAI_KAIVO',
  UUDISRAKENNUS = 'UUDISRAKENNUS',
  SANEERAUS = 'SANEERAUS',
  AKILLINEN_VIKAKORJAUS = 'AKILLINEN_VIKAKORJAUS',
  VIHERTYO = 'VIHERTYO',
  RUNKOLINJA = 'RUNKOLINJA',
  NOSTOTYO = 'NOSTOTYO',
  MUUTTO = 'MUUTTO',
  PYSAKKITYO = 'PYSAKKITYO',
  KIINTEISTOREMONTTI = 'KIINTEISTOREMONTTI',
  ULKOMAINOS = 'ULKOMAINOS',
  KUVAUKSET = 'KUVAUKSET',
  LUMENPUDOTUS = 'LUMENPUDOTUS',
  YLEISOTILAISUUS = 'YLEISOTILAISUUS',
  VAIHTOLAVA = 'VAIHTOLAVA',
}
export type HANKE_TYOMAATYYPPI_KEY = keyof typeof HANKE_TYOMAATYYPPI;

export enum HANKE_KAISTAHAITTA {
  EI_VAIKUTA = 'EI_VAIKUTA',
  YKSI_KAISTA_VAHENEE = 'YKSI_KAISTA_VAHENEE',
  YKSI_KAISTA_VAHENEE_KAHDELLA_AJOSUUNNALLA = 'YKSI_KAISTA_VAHENEE_KAHDELLA_AJOSUUNNALLA',
  USEITA_KAISTOJA_VAHENEE_AJOSUUNNILLA = 'USEITA_KAISTOJA_VAHENEE_AJOSUUNNILLA',
  YKSI_AJOSUUNTA_POISTUU_KAYTOSTA = 'YKSI_AJOSUUNTA_POISTUU_KAYTOSTA',
  USEITA_AJOSUUNTIA_POISTUU_KAYTOSTA = 'USEITA_AJOSUUNTIA_POISTUU_KAYTOSTA',
}
export type HANKE_KAISTAHAITTA_KEY = keyof typeof HANKE_KAISTAHAITTA;

export enum HANKE_KAISTAPITUUSHAITTA {
  EI_VAIKUTA_KAISTAJARJESTELYIHIN = 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
  PITUUS_ALLE_10_METRIA = 'PITUUS_ALLE_10_METRIA',
  PITUUS_10_99_METRIA = 'PITUUS_10_99_METRIA',
  PITUUS_100_499_METRIA = 'PITUUS_100_499_METRIA',
  PITUUS_500_METRIA_TAI_ENEMMAN = 'PITUUS_500_METRIA_TAI_ENEMMAN',
}
export type HANKE_KAISTAPITUUSHAITTA_KEY = keyof typeof HANKE_KAISTAPITUUSHAITTA;

export enum HANKE_MELUHAITTA {
  EI_MELUHAITTAA = 'EI_MELUHAITTAA',
  SATUNNAINEN_MELUHAITTA = 'SATUNNAINEN_MELUHAITTA',
  TOISTUVA_MELUHAITTA = 'TOISTUVA_MELUHAITTA',
  JATKUVA_MELUHAITTA = 'JATKUVA_MELUHAITTA',
}
export type HANKE_MELUHAITTA_KEY = keyof typeof HANKE_MELUHAITTA;

export enum HANKE_POLYHAITTA {
  EI_POLYHAITTAA = 'EI_POLYHAITTAA',
  SATUNNAINEN_POLYHAITTA = 'SATUNNAINEN_POLYHAITTA',
  TOISTUVA_POLYHAITTA = 'TOISTUVA_POLYHAITTA',
  JATKUVA_POLYHAITTA = 'JATKUVA_POLYHAITTA',
}
export type HANKE_POLYHAITTA_KEY = keyof typeof HANKE_POLYHAITTA;

export enum HANKE_TARINAHAITTA {
  EI_TARINAHAITTAA = 'EI_TARINAHAITTAA',
  SATUNNAINEN_TARINAHAITTA = 'SATUNNAINEN_TARINAHAITTA',
  TOISTUVA_TARINAHAITTA = 'TOISTUVA_TARINAHAITTA',
  JATKUVA_TARINAHAITTA = 'JATKUVA_TARINAHAITTA',
}
export type HANKE_TARINAHAITTA_KEY = keyof typeof HANKE_TARINAHAITTA;

export enum HANKE_CONTACT_TYPE {
  OMISTAJAT = 'omistajat',
  RAKENNUTTAJAT = 'rakennuttajat',
  TOTEUTTAJAT = 'toteuttajat',
  MUUTTAHOT = 'muut',
}
export type HankeContactTypeKey =
  | HANKE_CONTACT_TYPE.OMISTAJAT
  | HANKE_CONTACT_TYPE.RAKENNUTTAJAT
  | HANKE_CONTACT_TYPE.TOTEUTTAJAT
  | HANKE_CONTACT_TYPE.MUUTTAHOT;

export interface HankeYhteyshenkilo {
  id: string;
  etunimi: string;
  sukunimi: string;
  sahkoposti: string;
  puhelinnumero: string;
}

export interface HankeYhteystieto {
  id?: number | null;
  tyyppi: keyof typeof CONTACT_TYYPPI | null;
  nimi: string;
  email: string;
  puhelinnumero: string;
  ytunnus: string | null;
  yhteyshenkilot?: HankeYhteyshenkilo[];
}

export type HankeMuuTaho = {
  rooli: string;
  nimi: string;
  organisaatioNimi: string;
  osasto: string;
  email: string;
  puhelinnumero?: string;
  yhteyshenkilot?: HankeYhteyshenkilo[];
};

export type HankeContacts = Array<(HankeYhteystieto | HankeMuuTaho)[] | undefined>;

export function isHankeContact(
  contact: HankeYhteystieto | HankeMuuTaho,
): contact is HankeYhteystieto {
  return (contact as HankeYhteystieto).ytunnus !== undefined;
}

export enum CONTACT_TYYPPI {
  YKSITYISHENKILO = 'YKSITYISHENKILO',
  YRITYS = 'YRITYS',
  YHTEISO = 'YHTEISO',
}

export type HankeGeometria = {
  featureCollection: HankeGeoJSON;
  id?: number;
  modifiedAt?: string | null;
  version?: number | null;
  createdByUserId?: string | null;
  createdAt?: string | null;
  modifiedByUserId?: string | null;
};

export type HankeAlue = {
  id: number | null;
  hankeId?: number;
  geometriat?: HankeGeometria;
  haittaAlkuPvm: Date | null;
  haittaLoppuPvm: Date | null;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY | null;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY | null;
  meluHaitta: HANKE_MELUHAITTA_KEY | null;
  polyHaitta: HANKE_POLYHAITTA_KEY | null;
  tarinaHaitta: HANKE_TARINAHAITTA_KEY | null;
  nimi?: string | null;
  tormaystarkasteluTulos?: HaittaIndexData | null;
  haittojenhallintasuunnitelma?: Haittojenhallintasuunnitelma;
};

enum HANKE_STATUS {
  DRAFT = 'DRAFT',
  PUBLIC = 'PUBLIC',
  ENDED = 'ENDED',
}

export type HANKE_STATUS_KEY = keyof typeof HANKE_STATUS;

export interface HankeData {
  id: number;
  hankeTunnus: string;
  onYKTHanke: boolean | null;
  nimi: string;
  kuvaus: string | null;
  alkuPvm: string | null;
  loppuPvm: string | null;
  vaihe: HANKE_VAIHE_KEY | null;
  tyomaaKatuosoite: string | null;
  tyomaaTyyppi: HANKE_TYOMAATYYPPI_KEY[];
  alueet: HankeAlue[];
  omistajat: Array<HankeYhteystieto>;
  rakennuttajat: Array<HankeYhteystieto>;
  toteuttajat: Array<HankeYhteystieto>;
  muut: Array<HankeMuuTaho>;
  tormaystarkasteluTulos: HaittaIndexData | null;
  status: HANKE_STATUS_KEY;
  version?: number;
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: null | string;
  modifiedAt?: null | string;
  generated?: boolean;
}

type DraftRequiredFields = 'nimi' | 'kuvaus' | 'vaihe';

export type HankeDataDraft = PartialExcept<HankeData, DraftRequiredFields>;

export interface PublicHanke {
  id: number;
  hankeTunnus: string;
  nimi: string;
  kuvaus: string | null;
  alkuPvm: string | null;
  loppuPvm: string | null;
  vaihe: HANKE_VAIHE_KEY | null;
  tyomaaTyyppi: HANKE_TYOMAATYYPPI_KEY[];
  omistajat: Array<PublicHankeYhteystieto>;
  alueet: PublicHankeAlue[];
}

interface PublicHankeYhteystieto {
  organisaatioNimi?: string | null;
}

type PublicHankeAlue = {
  id: number | null;
  hankeId: number | null;
  haittaAlkuPvm: Date | null;
  haittaLoppuPvm: Date | null;
  geometriat?: HankeGeometria;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY | null;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY | null;
  meluHaitta: HANKE_MELUHAITTA_KEY | null;
  polyHaitta: HANKE_POLYHAITTA_KEY | null;
  tarinaHaitta: HANKE_TARINAHAITTA_KEY | null;
  nimi: string;
  tormaystarkastelu?: HaittaIndexData | null;
};

function toHankeAlue(alue: PublicHankeAlue): HankeAlue {
  return {
    id: alue.id,
    hankeId: alue.hankeId ?? undefined,
    haittaAlkuPvm: alue.haittaAlkuPvm,
    haittaLoppuPvm: alue.haittaLoppuPvm,
    geometriat: alue.geometriat,
    kaistaHaitta: alue.kaistaHaitta,
    kaistaPituusHaitta: alue.kaistaPituusHaitta,
    meluHaitta: alue.meluHaitta,
    polyHaitta: alue.polyHaitta,
    tarinaHaitta: alue.tarinaHaitta,
    nimi: alue.nimi,
    tormaystarkasteluTulos: alue.tormaystarkastelu,
  };
}

export function toHankeData(publicHanke: PublicHanke): HankeData {
  return {
    id: publicHanke.id,
    hankeTunnus: publicHanke.hankeTunnus,
    onYKTHanke: null,
    nimi: publicHanke.nimi,
    kuvaus: publicHanke.kuvaus,
    alkuPvm: publicHanke.alkuPvm,
    loppuPvm: publicHanke.loppuPvm,
    vaihe: publicHanke.vaihe,
    tyomaaKatuosoite: null,
    tyomaaTyyppi: publicHanke.tyomaaTyyppi,
    alueet: publicHanke.alueet.map(toHankeAlue),
    omistajat: [
      {
        id: 0,
        tyyppi: null,
        nimi: publicHanke.omistajat[0]?.organisaatioNimi ?? '',
        email: '',
        puhelinnumero: '',
        ytunnus: null,
      },
    ],
    rakennuttajat: [],
    toteuttajat: [],
    muut: [],
    tormaystarkasteluTulos: null,
    status: HANKE_STATUS.PUBLIC,
  };
}
