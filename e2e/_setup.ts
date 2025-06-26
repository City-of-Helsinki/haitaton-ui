import { expect, Page } from '@playwright/test';
import { DRAWTOOLTYPE } from '../src/common/components/map/modules/draw/types';

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

export const testiData: HaitatonTestData = {
  testEnvUrl: process.env.TA_HAITATON_TESTING ?? '',
  runtime: fullDate(),
  allu_url: process.env.TA_ALLU_TESTING ?? '',
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

interface TestUser {
  username: string;
  email: string;
  phonenumber: string;
  y_tunnus: string;
}

interface HaitatonTestData {
  testEnvUrl: string;
  runtime: string;
  allu_url: string;
  suomifilogin: string;
  allupw: string;
  hankesalkku: string;
  alluTriggerUrl: string;
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
  await expect(page.getByLabel('Asiointi yksityisellä alueella.', { exact: true })).toBeVisible({
    timeout: 20000,
  });
}

export async function nextAndCloseToast(
  page: Page,
  nextButtonName: string,
  toastText: string,
  opts?: {
    networkIdleTimeout?: number;
    visibleTimeout?: number;
    closeTimeout?: number;
    hiddenTimeout?: number;
  },
) {
  const {
    networkIdleTimeout = 30_000,
    visibleTimeout = 10_000,
    closeTimeout = 10_000,
    hiddenTimeout = 20_000,
  } = opts ?? {};

  // 1. click “Next” and wait for network‐idle
  await Promise.all([
    page.waitForLoadState('networkidle', { timeout: networkIdleTimeout }),
    page.getByRole('button', { name: nextButtonName }).click(),
  ]);

  // 2. look up the toast (scoped and retrying)
  const toast = page.locator('role=alert', { hasText: toastText });

  // 3. wait for it to appear
  await expect(toast).toBeVisible({ timeout: visibleTimeout });

  // 4a) find the close button inside the toast
  const closeButton = toast.getByRole('button', { name: 'Close toast', exact: true });

  // 4b) wait until it’s actually visible (or time out quickly if it never is)
  try {
    await expect(closeButton).toBeVisible({ timeout: closeTimeout });
    await closeButton.click();
  } catch (e) {
    // if it never became visible, assume the toast auto-dismissed itself
  }

  // 5) no matter what, ensure the toast is gone before moving on
  await expect(toast).toBeHidden({ timeout: hiddenTimeout });
}

export async function createAndFillHankeForm(
  page: Page,
  nimi: string,
  drawTool: DRAWTOOLTYPE = DRAWTOOLTYPE.SQUARE,
) {
  await page.getByLabel('Asiointi yleisellä alueella.', { exact: true }).click();
  await page.getByTestId('nimi').fill(nimi);
  await page.getByTestId('perustaja.sahkoposti').fill(perustaja.email);
  await page.getByTestId('perustaja.puhelinnumero').fill(perustaja.phonenumber);
  await page.getByRole('button', { name: 'Luo hanke' }).click();
  await page.getByTestId('kuvaus').click();
  await page.getByTestId('kuvaus').fill(`${nimi} Tämä on testiautomaatiota varten luotu`);
  await page.getByTestId('tyomaaKatuosoite').click();
  await page.getByTestId('tyomaaKatuosoite').fill(testiOsoite.address);
  await page.getByText('Ohjelmointi').click();
  await page.getByRole('button', { name: /Työn tyyppi/ }).click();
  await page.getByRole('option', { name: /Vesi/ }).click();
  await page.getByRole('button', { name: /Työn tyyppi/ }).click();
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');

  await page.getByTestId(`draw-control-${drawTool}`).click();
  if (drawTool === DRAWTOOLTYPE.SQUARE) {
    await page
      .locator('canvas')
      .first()
      .click({
        position: {
          x: 203,
          y: 441,
        },
      });
    await page
      .locator('canvas')
      .first()
      .click({
        position: {
          x: 577,
          y: 179,
        },
      });
  } else {
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
  }
  await page.getByLabel('Haittojen alkupäivä*').first().fill(daysFromTodayDate(-7));
  await page.getByLabel('Haittojen alkupäivä*').first().press('Enter');
  await page.getByLabel('Haittojen loppupäivä*').click();
  await page.getByLabel('Haittojen loppupäivä*').fill(daysFromTodayDate(7));
  await page.getByRole('combobox', { name: /Meluhaitta/ }).click();
  await page.getByRole('option', { name: 'Satunnainen meluhaitta' }).click();
  await page.getByRole('combobox', { name: /Pölyhaitta/ }).click();
  await page.getByRole('option', { name: 'Satunnainen pölyhaitta' }).click();
  await page.getByRole('combobox', { name: /Tärinähaitta/ }).click();
  await page.getByRole('option', { name: 'Satunnainen tärinähaitta' }).click();
  await page.getByRole('combobox', { name: /Autoliikenteen kaistahaitta/ }).click();
  await page.getByRole('option', { name: 'Yksi autokaista vähenee -' }).click();
  await page.getByRole('combobox', { name: /Kaistahaittojen pituus/ }).click();
  await page.getByRole('option', { name: 'Alle 10 m' }).click();
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');

  let count = await page.getByText(/Lisää toimet haittojen hallintaan/).count();
  while (count > 0) {
    await page
      .getByText(/Lisää toimet haittojen hallintaan/)
      .first()
      .click();
    count -= 1;
  }

  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.YLEINEN')
    .fill('testiautomaatio toimet hankealue1');
  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.RAITIOLIIKENNE')
    .fill('testiautomaatiotoimet raitioliikenne');
  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.PYORALIIKENNE')
    .fill('testiautomaatiotoimet pyöräliikenne');
  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.AUTOLIIKENNE')
    .fill('testiautomaatiotoimet autoliikenne');
  await page.getByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE').focus();
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.LINJAAUTOLIIKENNE')
    .fill('testiautomaatiotoimet linjaautoliikenne');
  await page
    .getByTestId('alueet.0.haittojenhallintasuunnitelma.MUUT')
    .fill('testiautomaatiotoimet bussiliikenne');
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');

  await page.getByRole('combobox', { name: 'Nimi *' }).click();
  await page.getByRole('combobox', { name: 'Nimi *' }).fill(perustaja.username);
  await page.getByTestId('omistajat.0.ytunnus').fill(perustaja.y_tunnus);
  await page.getByTestId('omistajat.0.email').fill(perustaja.email);
  await page.getByTestId('omistajat.0.puhelinnumero').fill(perustaja.phonenumber);
  await page.getByRole('button', { name: /Yhteyshenkilöt/ }).click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.getByRole('button', { name: 'Lisää rakennuttaja' }).click();
  await page.locator('[id="rakennuttajat\\.0\\.nimi"]').fill(rakennuttaja.username);
  await page.getByTestId('rakennuttajat.0.ytunnus').fill(rakennuttaja.y_tunnus);
  await page.getByTestId('rakennuttajat.0.email').fill(rakennuttaja.email);
  await page.getByTestId('rakennuttajat.0.puhelinnumero').fill(rakennuttaja.phonenumber);
  await page
    .getByRole('region', { name: 'Rakennuttajan tiedot' })
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await page.getByRole('button', { name: 'Lisää toteuttaja' }).click();
  await page.locator('[id="toteuttajat\\.0\\.nimi"]').fill(suorittaja.username);
  await page.getByTestId('toteuttajat.0.ytunnus').fill(suorittaja.y_tunnus);
  await page.getByTestId('toteuttajat.0.email').fill(suorittaja.email);
  await page.getByTestId('toteuttajat.0.puhelinnumero').fill(suorittaja.phonenumber);
  await page
    .getByRole('region', { name: 'Toteuttajan tiedot' })
    .getByRole('button', { name: /Yhteyshenkilöt/ })
    .click();
  await page.getByRole('option', { name: `${perustaja.username}` }).click();
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');
  await nextAndCloseToast(page, 'Seuraava', 'Hanke tallennettu');
}

// Helper to assert application status text
export async function expectApplicationStatus(
  page: Page,
  applicationId: string,
  expectedStatus: string,
  timeout = 15_000,
) {
  // wait for the page to load
  await page.waitForLoadState('networkidle');
  // figure out which view we’re on by looking at the path
  const path = new URL(page.url()).pathname;

  if (path.match(/^\/fi\/hakemus\/\d+/)) {
    // ---- detail page: there's just one status tag on the page ----
    const statusTag = page.getByTestId('application-status-tag');
    await expect(statusTag).toBeVisible();
    await expect(statusTag).toContainText(expectedStatus);
  } else {
    // ---- list page: find the card that contains our application ----
    const identifier = page.getByTestId(`applicationViewLinkIdentifier-${applicationId}`);
    await identifier.waitFor({ timeout });

    const card = page.locator('div[role="region"][data-testid="application-card"]', {
      has: identifier,
    });
    await expect(card).toBeVisible();

    const statusTag = card.getByTestId('application-status-tag');
    await expect(statusTag).toContainText(expectedStatus);
  }
}

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

export async function createAndFillKaivuilmoitusForm(page: Page, nimi: string) {
  await page.getByRole('combobox', { name: 'Hakemustyyppi' }).click();
  await page.getByRole('option', { name: 'Kaivuilmoitus (ja' }).click();
  await page.getByRole('button', { name: 'Luo hakemus' }).click();
  await page.getByTestId('applicationData.name').fill(nimi);
  await page.getByLabel('Työn kuvaus*').fill('Työn kuvaus');
  await page.getByLabel('Uuden rakenteen tai johdon').check();
  await page.getByText('Hae uusi johtoselvitys').click();
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

export async function hyvaksyKaivuilmoitusToiminnalliseenKuntoon(
  page: Page,
  kaivuilmoitus: string,
) {
  await page.goto(testiData.allu_url);
  await expect(page.getByPlaceholder('Username')).toBeEmpty();
  await page.getByPlaceholder('Username').fill(testiData.allupw);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();
  await page.getByRole('button', { name: 'HAE' }).click();
  await expect(page.getByRole('link', { name: `${kaivuilmoitus}` })).toBeVisible({
    timeout: 20000,
  });
  await page.getByRole('link', { name: `${kaivuilmoitus}` }).click();
  await page.getByRole('link', { name: 'Historia' }).click();
  await page.locator('.mat-slide-toggle-thumb').click();
  await expect(page.getByText('Asiakkaan ilmoittama talvityö')).toBeVisible();
  await expect(page.getByText('Toiminnallisen kunnon ilmoituspäivä')).toBeVisible();
  await page.getByRole('link', { name: 'Valvonta (3)' }).click();
  await page.getByRole('button', { name: 'OMAKSI' }).first().click();
  await page.getByRole('button', { name: 'HYVÄKSY' }).click();
  await page.getByLabel('Valvojan merkinnät *').click();
  await page.getByLabel('Valvojan merkinnät *').fill('Testiautomaatiomerkinnät');
  await page.getByRole('button', { name: 'EHDOTA PÄÄTETTÄVÄKSI' }).click();
  await page.getByLabel('Perustelut *').click();
  await page.getByLabel('Perustelut *').fill('Hyväksytty toiminnalliseen kuntoon');
  await page.getByLabel('Valitse päättäjä').getByText('Valitse päättäjä').click();
  await page.getByText('Allu Päättäjä').click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await expect(page.getByText('MUOKKAA POISTA OMAKSI').first()).toBeVisible();
  await page.getByRole('link', { name: 'Perustiedot' }).click();
  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await page.getByRole('link', { name: 'Toiminnallinen kunto' }).click();
  await page.getByRole('button', { name: 'HYVÄKSY' }).click();
  await page.getByRole('button', { name: 'HYVÄKSY' }).click();
}

export async function hyvaksyKaivuilmoitusValmiiksi(page: Page, kaivuilmoitus: string) {
  await page.goto(testiData.allu_url);
  await page.getByPlaceholder('Username').fill(testiData.allupw);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
  await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();
  await page.getByRole('button', { name: 'HAE' }).click();
  await expect(page.getByRole('link', { name: `${kaivuilmoitus}` })).toBeVisible({
    timeout: 20000,
  });
  await page.getByRole('link', { name: `${kaivuilmoitus}` }).click();
  await page.getByRole('link', { name: 'Historia' }).click();
  await page.locator('.mat-slide-toggle-thumb').click();
  await expect(page.getByText('Asiakkaan ilmoittama aika,')).toBeVisible();
  await expect(page.getByText('Valmistumisen ilmoituspäivä')).toBeVisible();
  await page.getByRole('link', { name: /Valvonta/gm }).click();
  await page.getByRole('button', { name: 'OMAKSI' }).first().click();
  await page.getByRole('button', { name: 'HYVÄKSY' }).click();
  await page.getByLabel('Valvojan merkinnät *').click();
  await page.getByLabel('Valvojan merkinnät *').fill('Valmiiksi merkinnät');
  await page.getByRole('button', { name: 'EHDOTA PÄÄTETTÄVÄKSI' }).click();
  await page.getByLabel('Perustelut *').click();
  await page.getByLabel('Perustelut *').fill('Hyväksytty valmiiksi');
  await page.getByLabel('Valitse päättäjä').getByText('Valitse päättäjä').click();
  await page.getByText('Allu Päättäjä').click();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
  await expect(page.getByLabel('Valvontatehtävä hyväksytty')).toBeVisible();
  await page.getByRole('link', { name: 'Perustiedot' }).click();
  await page.getByRole('button', { name: 'PÄÄTTÄMISEEN' }).click();
  await page.getByRole('link', { name: 'Työ valmis' }).click();
  await page.getByRole('button', { name: 'HYVÄKSY' }).click();
  await page.getByRole('button', { name: 'HYVÄKSY' }).click();
}
