import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { HankeAlue } from '../../../../types/hanke';
import { KaivuilmoitusAlue } from '../../../types/application';
import { HaittojenhallintasuunnitelmaInfo } from '../../../../kaivuilmoitus/components/HaittojenhallintasuunnitelmaInfo';
import { HAITTOJENHALLINTATYYPPI } from '../../../../common/haittojenhallinta/types';
import { SectionTitle } from '../../../../forms/components/FormSummarySection';

const haittojenhallintaTyypit = $enum(
  HAITTOJENHALLINTATYYPPI,
).getKeys() as HAITTOJENHALLINTATYYPPI[];

type Props = {
  hankealueet: HankeAlue[];
  kaivuilmoitusAlueet: KaivuilmoitusAlue[];
  muutokset: string[];
};

export default function HaittojenhallintaSummary({
  hankealueet,
  kaivuilmoitusAlueet,
  muutokset,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const changedKaivuilmoitusAlueet = kaivuilmoitusAlueet.filter((_, kaivuilmoitusAlueIndex) => {
    return (
      muutokset.find((muutos) =>
        muutos.includes(`areas[${kaivuilmoitusAlueIndex}].haittojenhallintasuunnitelma`),
      ) !== undefined
    );
  });

  if (changedKaivuilmoitusAlueet.length === 0) {
    return null;
  }

  return (
    <>
      <SectionTitle>{t('hankePortfolio:tabit:haittojenHallinta')}</SectionTitle>
      <Tabs>
        <TabList style={{ marginBottom: 'var(--spacing-m)' }}>
          {changedKaivuilmoitusAlueet.map((alue) => {
            return (
              <Tab key={alue.hankealueId}>
                {t('hakemus:labels:workAreaPlural') + ' (' + alue.name + ')'}
              </Tab>
            );
          })}
        </TabList>
        {changedKaivuilmoitusAlueet.map((alue, index) => {
          const hankealue = hankealueet?.find((ha) => ha.id === alue.hankealueId);
          const visibleHaittojenhallintaTyypit = haittojenhallintaTyypit.filter((tyyppi) => {
            return muutokset.includes(`areas[${index}].haittojenhallintasuunnitelma[${tyyppi}]`);
          });
          return (
            <TabPanel key={alue.hankealueId}>
              <HaittojenhallintasuunnitelmaInfo
                key={alue.hankealueId}
                kaivuilmoitusAlue={alue}
                hankealue={hankealue}
                visibleHaittojenhallintaTyypit={visibleHaittojenhallintaTyypit}
              />
            </TabPanel>
          );
        })}
      </Tabs>
    </>
  );
}
