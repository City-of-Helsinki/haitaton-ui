import React from 'react';
import { find } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import { JohtoselvitysFormValues } from '../../../johtoselvitys/types';
import { ContactSummary } from '../ContactsSummary';
import { Application, Contact, JohtoselvitysData } from '../../types/application';
import { useFeatureFlags } from '../../../../common/components/featureFlags/FeatureFlagsContext';

function findOrderer(formData: JohtoselvitysFormValues): Contact | null {
  const customerWithContacts = find(formData.applicationData, (value) => {
    if (typeof value === 'object' && value !== null && 'contacts' in value) {
      return value.contacts[0]?.orderer || false;
    }
    return false;
  });

  const contact =
    typeof customerWithContacts === 'object' &&
    customerWithContacts !== null &&
    'contacts' in customerWithContacts
      ? customerWithContacts.contacts[0]
      : null;

  return contact;
}

type Props = {
  formData: Application<JohtoselvitysData>;
  children?: React.ReactNode;
};

const BasicInformationSummary: React.FC<Props> = ({ formData, children }) => {
  const { t } = useTranslation();
  const features = useFeatureFlags();

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

  const orderer = findOrderer(formData as unknown as Application<JohtoselvitysData>);

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('hakemus:labels:nimi')}</SectionItemTitle>
      <SectionItemContent>
        <p>{name}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('form:labels:addressInformation')}</SectionItemTitle>
      <SectionItemContent>
        <p>{postalAddress?.streetAddress.streetName}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:tyossaKyse')}</SectionItemTitle>
      <SectionItemContent>
        {constructionWork && <p>{t('hakemus:labels:constructionWork')}</p>}
        {maintenanceWork && <p>{t('hakemus:labels:maintenanceWork')}</p>}
        {emergencyWork && <p>{t('hakemus:labels:emergencyWork')}</p>}
        {propertyConnectivity && <p>{t('hakemus:labels:propertyConnectivity')}</p>}
      </SectionItemContent>
      <SectionItemTitle>
        <p>{t('hakemus:labels:rockExcavationShort')}</p>
      </SectionItemTitle>
      <SectionItemContent>
        <p>{rockExcavation ? t('common:yes') : t('common:no')}</p>
      </SectionItemContent>
      <SectionItemTitle>{t('hakemus:labels:kuvaus')}</SectionItemTitle>
      <SectionItemContent>
        <p style={{ whiteSpace: 'pre-wrap' }}>{workDescription}</p>
      </SectionItemContent>
      {!features.accessRights && (
        <>
          <SectionItemTitle>{t('form:labels:omatTiedot')}</SectionItemTitle>
          <SectionItemContent>{orderer && <ContactSummary contact={orderer} />}</SectionItemContent>
        </>
      )}
      {children}
    </FormSummarySection>
  );
};

export default BasicInformationSummary;