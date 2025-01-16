
import { test, expect } from '@playwright/test';

const today: Date = new Date();
const todayFull: string = today.toISOString();
const todayDate: number = today.getDate()

const tomorrow: Date = new Date(today);
tomorrow.setDate(today.getDate() + 1);
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
  allupw: string
};

interface Testiosoite {
  address: string
};

export const perustaja: TestUser = {
  username: process.env.TAASIAKASUSERNAME ?? "",
  email: process.env.TAASIAKASEMAIL ?? "",
  phonenumber: process.env.TAASIAKASPHONENUMBER ?? "",
  y_tunnus: process.env.TAASIAKASYTUNNUS ?? ""
};

export const vastaava: TestUser = {
  username: process.env.TAVASTAAVAUSERNAME ?? "",
  email: process.env.TAVASTAAVAEMAIL ?? "",
  phonenumber: process.env.TAVASTAAVAPHONENUMBER ?? "",
  y_tunnus: process.env.TAVASTAAVAYTUNNUS ?? ""
};
export const suorittaja: TestUser = {
  username: process.env.TASUORITTAJAUSERNAME ?? "",
  email: process.env.TASUORITTAJAEMAIL ?? "",
  phonenumber: process.env.TASUORITTAJAPHONENUMBER ?? "",
  y_tunnus: process.env.TASUORITTAJAYTUNNUS ?? ""
};
export const rakennuttaja: TestUser = {
  username: process.env.TARAKENNUTTAJAUSERNAME ?? "",
  email: process.env.TARAKENNUTTAJAEMAIL ?? "",
  phonenumber: process.env.TARAKENNUTTAJAPHONENUMBER ?? "",
  y_tunnus: process.env.TARAKENNUTTAJAYTUNNUS ?? ""
};
export const asianhoitaja: TestUser = {
  username: process.env.TAASIANHOITAJAUSERNAME ?? "",
  email: process.env.TAASIANHOITAJAEMAIL ?? "",
  phonenumber: process.env.TAASIANHOITAJAPHONENUMBER ?? "",
  y_tunnus: process.env.TAASIANHOITAJAYTUNNUS ?? ""
};

export const testiData: HaitatonTestData = {
  testEnvUrl: process.env.TAHAITATONTESTING ?? "",
  runtime: todayFull,
  today: today,
  todayFull: todayFull,
  todayDate: todayDate,
  tomorrow: tomorrow,
  currentMonth: currentMonth,
  allu_url: process.env.TAALLUTESTING ?? "",
  suomifilogin: process.env.TASUOMIFILOGIN ?? "",
  allupw : process.env.TAALLUPW ?? ""
};

export const testiOsoite: Testiosoite = {
  address: process.env.TAASIAKASOS1 ?? ""
};
