import { expect, Page } from '@playwright/test';
import { testiData } from './test-data';

export async function alluLogin(page: Page) {
  await page.goto(testiData.allu_home);
  const alluLogo = page.locator('img[src="assets/svg/allu-testi-logo.svg"]');
  if (!(await alluLogo.isVisible())) {
    await page.goto(testiData.allu_login);
    await page.getByPlaceholder('Username').fill(testiData.allupw);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('link', { name: 'HAKEMUKSET' })).toBeVisible();
  }
  await page.getByRole('link', { name: 'HAKEMUKSET' }).click();
}

export async function alluSearchApplication(page: Page, applicationId: string) {
  await expect(page.getByRole('button', { name: 'HAE' })).toBeVisible();
  await page.getByLabel('Hakemuksen tunnus').fill(applicationId);
  await page.getByRole('button', { name: 'HAE' }).click();
  await expect(page.getByRole('link', { name: applicationId })).toBeVisible({ timeout: 20000 });
  await page.getByRole('link', { name: applicationId }).click();
}

// Helper to assert application status text
export async function expectApplicationStatus(
  page: Page,
  applicationId: string,
  expectedStatus: string,
  timeout = 15_000,
) {
  // figure out which view we're on by looking at the path
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

export async function hyvaksyKaivuilmoitusToiminnalliseenKuntoon(
  page: Page,
  kaivuilmoitus: string,
) {
  await alluLogin(page);
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
  await alluLogin(page);
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
  await expect(page.getByRole('button', { name: 'TALLENNA' })).toBeEnabled();
  await page.getByRole('button', { name: 'TALLENNA' }).click();
}
