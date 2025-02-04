import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { $enum } from 'ts-enum-util';
import { FORMFIELD, HankeDataFormState } from '../types';
import {
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
  HankeData,
} from '../../../types/hanke';
import TextArea from '../../../../common/components/textArea/TextArea';
import useFieldArrayWithStateUpdate from '../../../../common/hooks/useFieldArrayWithStateUpdate';
import HankealueMap from '../../../map/components/HankkeenHaittojenhallintasuunnitelma/HankealueMap';
import useAddressCoordinate from '../../../map/hooks/useAddressCoordinate';
import { HaittaIndexData } from '../../../common/haittaIndexes/types';
import CustomAccordion from '../../../../common/components/customAccordion/CustomAccordion';
import { HaittaSubSection } from '../../../common/haittaIndexes/HaittaSubSection';
import styles from './Haittojenhallintasuunnitelma.module.scss';
import ProcedureTips from '../../../common/haittaIndexes/ProcedureTips';
import HaittaTooltipContent from '../../../common/haittaIndexes/HaittaTooltipContent';
import { Button, IconPlusCircle } from 'hds-react';
import { HAITTOJENHALLINTATYYPPI } from '../../../common/haittojenhallinta/types';
import {
  mapNuisanceEnumIndexToNuisanceIndex,
  sortedLiikenneHaittojenhallintatyyppi,
} from '../../../common/haittojenhallinta/utils';
import TrafficIcon from '../../../common/haittojenhallinta/TrafficIcon';
import HaittaIndexHeading from '../../../common/haittojenhallinta/HaittaIndexHeading';
import useIsHaittojenhallintaSectionVisible from '../../../common/haittojenhallinta/useIsHaittojenhallintaSectionVisible';

type Props = {
  hanke: HankeData;
  index: number;
};

const HankkeenHaittojenhallintasuunnitelma: React.FC<Readonly<Props>> = ({ hanke, index }) => {
  const { t } = useTranslation();
  const { fields: hankealueet } = useFieldArrayWithStateUpdate<HankeDataFormState, 'alueet'>({
    name: FORMFIELD.HANKEALUEET,
  });
  const hankealue = hankealueet[index];
  const tormaystarkasteluTulos = hankealue.tormaystarkasteluTulos as HaittaIndexData;
  const haittojenhallintasuunnitelma = hankealue.haittojenhallintasuunnitelma;
  const haittojenhallintatyypit = sortedLiikenneHaittojenhallintatyyppi(tormaystarkasteluTulos);
  const addressCoordinate = useAddressCoordinate(hanke.tyomaaKatuosoite);
  const meluhaittaIndex = mapNuisanceEnumIndexToNuisanceIndex(
    $enum(HANKE_MELUHAITTA).indexOfKey(hankealue.meluHaitta!),
  );
  const polyhaittaIndex = mapNuisanceEnumIndexToNuisanceIndex(
    $enum(HANKE_POLYHAITTA).indexOfKey(hankealue.polyHaitta!),
  );
  const tarinaHaittaIndex = mapNuisanceEnumIndexToNuisanceIndex(
    $enum(HANKE_TARINAHAITTA).indexOfKey(hankealue.tarinaHaitta!),
  );
  const { isVisible, setVisible } = useIsHaittojenhallintaSectionVisible(
    haittojenhallintatyypit,
    haittojenhallintasuunnitelma,
  );

  return (
    <div>
      <Box as="h4" mt="var(--spacing-m)" mb="var(--spacing-xs)" fontWeight="bold">
        {t('hankeForm:haittojenHallintaForm:subHeaderPlan')}
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
          <Flex className="nuisanceType" columnGap="var(--spacing-s)" alignItems="center">
            <TrafficIcon haittojenhallintatyyppi={haitta} />{' '}
            <Box as="h4">{t(`hankeForm:haittojenHallintaForm:nuisanceType:${haitta}`)}</Box>
          </Flex>
          {isVisible[haitta] ? (
            <div>
              <Box mt="var(--spacing-m)" mb="var(--spacing-m)">
                <HankealueMap hankealue={hankealue} index={indeksi} center={addressCoordinate} />
              </Box>
              {haitta === HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE ? (
                <CustomAccordion
                  heading={
                    <HaittaIndexHeading
                      index={indeksi}
                      haittojenhallintaTyyppi={haitta}
                      showTooltipHeading={false}
                      testId="test-AUTOLIIKENNE"
                    />
                  }
                  headingBorderBottom={false}
                >
                  <HaittaSubSection
                    heading={t(`hankeForm:haittojenHallintaForm:carTrafficNuisanceType:katuluokka`)}
                    index={tormaystarkasteluTulos?.autoliikenne.katuluokka}
                    testId="test-katuluokka"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoKatuluokka" />
                    }
                  />
                  <HaittaSubSection
                    heading={t(
                      `hankeForm:haittojenHallintaForm:carTrafficNuisanceType:liikennemaara`,
                    )}
                    index={tormaystarkasteluTulos?.autoliikenne.liikennemaara}
                    testId="test-liikennemaara"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoliikenneMaara" />
                    }
                  />
                  <HaittaSubSection
                    heading={t(
                      `hankeForm:haittojenHallintaForm:carTrafficNuisanceType:kaistahaitta`,
                    )}
                    index={tormaystarkasteluTulos?.autoliikenne.kaistahaitta}
                    testId="test-kaistahaitta"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoKaistaHaitta" />
                    }
                  />
                  <HaittaSubSection
                    heading={t(
                      `hankeForm:haittojenHallintaForm:carTrafficNuisanceType:kaistapituushaitta`,
                    )}
                    index={tormaystarkasteluTulos?.autoliikenne.kaistapituushaitta}
                    testId="test-kaistapituushaitta"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoKaistaPituusHaitta" />
                    }
                  />
                  <HaittaSubSection
                    heading={t(
                      `hankeForm:haittojenHallintaForm:carTrafficNuisanceType:haitanKesto`,
                    )}
                    index={tormaystarkasteluTulos?.autoliikenne.haitanKesto}
                    testId="test-haitanKesto"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoHankkeenKesto" />
                    }
                  />
                </CustomAccordion>
              ) : (
                <HaittaIndexHeading
                  index={indeksi}
                  haittojenhallintaTyyppi={haitta}
                  testId={`test-${haitta}`}
                />
              )}
              <Box mt="var(--spacing-s)">
                <ProcedureTips haittojenhallintaTyyppi={haitta} haittaIndex={indeksi} />
              </Box>
              <Box mt="var(--spacing-m)">
                <TextArea
                  name={`${FORMFIELD.HANKEALUEET}.${index}.haittojenhallintasuunnitelma.${haitta}`}
                  label={t(`hankeForm:labels:haittojenhallintasuunnitelma:${haitta}`)}
                  testId={`${FORMFIELD.HANKEALUEET}.${index}.haittojenhallintasuunnitelma.${haitta}`}
                  required={indeksi > 0}
                  helperText={t('hankeForm:haittojenHallintaForm:helperText')}
                />
              </Box>
            </div>
          ) : (
            <div>
              <Box mt="var(--spacing-m)" ml="var(--spacing-m)">
                {t('hankeForm:haittojenHallintaForm:noNuisanceDetected')}
              </Box>
              <Button
                variant="supplementary"
                iconLeft={<IconPlusCircle aria-hidden />}
                onClick={() => setVisible(haitta)}
              >
                {t('hankeForm:haittojenHallintaForm:addControlPlan')}
              </Button>
            </div>
          )}
        </div>
      ))}
      <div key={HAITTOJENHALLINTATYYPPI.MUUT} className="formWpr">
        <Box as="h4" className="nuisanceType">
          {t(`hankeForm:haittojenHallintaForm:nuisanceType:${HAITTOJENHALLINTATYYPPI.MUUT}`)}
        </Box>
        <HaittaSubSection
          heading={t(`hankeForm:labels:meluHaittaShort`)}
          index={meluhaittaIndex}
          showColorByIndex={false}
          className={styles.muutHaittojenHallintaToimetSubSection}
          testId="test-meluHaitta"
          tooltipContent={
            <HaittaTooltipContent translationKey="hankeIndexes:tooltips:MUUT:meluHaitta" />
          }
        />
        <HaittaSubSection
          heading={t(`hankeForm:labels:polyHaittaShort`)}
          index={polyhaittaIndex}
          showColorByIndex={false}
          className={styles.muutHaittojenHallintaToimetSubSection}
          testId="test-polyHaitta"
          tooltipContent={
            <HaittaTooltipContent translationKey="hankeIndexes:tooltips:MUUT:polyHaitta" />
          }
        />
        <HaittaSubSection
          heading={t(`hankeForm:labels:tarinaHaittaShort`)}
          index={tarinaHaittaIndex}
          showColorByIndex={false}
          className={styles.muutHaittojenHallintaToimetSubSection}
          testId="test-tarinaHaitta"
          tooltipContent={
            <HaittaTooltipContent translationKey="hankeIndexes:tooltips:MUUT:tarinaHaitta" />
          }
        />
        <HaittaSubSection
          heading={t(`hankeForm:labels:checkSurrounding`)}
          showIndex={false}
          className={styles.muutHaittojenHallintaToimetSubSection}
        />
        <Box mt="var(--spacing-s)">
          <ProcedureTips haittojenhallintaTyyppi="MUUT" haittaIndex={0} />
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

export default HankkeenHaittojenhallintasuunnitelma;
