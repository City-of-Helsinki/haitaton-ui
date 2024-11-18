import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemContentAdded,
  SectionItemContentRemoved,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import { Application, JohtoselvitysData } from '../../types/application';
import { Box } from '@chakra-ui/react';

type Props = {
  formData: Application<JohtoselvitysData>;
  children?: React.ReactNode;
  changedData?: JohtoselvitysData;
  muutokset?: string[];
};

const BasicInformationSummary: React.FC<Props> = ({
  formData,
  children,
  changedData,
  muutokset,
}) => {
  const { t } = useTranslation();

  const {
    name,
    workDescription,
    constructionWork,
    maintenanceWork,
    emergencyWork,
    rockExcavation,
    postalAddress,
    propertyConnectivity,
  } = formData.applicationData;

  const workIsAboutChanged: string[] =
    muutokset?.filter((muutos) =>
      ['constructionWork', 'maintenanceWork', 'emergencyWork', 'propertyConnectivity'].includes(
        muutos,
      ),
    ) ?? [];
  const workIsAboutRemoved: string[] = workIsAboutChanged.filter(
    (muutos) => changedData && !changedData[muutos as keyof JohtoselvitysData],
  );
  const workIsAboutChangedButNotRemoved = workIsAboutChanged.filter(
    (muutos) => !workIsAboutRemoved.includes(muutos),
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
      <SectionItemTitle>{t('form:labels:addressInformation')}</SectionItemTitle>
      <SectionItemContent>
        <p>{postalAddress?.streetAddress.streetName}</p>
        {changedData && muutokset && muutokset.includes('postalAddress') && (
          <Box marginTop="var(--spacing-s)">
            {!changedData.postalAddress?.streetAddress.streetName ? (
              <SectionItemContentRemoved>
                <p>{postalAddress?.streetAddress.streetName}</p>
              </SectionItemContentRemoved>
            ) : (
              <SectionItemContentAdded>
                <p>{changedData.postalAddress?.streetAddress.streetName}</p>
              </SectionItemContentAdded>
            )}
          </Box>
        )}
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:tyossaKyse')}</SectionItemTitle>
      <SectionItemContent>
        {constructionWork && <p>{t('hakemus:labels:constructionWork')}</p>}
        {maintenanceWork && <p>{t('hakemus:labels:maintenanceWork')}</p>}
        {emergencyWork && <p>{t('hakemus:labels:emergencyWork')}</p>}
        {propertyConnectivity && <p>{t('hakemus:labels:propertyConnectivity')}</p>}
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
      <SectionItemTitle>
        <p>{t('hakemus:labels:rockExcavationShort')}</p>
      </SectionItemTitle>
      <SectionItemContent>
        <p>{rockExcavation ? t('common:yes') : t('common:no')}</p>
        {changedData && muutokset && muutokset.includes('rockExcavation') && (
          <Box marginTop="var(--spacing-s)">
            <SectionItemContentAdded>
              <p>{changedData.rockExcavation ? t('common:yes') : t('common:no')}</p>
            </SectionItemContentAdded>
          </Box>
        )}
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:kuvaus')}</SectionItemTitle>
      <SectionItemContent>
        <p style={{ whiteSpace: 'pre-wrap' }}>{workDescription}</p>
        {changedData && muutokset && muutokset.includes('workDescription') && (
          <Box marginTop="var(--spacing-s)">
            {!changedData.workDescription ? (
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
      {children}
    </FormSummarySection>
  );
};

export default BasicInformationSummary;
