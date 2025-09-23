import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import { HankeAlue } from '../../../types/hanke';
import { HaittojenhallintasuunnitelmaInfo } from './HaittojenhallintasuunnitelmaInfo';

type Props = {
  hankealueet: HankeAlue[];
};

export default function HaittojenhallintaSummary({ hankealueet }: Readonly<Props>) {
  return (
    <Tabs>
      <TabList style={{ marginBottom: 'var(--spacing-m)' }}>
        {hankealueet.map((alue) => {
          return <Tab key={alue.id}>{alue.nimi}</Tab>;
        })}
      </TabList>
      {hankealueet.map((alue) => {
        return (
          <TabPanel key={alue.id}>
            <HaittojenhallintasuunnitelmaInfo key={alue.id} hankealue={alue} />
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
