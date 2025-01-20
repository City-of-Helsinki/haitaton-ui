import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { HankeAlue } from '../../types/hanke';
import { Application, KaivuilmoitusData } from '../../application/types/application';
import { HaittojenhallintasuunnitelmaInfo } from './HaittojenhallintasuunnitelmaInfo';

type Props = {
  hankealueet: HankeAlue[];
  formData: Application<KaivuilmoitusData>;
};

export default function HaittojenhallintaSummary({ hankealueet, formData }: Readonly<Props>) {
  const { t } = useTranslation();
  const kaivuilmoitusAlueet = formData.applicationData.areas;

  return (
    <Tabs>
      <TabList style={{ marginBottom: 'var(--spacing-m)' }}>
        {kaivuilmoitusAlueet.map((alue) => {
          return (
            <Tab key={alue.hankealueId}>
              {t('hakemus:labels:workAreaPlural') + ' (' + alue.name + ')'}
            </Tab>
          );
        })}
      </TabList>
      {kaivuilmoitusAlueet.map((alue) => {
        const hankealue = hankealueet?.find((ha) => ha.id === alue.hankealueId);
        return (
          <TabPanel key={alue.hankealueId}>
            <HaittojenhallintasuunnitelmaInfo
              key={alue.hankealueId}
              kaivuilmoitusAlue={alue}
              hankealue={hankealue}
            />
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
