import React from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { calculateLiikennehaittaindeksienYhteenveto } from '../utils';
import { sortedLiikenneHaittojenhallintatyyppi } from '../../common/haittojenhallinta/utils';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import HankkeenHaittojenhallintasuunnitelma from './HankkeenHaittojenhallintasuunnitelma';
import { HAITTOJENHALLINTATYYPPI } from '../../common/haittojenhallinta/types';
import { KaivuilmoitusAlue } from '../../application/types/application';
import { HankeAlue } from '../../types/hanke';
import HaittaIndex from '../../common/haittaIndexes/HaittaIndex';
import HaittaTooltipContent from '../../common/haittaIndexes/HaittaTooltipContent';
import Text from '../../../common/components/text/Text';
import styles from './HaittojenhallintasuunnitelmaInfo.module.scss';

const haittojenhallintaTyypit = $enum(HAITTOJENHALLINTATYYPPI).getKeys();

type LiikennehaitanHallintasuunnitelmaProps = {
  tyyppi: HAITTOJENHALLINTATYYPPI;
  indeksi: number;
  alue: KaivuilmoitusAlue;
  hankealue?: HankeAlue;
};

const LiikennehaitanHallintasuunnitelmaInfo: React.FC<LiikennehaitanHallintasuunnitelmaProps> = ({
  tyyppi,
  indeksi,
  alue,
  hankealue,
}) => {
  const { t } = useTranslation();
  return (
    <FormSummarySection
      padding="var(--spacing-s)"
      marginBottom="var(--spacing-xs)"
      className={styles.haittojenhallintaSection}
    >
      <SectionItemTitle>
        {t(`hankeForm:haittojenHallintaForm:nuisanceType:${tyyppi}`)}
      </SectionItemTitle>
      <SectionItemContent>
        <Grid templateColumns="9fr 1fr" gap="var(--spacing-xs)">
          <GridItem>
            <HankkeenHaittojenhallintasuunnitelma
              text={hankealue?.haittojenhallintasuunnitelma?.[tyyppi] ?? ''}
            />
            <Text spacingTop="xs" weight="bold" styleAs="h6" tag="h6">
              {t('kaivuilmoitusForm:haittojenHallinta:labels:YLEINEN')}
            </Text>
            <Box whiteSpace="pre-wrap" wordBreak="break-word" paddingTop="var(--spacing-xs)">
              {alue.haittojenhallintasuunnitelma?.[tyyppi] ?? ''}
            </Box>
          </GridItem>
          <GridItem width="80px">
            <HaittaIndex
              index={indeksi}
              label={t('kaivuilmoitusForm:haittojenHallinta:haittaindeksi')}
              tooltipContent={
                <HaittaTooltipContent
                  translationKey={`hankeIndexes:tooltips:${tyyppi}`}
                  showHeading={false}
                />
              }
              testId={`test-${tyyppi}`}
            />
          </GridItem>
        </Grid>
      </SectionItemContent>
    </FormSummarySection>
  );
};

type HaittojenHallintaProps = {
  kaivuilmoitusAlue: KaivuilmoitusAlue;
  hankealue?: HankeAlue;
  visibleHaittojenhallintaTyypit?: HAITTOJENHALLINTATYYPPI[];
};

export const HaittojenhallintasuunnitelmaInfo: React.FC<HaittojenHallintaProps> = ({
  kaivuilmoitusAlue,
  hankealue,
  visibleHaittojenhallintaTyypit = haittojenhallintaTyypit,
}) => {
  const { t } = useTranslation();
  const tormaystarkasteluTulos = calculateLiikennehaittaindeksienYhteenveto(kaivuilmoitusAlue);
  const haittojenhallintatyypit = sortedLiikenneHaittojenhallintatyyppi(
    tormaystarkasteluTulos,
  ).filter(([haitta]) => visibleHaittojenhallintaTyypit.includes(haitta));

  return (
    <>
      {visibleHaittojenhallintaTyypit.includes(HAITTOJENHALLINTATYYPPI.YLEINEN) && (
        <FormSummarySection
          padding="var(--spacing-s)"
          marginBottom="var(--spacing-xs)"
          className={styles.haittojenhallintaSection}
        >
          <SectionItemTitle>
            {t('kaivuilmoitusForm:haittojenHallinta:labels:YLEINEN')}
          </SectionItemTitle>
          <SectionItemContent>
            <Grid templateColumns="9fr 1fr" gap="var(--spacing-xs)">
              <GridItem>
                <HankkeenHaittojenhallintasuunnitelma
                  text={hankealue?.haittojenhallintasuunnitelma?.YLEINEN ?? ''}
                />
                <Box whiteSpace="pre-wrap" wordBreak="break-word" paddingTop="var(--spacing-s)">
                  {kaivuilmoitusAlue.haittojenhallintasuunnitelma?.YLEINEN ?? ''}
                </Box>
              </GridItem>
              <GridItem width="80px"></GridItem>
            </Grid>
          </SectionItemContent>
        </FormSummarySection>
      )}
      {haittojenhallintatyypit.map(([haitta, indeksi]) => {
        return (
          <LiikennehaitanHallintasuunnitelmaInfo
            tyyppi={haitta}
            indeksi={indeksi}
            alue={kaivuilmoitusAlue}
            hankealue={hankealue}
            key={haitta}
          />
        );
      })}
      {visibleHaittojenhallintaTyypit.includes(HAITTOJENHALLINTATYYPPI.MUUT) && (
        <FormSummarySection
          padding="var(--spacing-s)"
          marginBottom="var(--spacing-xs)"
          className={styles.haittojenhallintaSection}
        >
          <SectionItemTitle>
            {t('hankeForm:haittojenHallintaForm:nuisanceType:MUUT')}
          </SectionItemTitle>
          <SectionItemContent>
            <Grid templateColumns="9fr 1fr" gap="var(--spacing-xs)">
              <GridItem>
                <HankkeenHaittojenhallintasuunnitelma
                  text={hankealue?.haittojenhallintasuunnitelma?.MUUT ?? ''}
                />
                <Text spacingTop="xs" weight="bold" styleAs="h6" tag="h6">
                  {t('kaivuilmoitusForm:haittojenHallinta:labels:YLEINEN')}
                </Text>
                <Box whiteSpace="pre-wrap" wordBreak="break-word" paddingTop="var(--spacing-xs)">
                  {kaivuilmoitusAlue.haittojenhallintasuunnitelma?.MUUT ?? ''}
                </Box>
              </GridItem>
              <GridItem width="80px"></GridItem>
            </Grid>
          </SectionItemContent>
        </FormSummarySection>
      )}
    </>
  );
};
