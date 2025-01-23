import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemContentAdded,
  SectionItemContentRemoved,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import { Application, KaivuilmoitusData } from '../../types/application';
import { Box } from '@chakra-ui/react';

type Props = {
  formData: Application<KaivuilmoitusData>;
  children?: React.ReactNode;
  changedData?: KaivuilmoitusData;
  muutokset?: string[];
};

export default function BasicInformationSummary({
  formData,
  children,
  changedData,
  muutokset,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const {
    name,
    workDescription,
    constructionWork,
    maintenanceWork,
    emergencyWork,
    cableReportDone,
    rockExcavation,
    cableReports,
    placementContracts,
    requiredCompetence,
  } = formData.applicationData;

  const workIsAboutChanged: string[] =
    muutokset?.filter((muutos) =>
      ['constructionWork', 'maintenanceWork', 'emergencyWork'].includes(muutos),
    ) ?? [];
  const workIsAboutRemoved: string[] = workIsAboutChanged.filter(
    (muutos) => changedData && !changedData[muutos as keyof KaivuilmoitusData],
  );
  const workIsAboutChangedButNotRemoved = workIsAboutChanged.filter(
    (muutos) => !workIsAboutRemoved.includes(muutos),
  );

  const cableReportsAdded = changedData?.cableReports?.filter(
    (cableReport) => !cableReports?.includes(cableReport),
  );
  const cableReportsRemoved = cableReports?.filter(
    (cableReport) => !changedData?.cableReports?.includes(cableReport),
  );

  const placementContractsAdded = changedData?.placementContracts?.filter(
    (placementContract) => !placementContracts?.includes(placementContract),
  );
  const placementContractsRemoved = placementContracts?.filter(
    (placementContract) => !changedData?.placementContracts?.includes(placementContract),
  );

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('hakemus:labels:nimi')}</SectionItemTitle>
      <SectionItemContent>
        <p>{name}</p>
        {changedData && muutokset && muutokset.includes('name') && (
          <Box marginTop="var(--spacing-s)">
            {!changedData.name ? (
              <SectionItemContentRemoved>
                <p>{name}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContentAdded>
                <p>{changedData.name}</p>
              </SectionItemContentAdded>
            )}
          </Box>
        )}
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:kuvaus')}</SectionItemTitle>
      <SectionItemContent>
        <p style={{ whiteSpace: 'pre-wrap' }}>{workDescription}</p>
        {changedData && muutokset && muutokset.includes('workDescription') && (
          <Box marginTop="var(--spacing-s)">
            {!changedData.name ? (
              <SectionItemContentRemoved>
                <p style={{ whiteSpace: 'pre-wrap' }}>{workDescription}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContentAdded>
                <p style={{ whiteSpace: 'pre-wrap' }}>{changedData.workDescription}</p>
              </SectionItemContentAdded>
            )}
          </Box>
        )}
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:tyossaKyse')}</SectionItemTitle>
      <SectionItemContent>
        {constructionWork && <p>{t('hakemus:labels:constructionWork')}</p>}
        {maintenanceWork && <p>{t('hakemus:labels:maintenanceWork')}</p>}
        {emergencyWork && <p>{t('hakemus:labels:emergencyWorkKaivuilmoitus')}</p>}
        {workIsAboutChangedButNotRemoved.length > 0 && (
          <SectionItemContentAdded marginTop="var(--spacing-s)">
            {workIsAboutChangedButNotRemoved.map((changed) => (
              <p key={changed}>{t(`hakemus:labels:${changed}`)}</p>
            ))}
          </SectionItemContentAdded>
        )}
        {workIsAboutRemoved.length > 0 && (
          <SectionItemContentRemoved marginTop="var(--spacing-s)">
            {workIsAboutRemoved.map((removed) => (
              <p key={removed}>{t(`hakemus:labels:${removed}`)}</p>
            ))}
          </SectionItemContentRemoved>
        )}
      </SectionItemContent>
      {!cableReportDone && (
        <>
          <SectionItemTitle>{t('hakemus:labels:newCableReport')}</SectionItemTitle>
          <SectionItemContent>
            <p>
              {t('hakemus:labels:rockExcavation')}:{' '}
              {rockExcavation ? t('common:yes') : t('common:no')}
            </p>
          </SectionItemContent>
        </>
      )}
      <SectionItemTitle>{t('hakemus:labels:cableReports')}</SectionItemTitle>
      <SectionItemContent>
        <p>{cableReports?.join(', ')}</p>
        {(cableReportsAdded?.length || 0) > 0 && (
          <SectionItemContentAdded marginTop="var(--spacing-s)">
            {cableReportsAdded?.map((changed) => <p key={changed}>{changed}</p>)}
          </SectionItemContentAdded>
        )}
        {(cableReportsRemoved?.length || 0) > 0 && (
          <SectionItemContentRemoved marginTop="var(--spacing-s)">
            {cableReportsRemoved?.map((removed) => <p key={removed}>{removed}</p>)}
          </SectionItemContentRemoved>
        )}
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:placementContractsTitle')}</SectionItemTitle>
      <SectionItemContent>
        <p>{placementContracts?.join(', ')}</p>
        {(placementContractsAdded?.length || 0) > 0 && (
          <SectionItemContentAdded marginTop="var(--spacing-s)">
            {placementContractsAdded?.map((changed) => <p key={changed}>{changed}</p>)}
          </SectionItemContentAdded>
        )}
        {(placementContractsRemoved?.length || 0) > 0 && (
          <SectionItemContentRemoved marginTop="var(--spacing-s)">
            {placementContractsRemoved?.map((removed) => <p key={removed}>{removed}</p>)}
          </SectionItemContentRemoved>
        )}
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:requiredCompetenceTitle')}</SectionItemTitle>
      <SectionItemContent>
        <p>{requiredCompetence ? t('common:yes') : t('common:no')}</p>
        {changedData && muutokset && muutokset.includes('requiredCompetence') && (
          <Box marginTop="var(--spacing-s)">
            <SectionItemContentAdded>
              <p>{changedData.requiredCompetence ? t('common:yes') : t('common:no')}</p>
            </SectionItemContentAdded>
          </Box>
        )}
      </SectionItemContent>
      {children}
    </FormSummarySection>
  );
}
