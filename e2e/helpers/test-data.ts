const today = new Date();

export function fullDate(): string {
  return today.toISOString();
}

export function daysFromTodayDate(days: number): string {
  const date: Date = new Date(today);
  date.setDate(date.getDate() + days);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export function monthAndDayFromTodayDate(days: number): string {
  const date: Date = new Date(today);
  date.setDate(date.getDate() + days);
  return `${date.toLocaleString('fi-FI', { month: 'long' })} ${date.getDate()}`;
}

export interface TestUser {
  username: string;
  email: string;
  phonenumber: string;
  y_tunnus: string;
}

export interface HaitatonTestData {
  testEnvUrl: string;
  runtime: string;
  allu_login: string;
  allu_home: string;
  suomifilogin: string;
  allupw: string;
  hankesalkku: string;
  alluTriggerUrl: string;
}

export interface Testiosoite {
  address: string;
}

export const testiData: HaitatonTestData = {
  testEnvUrl: process.env.TA_HAITATON_TESTING ?? '',
  runtime: fullDate(),
  allu_login: process.env.TA_ALLU_LOGIN ?? '',
  allu_home: process.env.TA_ALLU_HOME ?? '',
  suomifilogin: process.env.TA_SUOMIFI_LOGIN ?? '',
  allupw: process.env.TA_ALLU_PW ?? '',
  hankesalkku: process.env.TA_HAIT_TEST_HANKESALKKU ?? '',
  alluTriggerUrl: process.env.TA_ALLU_TRIGGER ?? '',
};

export function idGenerator(length: number) {
  const words = [
    'Alfa',
    'Bravo',
    'Charlie',
    'Delta',
    'Echo',
    'Foxtrot',
    'Golf',
    'Hotel',
    'India',
    'Juliett',
    'Kilo',
    'Lima',
    'Mike',
    'November',
    'Oscar',
    'Papa',
    'Quebec',
    'Romeo',
    'Sierra',
    'Tango',
    'Uniform',
    'Victor',
    'Whiskey',
    'X-ray',
    'Yankee',
    'Zulu',
  ];

  return [...Array(length)]
    .map(() => Math.floor(Math.random() * words.length))
    .map((i) => words[i])
    .join('-');
}

export function hankeName(testName: string) {
  return `TA-${testName}-${testiData.runtime}-${idGenerator(1)}`;
}

export const perustaja: TestUser = {
  username: process.env.TA_ASIAKAS_USERNAME ?? '',
  email: process.env.TA_ASIAKAS_EMAIL ?? '',
  phonenumber: process.env.TA_ASIAKAS_PHONENUMBER ?? '',
  y_tunnus: process.env.TA_ASIAKAS_YTUNNUS ?? '',
};

export const vastaava: TestUser = {
  username: process.env.TA_VASTAAVA_USERNAME ?? '',
  email: process.env.TA_VASTAAVA_EMAIL ?? '',
  phonenumber: process.env.TA_VASTAAVA_PHONENUMBER ?? '',
  y_tunnus: process.env.TA_VASTAAVA_YTUNNUS ?? '',
};

export const suorittaja: TestUser = {
  username: process.env.TA_SUORITTAJA_USERNAME ?? '',
  email: process.env.TA_SUORITTAJA_EMAIL ?? '',
  phonenumber: process.env.TA_SUORITTAJA_PHONENUMBER ?? '',
  y_tunnus: process.env.TA_SUORITTAJA_YTUNNUS ?? '',
};

export const rakennuttaja: TestUser = {
  username: process.env.TA_RAKENNUTTAJA_USERNAME ?? '',
  email: process.env.TA_RAKENNUTTAJA_EMAIL ?? '',
  phonenumber: process.env.TA_RAKENNUTTAJA_PHONENUMBER ?? '',
  y_tunnus: process.env.TA_RAKENNUTTAJA_YTUNNUS ?? '',
};

export const asianhoitaja: TestUser = {
  username: process.env.TA_ASIANHOITAJA_USERNAME ?? '',
  email: process.env.TA_ASIANHOITAJA_EMAIL ?? '',
  phonenumber: process.env.TA_ASIANHOITAJAP_HONENUMBER ?? '',
  y_tunnus: process.env.TA_ASIANHOITAJA_YTUNNUS ?? '',
};

export const testiOsoite: Testiosoite = {
  address: process.env.TA_ASIAKAS_OS1 ?? '',
};
