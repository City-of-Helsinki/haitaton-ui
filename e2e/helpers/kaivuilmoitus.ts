import { expect, Page } from '@playwright/test';
import {
  perustaja,
  vastaava,
  suorittaja,
  asianhoitaja,
  daysFromTodayDate,
  monthAndDayFromTodayDate,
} from './test-data';
import { nextAndCloseToast } from './auth';

export async function createAndFillKaivuilmoitusForm(page: Page, nimi: string) {
  await page.getByRole('combobox', { name: 'Hakemustyyppi' }).click();
  await page.getByRole('option', { name: 'Kaivuilmoitus (ja' }).click();
  await page.getByRole('button', { name: 'Luo hakemus' }).click();
  await page.getByTestId('applicationData.name').fill(nimi);
  await page.getByLabel('Työn kuvaus*').fill('Työn kuvaus');
  await page.getByLabel('Uuden rakenteen tai johdon').check();
  await page.getByText('Hae uusi johtoselvitys').click();
  await page.locator('label[for="rockExcavationNo"]').click();
  await page.getByPlaceholder('SLXXXXXXX').fill('SL1111111');
  await page.getByTestId('placementContract-addButton').click();

  await page.getByTestId('applicationData.requiredCompetence').check();
  await nextAndCloseToast(page, 'Seuraava', 'Hakemus tallennettu');
  await page.getByLabel('Valitse päivämäärä').first().click();
  await page.getByRole('button', { name: monthAndDayFromTodayDate(-7), exact: true }).click();
  await page.getByLabel('Työn loppupäivämäärä*').fill(daysFromTodayDate(7));
  await page
    .locator('canvas')
    .nth(1)
    .click({
      position: {
        x: 552,
        y: 216,
      },
    });
  await page.getByRole('button', { name: 'Kopioi työalueeksi' }).click();
  await expect(page.getByTestId('applicationData.areas.0.katuosoite')).toBeVisible();
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.YLEINEN').focus();
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.YLEINEN')
    .fill('Hankealue 1 Haittojenhallintasuunnitelma');
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE')
    .focus();
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE')
    .fill('Raitioliikennesuunnitelma');
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.PYORALIIKENNE')
    .focus();
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.PYORALIIKENNE')
    .fill('Pyöräliikenteensuunnitelma');
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.AUTOLIIKENNE')
    .focus();
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.AUTOLIIKENNE')
    .fill('Autoliikenteensuunnitelma');
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE')
    .focus();
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE')
    .fill('Linjaautoliikennesuunnitelma');
  await page.getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.MUUT').focus();
  await page
    .getByTestId('applicationData.areas.0.haittojenhallintasuunnitelma.MUUT')
    .fill('Muut haittojenhallinta suunnitelmat');
  await page.getByRole('button', { name: 'Seuraava' }).focus();
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page
    .locator('[id="applicationData\\.customerWithContacts\\.customer\\.name"]')
    .fill(vastaava.username);
  await page
    .getByTestId('applicationData.customerWithContacts.customer.registryKey')
    .fill(vastaava.y_tunnus);
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
    .locator('[id="applicationData\\.contractorWithContacts\\.customer\\.name"]')
    .fill(suorittaja.username);
  await page
    .getByTestId('applicationData.contractorWithContacts.customer.registryKey')
    .fill(suorittaja.y_tunnus);
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
  await page.getByTestId('applicationData.invoicingCustomer.name').fill(asianhoitaja.username);
  await page
    .getByTestId('applicationData.invoicingCustomer.registryKey')
    .fill(asianhoitaja.y_tunnus);
  await page.getByTestId('applicationData.invoicingCustomer.invoicingOperator').click();
  await page.getByTestId('applicationData.invoicingCustomer.ovt').click();
  await page.getByTestId('applicationData.invoicingCustomer.ovt').fill('0000000000000');
  await page.getByTestId('applicationData.invoicingCustomer.invoicingOperator').fill('1');
  await page.getByRole('button', { name: 'Seuraava' }).click();
  await page.getByRole('button', { name: 'Seuraava' }).click();
}

export async function ilmoitaKaivuilmoitusValmiiksi(page: Page) {
  await page.getByRole('button', { name: 'Ilmoita valmiiksi' }).click();
  await page.getByLabel('Päivämäärä*').click();
  await page.getByLabel('Päivämäärä*').fill(daysFromTodayDate(-2));
  await page.getByRole('button', { name: 'Vahvista' }).click();
  await expect(page.getByText('Ilmoitus lähetetty')).toBeVisible();
  await expect(page.getByText('Ilmoitus valmistumisesta on l')).toBeVisible();
  await expect(page.getByText('Ilmoitettu valmiiksi')).toBeVisible();
}
