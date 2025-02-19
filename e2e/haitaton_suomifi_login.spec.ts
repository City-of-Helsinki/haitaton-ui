import { test } from '@playwright/test';
import { helsinkiLogin } from './_setup';

console.log('In delete report directory branch.');

test('Johtoselvityshakemus ei ole käytettävissä ennen kirjautumista', async ({ page }) => {
  await helsinkiLogin(page);
});
