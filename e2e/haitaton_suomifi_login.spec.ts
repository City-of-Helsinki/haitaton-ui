import { test } from '@playwright/test';
import { helsinkiLogin } from './_setup';

test('Johtoselvityshakemus ei ole käytettävissä ennen kirjautumista', async ({ page }) => {
  await helsinkiLogin(page);
});
