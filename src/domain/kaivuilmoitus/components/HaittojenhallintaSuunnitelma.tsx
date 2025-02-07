import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { Box, Flex } from '@chakra-ui/layout';
import { Button, IconPlusCircle, Notification } from 'hds-react';
import TextArea from '../../../common/components/textArea/TextArea';
import { KaivuilmoitusAlue } from '../../application/types/application';
import {
  Haittojenhallintasuunnitelma,
  HAITTOJENHALLINTATYYPPI,
} from '../../common/haittojenhallinta/types';
import {
  mapNuisanceEnumIndexToNuisanceIndex,
  sortedLiikenneHaittojenhallintatyyppi,
} from '../../common/haittojenhallinta/utils';
import { calculateLiikennehaittaindeksienYhteenveto } from '../utils';
import TrafficIcon from '../../common/haittojenhallinta/TrafficIcon';
import CustomAccordion from '../../../common/components/customAccordion/CustomAccordion';
import { HaittaSubSection } from '../../common/haittaIndexes/HaittaSubSection';
import HaittaIndexHeading from '../../common/haittojenhallinta/HaittaIndexHeading';
import HaittaTooltipContent from '../../common/haittaIndexes/HaittaTooltipContent';
import {
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
  HankeAlue,
} from '../../types/hanke';
import styles from './HaittojenhallintaSuunnitelma.module.scss';
import HaittojenhallintaMap from './HaittojenhallintaMap';
import useIsHaittojenhallintaSectionVisible from '../../common/haittojenhallinta/useIsHaittojenhallintaSectionVisible';
import ProcedureTips from '../../common/haittaIndexes/ProcedureTips';
import { HaittaIndexData } from '../../common/haittaIndexes/types';

type Props = {
  hankeAlue: HankeAlue;
  kaivuilmoitusAlue: KaivuilmoitusAlue;
  index: number;
};

type HankeNuisanceControlProps = {
  indeksi?: number;
  haitta: HAITTOJENHALLINTATYYPPI;
  haittojenhallintasuunnitelma?: Haittojenhallintasuunnitelma;
};

function HankeNuisanceControl({
  indeksi = 0,
  haitta,
  haittojenhallintasuunnitelma,
}: Readonly<HankeNuisanceControlProps>) {
  const { t } = useTranslation();

  if (!haitta) return null;

  const hankeText = haittojenhallintasuunnitelma?.[haitta];

  return (
    <Box mb="var(--spacing-m)">
      <Notification
        label={t('hakemus:labels:hankeAreaNuisanceControl')}
        style={{ overflow: 'visible' }}
      >
        {haitta !== HAITTOJENHALLINTATYYPPI.YLEINEN && haitta !== HAITTOJENHALLINTATYYPPI.MUUT && (
          <Box mb="var(--spacing-s)">
            <HaittaIndexHeading
              index={indeksi}
              haittojenhallintaTyyppi={haitta}
              heading={t('kaivuilmoitusForm:haittojenHallinta:hankeHaittaindeksi')}
              testId={`test-hanke-${haitta}`}
            />
          </Box>
        )}
        <Box as="p" className="text-sm" data-testid={`test-hanke-nuisance-control-${haitta}`}>
          {indeksi === 0 && !hankeText
            ? t('hankeForm:haittojenHallintaForm:noHankeNuisanceDetected')
            : hankeText}
        </Box>
      </Notification>
    </Box>
  );
}

export default function KaivuilmoitusHaittojenhallintaSuunnitelma({
  hankeAlue,
  kaivuilmoitusAlue,
  index,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const hankeTormaystarkasteluTulos = hankeAlue?.tormaystarkasteluTulos as HaittaIndexData;
  const hankeHaittojenhallintatyypit = sortedLiikenneHaittojenhallintatyyppi(
    hankeTormaystarkasteluTulos,
  );

  const tormaystarkasteluTulos = calculateLiikennehaittaindeksienYhteenveto(kaivuilmoitusAlue);
  const haittojenhallintatyypit = sortedLiikenneHaittojenhallintatyyppi(tormaystarkasteluTulos);
  const meluhaittaIndex = mapNuisanceEnumIndexToNuisanceIndex(
    $enum(HANKE_MELUHAITTA).indexOfKey(kaivuilmoitusAlue.meluhaitta!),
  );
  const polyhaittaIndex = mapNuisanceEnumIndexToNuisanceIndex(
    $enum(HANKE_POLYHAITTA).indexOfKey(kaivuilmoitusAlue.polyhaitta!),
  );
  const tarinaHaittaIndex = mapNuisanceEnumIndexToNuisanceIndex(
    $enum(HANKE_TARINAHAITTA).indexOfKey(kaivuilmoitusAlue.tarinahaitta!),
  );
  const { isVisible, setVisible } = useIsHaittojenhallintaSectionVisible(
    haittojenhallintatyypit,
    kaivuilmoitusAlue.haittojenhallintasuunnitelma,
  );

  const mapHankeIndex = (tyyppi: string, hhTyypit: [HAITTOJENHALLINTATYYPPI, number][]) =>
    hhTyypit.find((val) => val[0] === tyyppi)?.[1];

  return (
    <Box mt="var(--spacing-m)">
      <Box mb="var(--spacing-m)">
        <HankeNuisanceControl
          haitta={HAITTOJENHALLINTATYYPPI.YLEINEN}
          indeksi={mapHankeIndex(HAITTOJENHALLINTATYYPPI.YLEINEN, hankeHaittojenhallintatyypit)}
          haittojenhallintasuunnitelma={hankeAlue?.haittojenhallintasuunnitelma}
        />
        <TextArea
          name={`applicationData.areas.${index}.haittojenhallintasuunnitelma.${HAITTOJENHALLINTATYYPPI.YLEINEN}`}
          label={t(`kaivuilmoitusForm:haittojenHallinta:labels:${HAITTOJENHALLINTATYYPPI.YLEINEN}`)}
          testId={`applicationData.areas.${index}.haittojenhallintasuunnitelma.${HAITTOJENHALLINTATYYPPI.YLEINEN}`}
          required={true}
          helperText={t('kaivuilmoitusForm:haittojenHallinta:helperText')}
        />
      </Box>
      {haittojenhallintatyypit.map(([haitta, indeksi]) => {
        return (
          <Box mb="var(--spacing-m)" key={haitta}>
            <Flex
              backgroundColor="var(--color-black-10)"
              padding="var(--spacing-m)"
              columnGap="var(--spacing-s)"
              alignItems="center"
              mb="var(--spacing-m)"
            >
              <TrafficIcon haittojenhallintatyyppi={haitta} />{' '}
              <Box as="h4" className="heading-s">
                {t(`hankeForm:haittojenHallintaForm:nuisanceType:${haitta}`)}
              </Box>
            </Flex>
            <Box mb="var(--spacing-m)">
              <HaittojenhallintaMap
                hankeAlue={hankeAlue}
                kaivuilmoitusAlue={kaivuilmoitusAlue}
                haittojenHallintaTyyppi={haitta}
                mb="var(--spacing-m)"
              />
              <HankeNuisanceControl
                haitta={haitta}
                indeksi={mapHankeIndex(haitta, hankeHaittojenhallintatyypit)}
                haittojenhallintasuunnitelma={hankeAlue?.haittojenhallintasuunnitelma}
              />
              {haitta === HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE ? (
                <CustomAccordion
                  heading={
                    <HaittaIndexHeading
                      index={indeksi}
                      haittojenhallintaTyyppi={haitta}
                      heading={t('kaivuilmoitusForm:haittojenHallinta:haittaindeksi')}
                      showTooltipHeading={false}
                      testId="test-AUTOLIIKENNE"
                    />
                  }
                  headingBorderBottom={false}
                  headingBoxProps={{ paddingLeft: 0 }}
                >
                  <HaittaSubSection
                    heading={t(
                      `kaivuilmoitusForm:haittojenHallinta:carTrafficNuisanceType:katuluokka`,
                    )}
                    index={tormaystarkasteluTulos?.autoliikenne.katuluokka}
                    testId="test-katuluokka"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoKatuluokka" />
                    }
                  />
                  <HaittaSubSection
                    heading={t(
                      `kaivuilmoitusForm:haittojenHallinta:carTrafficNuisanceType:liikennemaara`,
                    )}
                    index={tormaystarkasteluTulos?.autoliikenne.liikennemaara}
                    testId="test-liikennemaara"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoliikenneMaara" />
                    }
                  />
                  <HaittaSubSection
                    heading={t(
                      `kaivuilmoitusForm:haittojenHallinta:carTrafficNuisanceType:kaistahaitta`,
                    )}
                    index={tormaystarkasteluTulos?.autoliikenne.kaistahaitta}
                    testId="test-kaistahaitta"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoKaistaHaitta" />
                    }
                  />
                  <HaittaSubSection
                    heading={t(
                      `kaivuilmoitusForm:haittojenHallinta:carTrafficNuisanceType:kaistapituushaitta`,
                    )}
                    index={tormaystarkasteluTulos?.autoliikenne.kaistapituushaitta}
                    testId="test-kaistapituushaitta"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoKaistaPituusHaitta" />
                    }
                  />
                  <HaittaSubSection
                    heading={t(
                      `kaivuilmoitusForm:haittojenHallinta:carTrafficNuisanceType:haitanKesto`,
                    )}
                    index={tormaystarkasteluTulos?.autoliikenne.haitanKesto}
                    testId="test-haitanKesto"
                    tooltipContent={
                      <HaittaTooltipContent translationKey="hankeIndexes:tooltips:autoTyonKesto" />
                    }
                  />
                </CustomAccordion>
              ) : (
                <HaittaIndexHeading
                  index={indeksi}
                  haittojenhallintaTyyppi={haitta}
                  heading={t('kaivuilmoitusForm:haittojenHallinta:haittaindeksi')}
                  testId={`test-${haitta}`}
                />
              )}
            </Box>
            {isVisible[haitta] ? (
              <>
                <Box mt="var(--spacing-s)" mb="var(--spacing-s)">
                  <ProcedureTips haittojenhallintaTyyppi={haitta} haittaIndex={indeksi} />
                </Box>
                <TextArea
                  name={`applicationData.areas.${index}.haittojenhallintasuunnitelma.${haitta}`}
                  label={t(`kaivuilmoitusForm:haittojenHallinta:labels:${haitta}`)}
                  testId={`applicationData.areas.${index}.haittojenhallintasuunnitelma.${haitta}`}
                  required={indeksi > 0}
                  helperText={t('kaivuilmoitusForm:haittojenHallinta:helperText')}
                />
              </>
            ) : (
              <>
                <Box as="p" mb="var(--spacing-s)">
                  {t('hankeForm:haittojenHallintaForm:noNuisanceDetected')}
                </Box>
                <Button
                  variant="supplementary"
                  iconLeft={<IconPlusCircle />}
                  onClick={() => setVisible(haitta)}
                  data-testid={`lisaa_${haitta}`}
                >
                  {t('hankeForm:haittojenHallintaForm:addControlPlan')}
                </Button>
              </>
            )}
          </Box>
        );
      })}
      <div>
        <Box
          as="h4"
          backgroundColor="var(--color-black-10)"
          padding="var(--spacing-m)"
          mb="var(--spacing-m)"
          className="heading-s"
        >
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
          <HankeNuisanceControl
            haitta={HAITTOJENHALLINTATYYPPI.MUUT}
            haittojenhallintasuunnitelma={hankeAlue?.haittojenhallintasuunnitelma}
          />
          <ProcedureTips haittojenhallintaTyyppi="MUUT" haittaIndex={0} />
        </Box>
        <Box mt="var(--spacing-m)">
          <TextArea
            name={`applicationData.areas.${index}.haittojenhallintasuunnitelma.${HAITTOJENHALLINTATYYPPI.MUUT}`}
            label={t(`kaivuilmoitusForm:haittojenHallinta:labels:${HAITTOJENHALLINTATYYPPI.MUUT}`)}
            testId={`applicationData.areas.${index}.haittojenhallintasuunnitelma.${HAITTOJENHALLINTATYYPPI.MUUT}`}
            required={true}
            helperText={t('kaivuilmoitusForm:haittojenHallinta:helperText')}
          />
        </Box>
      </div>
    </Box>
  );
}
