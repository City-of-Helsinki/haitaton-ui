import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Flex, HStack } from '@chakra-ui/react';
import { $enum } from 'ts-enum-util';
import { FORMFIELD, HankeDataFormState } from '../types';
import {
  HAITTOJENHALLINTATYYPPI,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
  HankeData,
  HankkeenHaittojenhallintasuunnitelma,
} from '../../../types/hanke';
import TextArea from '../../../../common/components/textArea/TextArea';
import { sortedLiikenneHaittojenhallintatyyppi } from '../utils';
import useFieldArrayWithStateUpdate from '../../../../common/hooks/useFieldArrayWithStateUpdate';
import HankealueMap from '../../../map/components/HankkeenHaittojenhallintasuunnitelma/HankealueMap';
import useAddressCoordinate from '../../../map/hooks/useAddressCoordinate';
import { HaittaIndexData } from '../../../common/haittaIndexes/types';
import CustomAccordion from '../../../../common/components/customAccordion/CustomAccordion';
import HaittaIndex from '../../../common/haittaIndexes/HaittaIndex';
import { HaittaSubSection } from '../../../common/haittaIndexes/HaittaSubSection';
import styles from './Haittojenhallintasuunnitelma.module.scss';
import ProcedureTips from '../../../common/haittaIndexes/ProcedureTips';
import HaittaTooltipContent from '../../../common/haittaIndexes/HaittaTooltipContent';
import { Button, IconPlusCircle } from 'hds-react';
import Bus from '../../../../common/components/icons/Bus';
import Car from '../../../../common/components/icons/Car';
import Tram from '../../../../common/components/icons/Tram';
import Bike from '../../../../common/components/icons/Bike';

function mapNuisanceEnumIndexToNuisanceIndex(index: number): number {
  if (index === 2) return 3;
  if (index === 3) return 5;
  return index;
}

/**
 * Nuisance control plan section for a traffic type should be visible if its index > 0,
 * or if it has some content.
 */
function shouldBeVisible(
  type: HAITTOJENHALLINTATYYPPI,
  index: number,
  haittojenhallintasuunnitelma?: HankkeenHaittojenhallintasuunnitelma,
): boolean {
  return (
    index > 0 ||
    (haittojenhallintasuunnitelma ? (haittojenhallintasuunnitelma[type]?.length ?? 0) > 0 : false)
  );
}

function HaittaIndexHeading({
  index,
  haittojenhallintaTyyppi,
  showTooltipHeading = true,
  testId,
}: Readonly<{
  index: number | undefined;
  haittojenhallintaTyyppi: string;
  showTooltipHeading?: boolean;
  testId?: string;
}>) {
  const { t } = useTranslation();
  return (
    <HStack spacing="12px">
      <Box as="h4" className="heading-s">
        {t(`hankeIndexes:haittaindeksi`)}
      </Box>
      <HaittaIndex
        index={index}
        showLabel={false}
        testId={testId}
        tooltipContent={
          <HaittaTooltipContent
            translationKey={`hankeIndexes:tooltips:${haittojenhallintaTyyppi}`}
            showHeading={showTooltipHeading}
          />
        }
      />
    </HStack>
  );
}

function TrafficIcon({
  haittojenhallintatyyppi,
}: Readonly<{ haittojenhallintatyyppi: HAITTOJENHALLINTATYYPPI }>) {
  switch (haittojenhallintatyyppi) {
    case HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE:
      return <Bus />;
    case HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE:
      return <Tram />;
    case HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE:
      return <Car />;
    default:
      return <Bike />;
  }
}

type Props = {
  hanke: HankeData;
  index: number;
};

const Haittojenhallintasuunnitelma: React.FC<Readonly<Props>> = ({ hanke, index }) => {
  const { t } = useTranslation();
  const { fields: hankealueet } = useFieldArrayWithStateUpdate<HankeDataFormState, 'alueet'>({
    name: FORMFIELD.HANKEALUEET,
  });
  const hankealue = hankealueet[index];
  const tormaystarkasteluTulos = hankealue.tormaystarkasteluTulos as HaittaIndexData;
  const haittojenhallintasuunnitelma = hankealue.haittojenhallintasuunnitelma;
  const haittojenhallintatyypit = sortedLiikenneHaittojenhallintatyyppi(tormaystarkasteluTulos);
  const liikennehaittatyypit = haittojenhallintatyypit.map(([tyyppi]) => tyyppi);
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
  const initialVisibility = liikennehaittatyypit.reduce(
    (acc, type) => {
      const found = haittojenhallintatyypit.find((value) => value[0] === type);
      return {
        ...acc,
        [type]: shouldBeVisible(type, found ? found[1] : 0, haittojenhallintasuunnitelma),
      };
    },
    {} as Record<HAITTOJENHALLINTATYYPPI, boolean>,
  );
  const [isVisible, setVisible] =
    useState<Record<HAITTOJENHALLINTATYYPPI, boolean>>(initialVisibility);

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
                onClick={() => setVisible((state) => ({ ...state, [haitta]: true }))}
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

export default Haittojenhallintasuunnitelma;
