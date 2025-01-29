import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import Text from '../../common/components/text/Text';
import useFieldArrayWithStateUpdate from '../../common/hooks/useFieldArrayWithStateUpdate';
import { KaivuilmoitusFormValues } from './types';
import HaittojenhallintaSuunnitelma from './components/HaittojenhallintaSuunnitelma';
import { HankeData } from '../types/hanke';
import CommonProcedureTips from '../common/haittojenhallinta/CommonProcedureTips';

type Props = {
  hankeData: HankeData;
};

export default function HaittojenHallinta({ hankeData }: Readonly<Props>) {
  const { t } = useTranslation();
  const { fields: hakemusAlueet } = useFieldArrayWithStateUpdate<
    KaivuilmoitusFormValues,
    'applicationData.areas'
  >({ name: 'applicationData.areas' });

  return (
    <div>
      <Text tag="p" spacingBottom="m">
        {t('kaivuilmoitusForm:haittojenHallinta:instructions')}
      </Text>
      <Text tag="p" spacingBottom="m">
        {t('kaivuilmoitusForm:haittojenHallinta:instructions2')}
      </Text>
      <Text tag="p" spacingBottom="m">
        {t('kaivuilmoitusForm:haittojenHallinta:instructions3')}
      </Text>
      <Text tag="p" spacingBottom="m">
        {t('form:requiredInstruction')}
      </Text>

      <Text tag="h3" styleAs="h4" weight="bold" spacingBottom="m">
        {t('kaivuilmoitusForm:haittojenHallinta:nuisanceControlPlanSubHeader')}
      </Text>
      <Text tag="p" spacingBottom="l">
        {t('kaivuilmoitusForm:haittojenHallinta:instructions4')}
      </Text>
      <CommonProcedureTips />
      <Tabs>
        <TabList>
          {hakemusAlueet.map((alue) => {
            return <Tab key={alue.id}>{alue.name}</Tab>;
          })}
        </TabList>
        {hakemusAlueet.map((alue, index) => {
          const hankeAlue = hankeData.alueet.find((ha) => ha.id === alue.hankealueId);
          return (
            <TabPanel key={alue.id}>
              <HaittojenhallintaSuunnitelma
                hankeAlue={hankeAlue!}
                kaivuilmoitusAlue={alue}
                index={index}
              />
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
}
