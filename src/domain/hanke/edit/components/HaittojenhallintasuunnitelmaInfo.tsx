import React from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { sortedLiikenneHaittojenhallintatyyppi } from '../../../common/haittojenhallinta/utils';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { HAITTOJENHALLINTATYYPPI } from '../../../common/haittojenhallinta/types';
import { HankeAlue } from '../../../types/hanke';
import HaittaIndex from '../../../common/haittaIndexes/HaittaIndex';
import HaittaTooltipContent from '../../../common/haittaIndexes/HaittaTooltipContent';
import styles from './HaittojenhallintasuunnitelmaInfo.module.scss';

const haittojenhallintaTyypit = $enum(HAITTOJENHALLINTATYYPPI).getKeys();

type LiikennehaitanHallintasuunnitelmaProps = {
  tyyppi: HAITTOJENHALLINTATYYPPI;
  indeksi: number;
  hankealue: HankeAlue;
};

const LiikennehaitanHallintasuunnitelmaInfo: React.FC<LiikennehaitanHallintasuunnitelmaProps> = ({
  tyyppi,
  indeksi,
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
            <Box whiteSpace="pre-wrap" wordBreak="break-word">
              {hankealue.haittojenhallintasuunnitelma?.[tyyppi] ?? ''}
            </Box>
          </GridItem>
          <GridItem width="80px">
            <HaittaIndex
              index={indeksi}
              label={t('hankeIndexes:haittaindeksi')}
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
  hankealue: HankeAlue;
  visibleHaittojenhallintaTyypit?: HAITTOJENHALLINTATYYPPI[];
};

export const HaittojenhallintasuunnitelmaInfo: React.FC<HaittojenHallintaProps> = ({
  hankealue,
  visibleHaittojenhallintaTyypit = haittojenhallintaTyypit,
}) => {
  const { t } = useTranslation();
  const tormaystarkasteluTulos = hankealue.tormaystarkasteluTulos;
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
            {t('hankeForm:haittojenHallintaForm:nuisanceType:YLEINEN')}
          </SectionItemTitle>
          <SectionItemContent>
            <Grid templateColumns="9fr 1fr" gap="var(--spacing-xs)">
              <GridItem>
                <Box whiteSpace="pre-wrap" wordBreak="break-word">
                  {hankealue.haittojenhallintasuunnitelma?.YLEINEN ?? ''}
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
                <Box whiteSpace="pre-wrap" wordBreak="break-word">
                  {hankealue.haittojenhallintasuunnitelma?.MUUT ?? ''}
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
