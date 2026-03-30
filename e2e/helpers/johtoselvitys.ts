import { expect, Page } from '@playwright/test';
import {
  perustaja,
  vastaava,
  suorittaja,
  testiOsoite,
  testiData,
  daysFromTodayDate,
  monthAndDayFromTodayDate,
} from './test-data';
import { nextAndCloseToast } from './auth';

export async function createAndFillJohtoselvityshakemusForm(page: Page, nimi: string) {
  await page.getByLabel('Asiointi yksityisellä alueella.', { exact: true }).click();
  await page.getByTestId('perustaja.sahkoposti').fill(perustaja.email);
  await page.getByTestId('perustaja.puhelinnumero').click();
  await page.getByTestId('perustaja.puhelinnumero').fill(perustaja.phonenumber);
  await page.getByTestId('nimi').click();
  await page.getByTestId('nimi').fill(nimi);
  await page.getByRole('button', { name: 'Luo hakemus' }).click();
  await page.getByTestId('applicationData.postalAddress.streetAddress.streetName').click();
  await page
    .getByTestId('applicationData.postalAddress.streetAddress.streetName')
    .fill(testiOsoite.address);
  await expect(page.getByTestId('save-form-btn')).toBeVisible();
  await page.getByLabel('Uuden rakenteen tai johdon').check();
  await page.getByText('Kyllä').click();
  await page.getByLabel('Työn kuvaus*').click();
  await page.getByLabel('Työn kuvaus*').fill(`Testiautomaatio ${testiData.runtime}`);
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');

  await page.getByLabel('Valitse päivämäärä').first().click();
  await page.getByRole('button', { name: monthAndDayFromTodayDate(0), exact: true }).click();
  await page.getByLabel('Työn arvioitu loppupäivä*').fill(daysFromTodayDate(7));

  // Piirrä työalue
  await page.getByTestId('draw-control-Polygon').click();
  await page
    .locator('canvas')
    .first()
    .click({ position: { x: 454, y: 221 } });
  await page
    .locator('canvas')
    .first()
    .click({ position: { x: 543, y: 221 } });
  await page
    .locator('canvas')
    .first()
    .click({ position: { x: 454, y: 289 } });
  await page
    .locator('canvas')
    .first()
    .click({ position: { x: 454, y: 221 } });
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');

  // Täytä hakijoiden tiedot
  await page.locator('[id="applicationData\\.customerWithContacts\\.customer\\.name"]').click();
  await page
    .locator('[id="applicationData\\.customerWithContacts\\.customer\\.name"]')
    .fill(vastaava.username);
  await page
    .getByTestId('applicationData.customerWithContacts.customer.registryKey')
    .fill(vastaava.y_tunnus);
  await page.getByTestId('applicationData.customerWithContacts.customer.email').click();
  await page
    .getByTestId('applicationData.customerWithContacts.customer.email')
    .fill(vastaava.email);
  await page
    .getByTestId('applicationData.customerWithContacts.customer.phone')
    .fill(vastaava.phonenumber);
  await page
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .first()
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .first()
    .click();
  await page.locator('[id="applicationData\\.contractorWithContacts\\.customer\\.name"]').click();
  await page
    .locator('[id="applicationData\\.contractorWithContacts\\.customer\\.name"]')
    .fill(suorittaja.username);
  await page
    .getByTestId('applicationData.contractorWithContacts.customer.registryKey')
    .fill(suorittaja.y_tunnus);
  await page.getByTestId('applicationData.contractorWithContacts.customer.email').click();
  await page
    .getByTestId('applicationData.contractorWithContacts.customer.email')
    .fill(suorittaja.email);
  await page
    .getByTestId('applicationData.contractorWithContacts.customer.phone')
    .fill(suorittaja.phonenumber);
  await page
    .getByRole('region', { name: 'Työn suorittajan tiedot' })
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page
    .getByRole('region', { name: 'Työn suorittajan tiedot' })
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .click();
  await expect(page.getByRole('button', { name: 'Peru hakemus' })).toBeVisible();
  await page.getByRole('button', { name: 'Seuraava' }).waitFor();

  // Workaround chromium selaimelle
  await expect(async () => {
    await page.getByRole('button', { name: 'Seuraava' }).click();
    await expect(page.getByText('Vaihe 4/5: Liitteet')).toBeVisible();
  }).toPass({ intervals: [2000, 2000, 2000, 2000, 2000], timeout: 12000 });

  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
}
