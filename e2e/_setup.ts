
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
  username: process.env.taasiakasusername ?? "",
  email: process.env.taasiakasemail ?? "",
  phonenumber: process.env.taasiakasphonenumber ?? "",
  y_tunnus: process.env.taasiakasytunnus ?? ""
};

export const vastaava: TestUser = {
  username: process.env.tavastaavausername ?? "",
  email: process.env.tavastaavaemail ?? "",
  phonenumber: process.env.tavastaavaphonenumber ?? "",
  y_tunnus: process.env.tavastaavaytunnus ?? ""
};
export const suorittaja: TestUser = {
  username: process.env.tasuorittajausername ?? "",
  email: process.env.tasuorittajaemail ?? "",
  phonenumber: process.env.tasuorittajaphonenumber ?? "",
  y_tunnus: process.env.tasuorittajaytunnus ?? ""
};
export const rakennuttaja: TestUser = {
  username: process.env.tarakennuttajausername ?? "",
  email: process.env.tarakennuttajaemail ?? "",
  phonenumber: process.env.tarakennuttajaphonenumber ?? "",
  y_tunnus: process.env.tarakennuttajaytunnus ?? ""
};
export const asianhoitaja: TestUser = {
  username: process.env.taasianhoitajausername ?? "",
  email: process.env.taasianhoitajaemail ?? "",
  phonenumber: process.env.taasianhoitajaphonenumber ?? "",
  y_tunnus: process.env.taasianhoitajaytunnus ?? ""
};

export const testiData: HaitatonTestData = {
  testEnvUrl: process.env.tahaitatontesting ?? "",
  runtime: todayFull,
  today: today,
  todayFull: todayFull,
  todayDate: todayDate,
  tomorrow: tomorrow,
  currentMonth: currentMonth,
  allu_url: process.env.taallutesting ?? "",
  suomifilogin: process.env.tasuomifilogin ?? "",
  allupw : process.env.taallupw ?? ""
};

export const testiOsoite: Testiosoite = {
  address: process.env.taasiakasos1 ?? ""
};
