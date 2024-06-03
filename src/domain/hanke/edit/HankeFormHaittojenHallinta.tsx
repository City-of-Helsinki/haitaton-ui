import React, { useState } from 'react';
import { FORMFIELD, FormProps, HankeDataFormState } from './types';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import Text from '../../../common/components/text/Text';
import { Tab, TabList, TabPanel, Tabs } from 'hds-react';
import useFieldArrayWithStateUpdate from '../../../common/hooks/useFieldArrayWithStateUpdate';
import useSelectableTabs from '../../../common/hooks/useSelectableTabs';
import useHighlightArea from '../../map/hooks/useHighlightArea';
import Haittojenhallintasuunnitelma from './components/Haittojenhallintasuunnitelma';
import { HankeData } from '../../types/hanke';
import HankeMap from '../../map/components/HankkeenHaittojenhallintasuunnitelma/HankeMap';
import VectorSource from 'ol/source/Vector';
import useAddressCoordinate from '../../map/hooks/useAddressCoordinate';

const HankeFormHaittojenHallinta: React.FC<FormProps> = ({ hanke }) => {
  const { t } = useTranslation();
  const { fields: hankealueet } = useFieldArrayWithStateUpdate<HankeDataFormState, 'alueet'>({
    name: FORMFIELD.HANKEALUEET,
  });
  const { tabRefs } = useSelectableTabs(hankealueet, {
    selectLastTabOnChange: true,
  });
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const addressCoordinate = useAddressCoordinate(hanke.tyomaaKatuosoite);
  const higlightArea = useHighlightArea();

  return (
    <div>
      <Box mb="var(--spacing-m)">
        <p>{t('hankeForm:haittojenHallintaForm:instructions')}</p>
      </Box>
      <Text tag="p" spacingBottom="m">
        {t('form:requiredInstruction')}
      </Text>

      {hankealueet.length < 1 ? (
        <Text tag="h3" styleAs="h4" weight="bold">
          <Box mb="var(--spacing-m)">{t('hankeForm:haittojenHallintaForm:subHeaderNoAlueet')}</Box>
        </Text>
      ) : (
        <Text tag="h3" styleAs="h4" weight="bold">
          <Box mb="var(--spacing-m)">{t('hankeForm:haittojenHallintaForm:subHeaderAlueet')}</Box>
        </Text>
      )}

      <Box mb="var(--spacing-m)">
        <HankeMap hanke={hanke as HankeData} center={addressCoordinate} drawSource={drawSource} />
      </Box>

      {hankealueet.length < 1 ? (
        <Box textAlign="center" mt="var(--spacing-2-xl)" mb="var(--spacing-2-xl)">
          <p>{t('hankeForm:haittojenHallintaForm:subHeaderAlueet')}</p>
        </Box>
      ) : (
        <div>
          <Text tag="h3" styleAs="h4" weight="bold">
            <Box mb="var(--spacing-m)">
              {t('hankeForm:haittojenHallintaForm:nuisanceControlPlanSubHeader')}
            </Box>
          </Text>
          <Box mb="var(--spacing-m)">
            <p>{t('hankeForm:haittojenHallintaForm:instructionsPlan')}</p>
          </Box>
          <Tabs>
            <TabList>
              {hankealueet.map((alue, index) => {
                const name = hankealueet[index].nimi;
                return (
                  <Tab key={alue.id} onClick={() => higlightArea(alue.feature)}>
                    <div ref={tabRefs[index]}>{name}</div>
                  </Tab>
                );
              })}
            </TabList>
            {hankealueet.map((item, index) => (
              <TabPanel key={item.id}>
                <Haittojenhallintasuunnitelma hanke={hanke as HankeData} index={index} />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default HankeFormHaittojenHallinta;
