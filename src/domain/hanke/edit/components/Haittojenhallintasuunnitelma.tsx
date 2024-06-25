import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Box, HStack } from '@chakra-ui/react';
import { FORMFIELD, HankeDataFormState } from '../types';
import { HAITTOJENHALLINTATYYPPI, HankeData } from '../../../types/hanke';
import TextArea from '../../../../common/components/textArea/TextArea';
import { sortedLiikenneHaittojenhallintatyyppi } from '../utils';
import useFieldArrayWithStateUpdate from '../../../../common/hooks/useFieldArrayWithStateUpdate';
import HankealueMap from '../../../map/components/HankkeenHaittojenhallintasuunnitelma/HankealueMap';
import VectorSource from 'ol/source/Vector';
import useAddressCoordinate from '../../../map/hooks/useAddressCoordinate';
import { HaittaIndexData } from '../../../common/haittaIndexes/types';
import CustomAccordion from '../../../../common/components/customAccordion/CustomAccordion';
import HaittaIndex from '../../../common/haittaIndexes/HaittaIndex';
import { HaittaSubSection } from '../../../common/haittaIndexes/HaittaSubSection';

function HaittaIndexHeading({ index }: Readonly<{ index: number | undefined }>) {
  const { t } = useTranslation();
  return (
    <HStack spacing="12px">
      <Box as="h4" className="heading-s">
        {t(`hankeIndexes:haittaindeksi`)}
      </Box>
      <HaittaIndex index={index} showLabel={false} />
    </HStack>
  );
}

type Props = {
  hanke: HankeData;
  index: number;
};

const Haittojenhallintasuunnitelma: React.FC<Props> = ({ hanke, index }) => {
  const { t } = useTranslation();
  const { fields: hankealueet } = useFieldArrayWithStateUpdate<HankeDataFormState, 'alueet'>({
    name: FORMFIELD.HANKEALUEET,
  });
  const hankealue = hankealueet[index];
  const tormaystarkasteluTulos = hankealue.tormaystarkasteluTulos as HaittaIndexData;
  const haittojenhallintatyypit = sortedLiikenneHaittojenhallintatyyppi(tormaystarkasteluTulos);
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const addressCoordinate = useAddressCoordinate(hanke.tyomaaKatuosoite);

  return (
    <div>
      <Box as="h4" mt="var(--spacing-m)" mb="var(--spacing-xs)" fontWeight="bold">
        {t('hankeForm:haittojenHallintaForm:subHeaderPlan')}
      </Box>
      <Box mb="var(--spacing-m)" ml="var(--spacing-l)">
        <Trans i18nKey="hankeForm:haittojenHallintaForm:instructionsGeneral">
          <ul>
            <li>Varmista jalankulun turvallisuus ja esteettömyys</li>
            <li>Varmista kulkuyhteydet kiinteistöihin</li>
            <li>Tee yhteensovitus muiden hankkeiden ja töiden sekä niiden kiertoreittien kanssa</li>
            <li>
              Ilmoita aina katujen sulkemisesta liikenteeltä Pelastuslaitokselle ja Poliisille
            </li>
            <li>Tarkista aina, onko hankkeesi tai työsi erikoiskuljetusten reitillä</li>
            <li>
              Tarkista vaikutukset olevaan liikennevalo-ohjaukseen (kaistajärjestelyt, ilmaisimet,
              valojen toimivuus)
            </li>
            <li>Poikkeavat työajat</li>
          </ul>
        </Trans>
      </Box>
      <div key={HAITTOJENHALLINTATYYPPI.YLEINEN} className="formWpr">
        <TextArea
          name={`${FORMFIELD.HANKEALUEET}.${index}.haittojenhallintasuunnitelma.${HAITTOJENHALLINTATYYPPI.YLEINEN}`}
          label={t(
            `hankeForm:labels:haittojenhallintasuunnitelma:${HAITTOJENHALLINTATYYPPI.YLEINEN}`,
          )}
          testId={`${FORMFIELD.HANKEALUEET}.${index}.haittojenhallintasuunnitelma.${HAITTOJENHALLINTATYYPPI.YLEINEN}`}
          required={true}
          helperText={t('hankeForm:haittojenHallintaForm:helperText')}
        />
      </div>
      <Box as="p" mb="var(--spacing-m)">
        {t('hankeForm:haittojenHallintaForm:subHeaderTrafficNuisanceIndex')}
      </Box>
      {haittojenhallintatyypit.map(([haitta, indeksi]) => (
        <div key={haitta} className="formWpr">
          <Box as="h4" className="nuisanceType">
            {t(`hankeForm:haittojenHallintaForm:nuisanceType:${haitta}`)}
          </Box>
          <Box mt="var(--spacing-m)" mb="var(--spacing-m)">
            <HankealueMap
              hankealue={hankealue}
              center={addressCoordinate}
              drawSource={drawSource}
            />
          </Box>
          {haitta === HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE && (
            <CustomAccordion
              heading={<HaittaIndexHeading index={indeksi} />}
              headingBorderBottom={false}
            >
              <HaittaSubSection
                heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:katuluokka`)}
                index={tormaystarkasteluTulos?.autoliikenne.katuluokka}
                testId="test-katuluokka"
              />
              <HaittaSubSection
                heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:liikennemaara`)}
                index={tormaystarkasteluTulos?.autoliikenne.liikennemaara}
                testId="test-liikennemaara"
              />
              <HaittaSubSection
                heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:kaistahaitta`)}
                index={tormaystarkasteluTulos?.autoliikenne.kaistahaitta}
                testId="test-kaistahaitta"
              />
              <HaittaSubSection
                heading={t(
                  `hankeForm:haittojenHallintaForm:carTrafficNuisanceType:kaistapituushaitta`,
                )}
                index={tormaystarkasteluTulos?.autoliikenne.kaistapituushaitta}
                testId="test-kaistapituushaitta"
              />
              <HaittaSubSection
                heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:haitanKesto`)}
                index={tormaystarkasteluTulos?.autoliikenne.haitanKesto}
                testId="test-haitanKesto"
              />
            </CustomAccordion>
          )}
          <Box mt="var(--spacing-m)">
            <TextArea
              name={`${FORMFIELD.HANKEALUEET}.${index}.haittojenhallintasuunnitelma.${haitta}`}
              label={t(`hankeForm:labels:haittojenhallintasuunnitelma:${haitta}`)}
              testId={`${FORMFIELD.HANKEALUEET}.${index}.haittojenhallintasuunnitelma.${haitta}`}
              required={true}
              helperText={t('hankeForm:haittojenHallintaForm:helperText')}
            />
          </Box>
        </div>
      ))}
      <div key={HAITTOJENHALLINTATYYPPI.MUUT} className="formWpr">
        <Box as="h4" className="nuisanceType">
          {t(`hankeForm:haittojenHallintaForm:nuisanceType:${HAITTOJENHALLINTATYYPPI.MUUT}`)}
        </Box>
        <Box mt="var(--spacing-m)">
          <TextArea
            name={`${FORMFIELD.HANKEALUEET}.${index}.haittojenhallintasuunnitelma.${HAITTOJENHALLINTATYYPPI.MUUT}`}
            label={t(
              `hankeForm:labels:haittojenhallintasuunnitelma:${HAITTOJENHALLINTATYYPPI.MUUT}`,
            )}
            testId={`${FORMFIELD.HANKEALUEET}.${index}.haittojenhallintasuunnitelma.${HAITTOJENHALLINTATYYPPI.MUUT}`}
            required={true}
            helperText={t('hankeForm:haittojenHallintaForm:helperText')}
          />
        </Box>
      </div>
    </div>
  );
};

export default Haittojenhallintasuunnitelma;
