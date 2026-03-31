import { expect, Page } from '@playwright/test';
import { testiData } from './test-data';

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
    timeout: 60000,
  });
}

export async function nextAndCloseToast(
  page: Page,
  nextButtonName: string,
  toastText: string,
  opts?: {
    visibleTimeout?: number;
    hiddenTimeout?: number;
  },
) {
  const { visibleTimeout = 10_000, hiddenTimeout = 20_000 } = opts ?? {};

  await page.getByRole('button', { name: nextButtonName }).click();

  const toast = page.locator('role=alert', { hasText: toastText });
  await expect(toast).toBeVisible({ timeout: visibleTimeout });

  const closeButton = toast.getByRole('button', { name: 'Close toast', exact: true });
  if (await closeButton.isVisible()) {
    await closeButton.click().catch(() => {
      // Toast auto-dismissed between isVisible() check and click()
    });
  }

  await expect(toast)
    .toBeHidden({ timeout: hiddenTimeout })
    .catch((error: Error) => {
      // Page navigated away before toast disappeared — toast is gone, treat as success
      if (!error.message.includes('Target page, context or browser has been closed')) {
        throw error;
      }
    });
}
