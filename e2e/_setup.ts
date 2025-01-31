
import { test, expect } from '@playwright/test';

const today: Date = new Date();
const todayFull: string = today.toISOString();
const todayDate: number = today.getDate()

const tomorrow: Date = new Date();
tomorrow.setDate(today.getDate() + 1);
const tommorowType = `${tomorrow.getDate()}.${tomorrow.getMonth() +1}.${tomorrow.getFullYear()}`
const currentMonth: string = today.toLocaleString('fi-FI', { month: "long" });

export async function tarkistaTulokset(page, hakemusLinkki, teksti) {
  await expect(async () => {
    await page.goto(hakemusLinkki);
    await page.getByText('Hakemukset').click();
    await expect(page.getByTestId('application-status-tag')).toBeVisible();
    await expect(page.getByTestId('application-status-tag')).toContainText(teksti, { timeout: 5000, });
  }).toPass({ intervals: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000], timeout: 120000, });
}


interface TestUser {
  username: string;
  email: string;
  phonenumber: string;
  y_tunnus: string
};

interface HaitatonTestData {
  testEnvUrl: string,
  runtime: string,
  today: Date,
  todayFull: string,
  todayDate: number,
  tomorrow: Date,
  currentMonth: string,
  allu_url: string,
  suomifilogin: string,
  allupw: string,
  hankesalkku: string,
  tomorrowType: string,
};

interface Testiosoite {
  address: string
};

export const perustaja: TestUser = {
  username: process.env.TA_ASIAKAS_USERNAME ?? "",
  email: process.env.TA_ASIAKAS_EMAIL ?? "",
  phonenumber: process.env.TA_ASIAKAS_PHONENUMBER ?? "",
  y_tunnus: process.env.TA_ASIAKAS_YTUNNUS ?? ""
};

export const vastaava: TestUser = {
  username: process.env.TA_VASTAAVA_USERNAME ?? "",
  email: process.env.TA_VASTAAVA_EMAIL ?? "",
  phonenumber: process.env.TA_VASTAAVA_PHONENUMBER ?? "",
  y_tunnus: process.env.TA_VASTAAVA_YTUNNUS ?? ""
};
export const suorittaja: TestUser = {
  username: process.env.TA_SUORITTAJA_USERNAME ?? "",
  email: process.env.TA_SUORITTAJA_EMAIL ?? "",
  phonenumber: process.env.TA_SUORITTAJA_PHONENUMBER ?? "",
  y_tunnus: process.env.TA_SUORITTAJA_YTUNNUS ?? ""
};
export const rakennuttaja: TestUser = {
  username: process.env.TA_RAKENNUTTAJA_USERNAME ?? "",
  email: process.env.TA_RAKENNUTTAJA_EMAIL ?? "",
  phonenumber: process.env.TA_RAKENNUTTAJA_PHONENUMBER ?? "",
  y_tunnus: process.env.TA_RAKENNUTTAJA_YTUNNUS ?? ""
};
export const asianhoitaja: TestUser = {
  username: process.env.TA_ASIANHOITAJA_USERNAME ?? "",
  email: process.env.TA_ASIANHOITAJA_EMAIL ?? "",
  phonenumber: process.env.TA_ASIANHOITAJAP_HONENUMBER ?? "",
  y_tunnus: process.env.TA_ASIANHOITAJA_YTUNNUS ?? ""
};

export const testiData: HaitatonTestData = {
  testEnvUrl: process.env.TA_HAITATON_TESTING ?? "",
  runtime: todayFull,
  today: today,
  todayFull: todayFull,
  todayDate: todayDate,
  tomorrow: tomorrow,
  currentMonth: currentMonth,
  allu_url: process.env.TA_ALLU_TESTING ?? "",
  suomifilogin: process.env.TA_SUOMIFI_LOGIN ?? "",
  allupw : process.env.TA_ALLU_PW ?? "",
  hankesalkku : process.env.TA_HAIT_TEST_HANKESALKKU ?? "",
  tomorrowType: tommorowType,
};

export const testiOsoite: Testiosoite = {
  address: process.env.TA_ASIAKAS_OS1 ?? ""
};
