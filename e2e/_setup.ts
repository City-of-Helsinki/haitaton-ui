import { expect, Page } from '@playwright/test';

const today: Date = new Date();
const todayFull: string = today.toISOString();
const todayDate: number = today.getDate();

const tomorrow: Date = new Date();
tomorrow.setDate(today.getDate() + 1);
const tommorowType = `${tomorrow.getDate()}.${tomorrow.getMonth() + 1}.${tomorrow.getFullYear()}`;
const currentMonth: string = today.toLocaleString('fi-FI', { month: 'long' });

export const testiData: HaitatonTestData = {
  testEnvUrl: process.env.TA_HAITATON_TESTING ?? '',
  runtime: todayFull,
  today: today,
  todayFull: todayFull,
  todayDate: todayDate,
  tomorrow: tomorrow,
  currentMonth: currentMonth,
  allu_url: process.env.TA_ALLU_TESTING ?? '',
  suomifilogin: process.env.TA_SUOMIFI_LOGIN ?? '',
  allupw: process.env.TA_ALLU_PW ?? '',
  hankesalkku: process.env.TA_HAIT_TEST_HANKESALKKU ?? '',
  alluTriggerUrl: process.env.TA_ALLU_TRIGGER ?? '',
  tomorrowType: tommorowType,
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
  return `TA-${testName}-${todayFull}-${idGenerator(1)}`;
}

interface TestUser {
  username: string;
  email: string;
  phonenumber: string;
  y_tunnus: string;
}

interface HaitatonTestData {
  testEnvUrl: string;
  runtime: string;
  today: Date;
  todayFull: string;
  todayDate: number;
  tomorrow: Date;
  currentMonth: string;
  allu_url: string;
  suomifilogin: string;
  allupw: string;
  hankesalkku: string;
  alluTriggerUrl: string;
  tomorrowType: string;
}

interface Testiosoite {
  address: string;
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

export async function helsinkiLogin(page: Page, env = testiData.testEnvUrl) {
  await page.goto(env);
  await expect(page.getByRole('heading', { name: 'Tervetuloa Haitaton-palveluun' })).toBeVisible();
  await page.getByRole('button', { name: 'Hyväksy kaikki evästeet' }).click();
  await expect(page.getByText('Haitaton käyttää evästeitä')).not.toBeVisible();
  await page.getByLabel('Kirjaudu').click();
  await page.getByText('Suomi.fi-tunnistautuminen').click();
  await expect(page.getByText('Testitunnistaja')).toBeVisible();
  await page.getByText('Testitunnistaja').click();
  await expect(page.getByPlaceholder('-9988')).toBeVisible();
  await page.getByPlaceholder('-9988').fill(testiData.suomifilogin);
  await page.getByPlaceholder('-9988').press('Tab');
  await page.getByRole('button', { name: 'Tunnistaudu' }).click();
  await expect(page.getByText('Jatka palveluun')).toBeVisible();
  await page.getByText('Jatka palveluun').click();
  await expect(page.getByLabel('Tee johtoselvityshakemus.', { exact: true })).toBeVisible({
    timeout: 20000,
  });
}
