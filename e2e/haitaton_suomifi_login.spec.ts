import { test, expect } from '@playwright/test';
import { helsinkiLogin } from './_setup';

test('Johtoselvityshakemus ei ole käytettävissä ennen kirjautumista ja ohjeet', async ({
  page,
}) => {
  // Johtoselvityshakemus ei ole käytettävissä ennen kirjautumista
  await expect(page.getByLabel('Tee johtoselvityshakemus.', { exact: true })).not.toBeVisible();
  await helsinkiLogin(page);

  // ohjeet ja lisätietokortit
  await expect(page.getByRole('link', { name: 'Työohjeet' })).toBeVisible();
  await page.getByRole('link', { name: 'Työohjeet' }).click();
  await expect(page.getByLabel('Haittojenhallinnan lisä')).toBeVisible();
  await expect(page.getByLabel('Työmaan luvat ja ohjeet.')).toBeVisible();
  await expect(page.getByLabel('Maksut. Avautuu uudessa vä')).toBeVisible();
  await expect(page.getByLabel('Tilapäisten liikennejä')).toBeVisible();
  await page.getByRole('button', { name: '1. Tiedotus eri osapuolille' }).click();
  await expect(
    page.getByText(
      'Tiedotus eri osapuolille ja palauteVaadittava perustasoKerro alueen asukkaille',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: '2. Esteettömyys sekä' }).click();
  await expect(
    page.getByText(
      'Esteettömyys sekä kulkureittien pinnanlaatuVaadittava perustasoSulkupuomi tai –',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: '3. Jalankulun reitit sekä' }).click();
  await expect(
    page.getByText(
      'Jalankulun reitit sekä kadun ylitysVaadittava perustasoJalankulku tulee ohjata',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: '4. Pyöräliikenteen reitit, py' }).click();
  await expect(
    page.getByText(
      'Pyöräliikenteen reitit, pyöräpysäköinti sekä kadun ylitysVaadittava perustasoPy',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: '5. Jalankulun ja pyörä' }).click();
  await expect(
    page.getByText('Jalankulun ja pyöräliikenteen opastaminenVaadittava perustaso Siirrot:Jos'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Kaivannot ja sillat' }).click();
  await expect(
    page.getByText('Kaivannot ja sillatVaadittava perustasoJalkakäytävällä, pyörätiellä tai'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Työmaa-aidat ja valaistus' }).click();
  await expect(
    page.getByText('Työmaa-aidat ja valaistusVaadittava perustasoYhtenäiset työmaa-aidat rajaavat'),
  ).toBeVisible();
  await page.getByRole('button', { name: '8. Julkisen liikenteen ja pys' }).click();
  await expect(
    page.getByText('Julkisen liikenteen ja pysäkkien huomioon ottaminenVaadittava perustasoJos'),
  ).toBeVisible();
  await page.getByRole('button', { name: '9. Kiinteistöjen ja' }).click();
  await expect(
    page.getByText('Kiinteistöjen ja liikkeenharjoittajien tarpeetVaadittava perustasoKadun'),
  ).toBeVisible();
  await page.getByRole('button', { name: '10. Melu-, pöly- ja tärinä' }).click();
  await expect(page.locator('.StaticContent_main__CMrTP')).toBeVisible();
  await page.getByLabel('Haittojenhallinnan lisä').click();
  await expect(
    page.getByText(
      'Haittojenhallinnan lisätietokortitNämä lisätietokortit täydentävät Haitaton-jä',
    ),
  ).toBeVisible();
});
