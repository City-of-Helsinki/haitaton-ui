import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { HankeAlue } from '../../../../types/hanke';
import { KaivuilmoitusData } from '../../../types/application';
import { HaittojenhallintasuunnitelmaInfo } from '../../../../kaivuilmoitus/components/HaittojenhallintasuunnitelmaInfo';
import { HAITTOJENHALLINTATYYPPI } from '../../../../common/haittojenhallinta/types';
import { SectionTitle } from '../../../../forms/components/FormSummarySection';
import { differenceBy } from 'lodash';

const haittojenhallintaTyypit = $enum(
  HAITTOJENHALLINTATYYPPI,
).getKeys() as HAITTOJENHALLINTATYYPPI[];

type Props = {
  hankealueet: HankeAlue[];
  data: KaivuilmoitusData;
  originalData: KaivuilmoitusData;
  muutokset: string[];
};

export default function HaittojenhallintaSummary({
  hankealueet,
  data,
  originalData,
  muutokset,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const kaivuilmoitusAlueet = data.areas;
  const originalKaivuilmoitusAlueet = originalData.areas;
  const changedAndNewKaivuilmoitusAlueet = kaivuilmoitusAlueet.filter(
    (_, kaivuilmoitusAlueIndex) => {
      return (
        muutokset.find((muutos) =>
          muutos.includes(`areas[${kaivuilmoitusAlueIndex}].haittojenhallintasuunnitelma`),
        ) !== undefined
      );
    },
  );
  const newKaivuilmoitusAlueet = differenceBy(
    kaivuilmoitusAlueet,
    originalKaivuilmoitusAlueet,
    'hankealueId',
  );
  if (changedAndNewKaivuilmoitusAlueet.length === 0) {
    return null;
  }

  return (
    <>
      <SectionTitle>{t('hankePortfolio:tabit:haittojenHallinta')}</SectionTitle>
      <Tabs>
        <TabList style={{ marginBottom: 'var(--spacing-m)' }}>
          {changedAndNewKaivuilmoitusAlueet.map((alue) => {
            return (
              <Tab key={alue.hankealueId}>
                {t('hakemus:labels:workAreaPlural') + ' (' + alue.name + ')'}
              </Tab>
            );
          })}
        </TabList>
        {changedAndNewKaivuilmoitusAlueet.map((alue, index) => {
          const hankealue = hankealueet?.find((ha) => ha.id === alue.hankealueId);
          const visibleHaittojenhallintaTyypit = haittojenhallintaTyypit.filter((tyyppi) => {
            return (
              muutokset.includes(`areas[${index}].haittojenhallintasuunnitelma[${tyyppi}]`) ||
              newKaivuilmoitusAlueet.includes(alue)
            );
          });
          return (
            <TabPanel key={alue.hankealueId}>
              <HaittojenhallintasuunnitelmaInfo
                key={alue.hankealueId}
                alue={alue}
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
