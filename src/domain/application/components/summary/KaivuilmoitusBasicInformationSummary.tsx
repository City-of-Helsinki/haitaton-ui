import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import { Application, KaivuilmoitusData } from '../../types/application';

type Props = {
  formData: Application<KaivuilmoitusData>;
  children?: React.ReactNode;
};

export default function BasicInformationSummary({ formData, children }: Readonly<Props>) {
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

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('hakemus:labels:nimi')}</SectionItemTitle>
      <SectionItemContent>
        <p>{name}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:kuvaus')}</SectionItemTitle>
      <SectionItemContent>
        <p style={{ whiteSpace: 'pre-wrap' }}>{workDescription}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:tyossaKyse')}</SectionItemTitle>
      <SectionItemContent>
        {constructionWork && <p>{t('hakemus:labels:constructionWork')}</p>}
        {maintenanceWork && <p>{t('hakemus:labels:maintenanceWork')}</p>}
        {emergencyWork && <p>{t('hakemus:labels:emergencyWorkKaivuilmoitus')}</p>}
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
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:placementContractsTitle')}</SectionItemTitle>
      <SectionItemContent>
        <p>{placementContracts?.join(', ')}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:requiredCompetenceTitle')}</SectionItemTitle>
      <SectionItemContent>
        <p>{requiredCompetence ? t('common:yes') : t('common:no')}</p>
      </SectionItemContent>
      {children}
    </FormSummarySection>
  );
}
