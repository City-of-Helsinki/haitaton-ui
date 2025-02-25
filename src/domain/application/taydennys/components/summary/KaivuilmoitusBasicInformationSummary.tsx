import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemContentRemoved,
  SectionItemTitle,
  SectionTitle,
} from '../../../../forms/components/FormSummarySection';
import { KaivuilmoitusData } from '../../../types/application';

type Props = {
  data: KaivuilmoitusData;
  originalData: KaivuilmoitusData;
  muutokset: string[];
  children?: React.ReactNode;
};

export default function BasicInformationSummary({
  data,
  originalData,
  muutokset,
  children,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { name, workDescription, cableReports, placementContracts, requiredCompetence } = data;

  const nameChanged = muutokset.includes('name');
  const workDescriptionChanged = muutokset.includes('workDescription');
  const workIsAboutChanged: string[] = muutokset.filter((muutos) =>
    ['constructionWork', 'maintenanceWork', 'emergencyWork'].includes(muutos),
  );
  const workIsAboutRemoved: string[] = workIsAboutChanged.filter(
    (muutos) => !data[muutos as keyof KaivuilmoitusData],
  );
  const workIsAboutChangedButNotRemoved = workIsAboutChanged.filter(
    (muutos) => !workIsAboutRemoved.includes(muutos),
  );
  const cableReportsChanged = muutokset.includes('cableReports');
  const placementContractsChanged = muutokset.includes('placementContracts');
  const requiredCompetenceChanged = muutokset.includes('requiredCompetence');

  if (
    !nameChanged &&
    !workIsAboutChanged.length &&
    !workDescriptionChanged &&
    !cableReportsChanged &&
    !placementContractsChanged &&
    !requiredCompetenceChanged
  ) {
    return null;
  }

  return (
    <>
      <SectionTitle>{t('hankeForm:perustiedotForm:header')}</SectionTitle>
      <FormSummarySection>
        {nameChanged && (
          <>
            <SectionItemTitle>{t('hakemus:labels:nimi')}</SectionItemTitle>
            {!name ? (
              <SectionItemContentRemoved>
                <p>{originalData.name}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContent>
                <p>{name}</p>
              </SectionItemContent>
            )}
          </>
        )}
        {workIsAboutChanged.length > 0 && (
          <>
            <SectionItemTitle>{t('hakemus:labels:tyossaKyse')}</SectionItemTitle>
            <SectionItemContent>
              {workIsAboutChangedButNotRemoved.length > 0 && (
                <>
                  {workIsAboutChangedButNotRemoved.map((changed) => (
                    <p key={changed}>{t(`hakemus:labels:${changed}`)}</p>
                  ))}
                </>
              )}
              {workIsAboutRemoved.length > 0 && (
                <SectionItemContentRemoved>
                  {workIsAboutRemoved.map((removed) => (
                    <p key={removed}>{t(`hakemus:labels:${removed}`)}</p>
                  ))}
                </SectionItemContentRemoved>
              )}
            </SectionItemContent>
          </>
        )}
        {workDescriptionChanged && (
          <>
            <SectionItemTitle>{t('hakemus:labels:kuvaus')}</SectionItemTitle>
            {!workDescription ? (
              <SectionItemContentRemoved>
                <p style={{ whiteSpace: 'pre-wrap' }}>{originalData.workDescription}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContent>
                <p style={{ whiteSpace: 'pre-wrap' }}>{workDescription}</p>
              </SectionItemContent>
            )}
          </>
        )}
        {cableReportsChanged && (
          <>
            <SectionItemTitle>{t('hakemus:labels:cableReports')}</SectionItemTitle>
            <SectionItemContent>
              <p>{cableReports?.join(', ')}</p>
            </SectionItemContent>
          </>
        )}
        {placementContractsChanged && (
          <>
            <SectionItemTitle>{t('hakemus:labels:placementContractsTitle')}</SectionItemTitle>
            <SectionItemContent>
              <p>{placementContracts?.join(', ')}</p>
            </SectionItemContent>
          </>
        )}
        {requiredCompetenceChanged && (
          <>
            <SectionItemTitle>{t('hakemus:labels:requiredCompetenceTitle')}</SectionItemTitle>
            <SectionItemContent>
              <p>{requiredCompetence ? t('common:yes') : t('common:no')}</p>
            </SectionItemContent>
          </>
        )}
        {children}
      </FormSummarySection>
    </>
  );
}
