import React from 'react';
import { Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { JohtoselvitysFormValues } from './types';
import { FormSummarySection, SectionTitle } from '../forms/components/FormSummarySection';
import BasicInformationSummary from './components/BasicInformationSummary';
import AreaSummary from './components/AreaSummary';
import ContactsSummary from './components/ContactsSummary';

export const ReviewAndSend: React.FC = () => {
  const { getValues } = useFormContext<JohtoselvitysFormValues>();
  const { t } = useTranslation();

  const {
    customerWithContacts,
    contractorWithContacts,
    propertyDeveloperWithContacts,
    representativeWithContacts,
  } = getValues().applicationData;

  return (
    <div>
      <Box mb="var(--spacing-l)">
        <p>{t('hakemus:labels:checkInfo')}</p>
      </Box>

      <SectionTitle>{t('hankeForm:perustiedotForm:header')}</SectionTitle>
      <BasicInformationSummary formData={getValues()} />

      <SectionTitle>{t('hankeForm:hankkeenAlueForm:header')}</SectionTitle>
      <AreaSummary formData={getValues()} />

      <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
      <FormSummarySection>
        <ContactsSummary
          customerWithContacts={customerWithContacts}
          title={t('form:yhteystiedot:titles:customerWithContactsPlural')}
        />
        <ContactsSummary
          customerWithContacts={contractorWithContacts}
          title={t('form:yhteystiedot:titles:contractorWithContactsPlural')}
        />
        <ContactsSummary
          customerWithContacts={propertyDeveloperWithContacts}
          title={t('form:yhteystiedot:titles:rakennuttajatPlural')}
        />
        <ContactsSummary
          customerWithContacts={representativeWithContacts}
          title={t('form:yhteystiedot:titles:representativeWithContactsPlural')}
        />
      </FormSummarySection>
    </div>
  );
};

export default ReviewAndSend;
