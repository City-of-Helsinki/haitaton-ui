import React from 'react';
import { Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormSummarySection, SectionTitle } from '../forms/components/FormSummarySection';
import { KaivuilmoitusFormValues } from './types';
import BasicInformationSummary from '../application/components/summary/KaivuilmoitusBasicInformationSummary';
import ContactsSummary from '../application/components/summary/ContactsSummary';
import InvoicingCustomerSummary from '../application/components/summary/InvoicingCustomerSummary';
import AttachmentSummary from '../application/components/summary/KaivuilmoitusAttachmentSummary';
import { ApplicationAttachmentMetadata } from '../application/types/application';
import AreaSummary from './components/AreaSummary';
import { HankeAlue } from '../types/hanke';
import HaittojenhallintaSummary from './components/HaittojenhallintaSummary';

type Props = {
  hankealueet: HankeAlue[];
  attachments: ApplicationAttachmentMetadata[] | undefined;
};

export const ReviewAndSend: React.FC<React.PropsWithChildren<Props>> = ({
  hankealueet,
  attachments,
}) => {
  const { getValues } = useFormContext<KaivuilmoitusFormValues>();
  const { t } = useTranslation();
  const {
    customerWithContacts,
    contractorWithContacts,
    propertyDeveloperWithContacts,
    representativeWithContacts,
    invoicingCustomer,
  } = getValues('applicationData');

  return (
    <div>
      <Box mb="var(--spacing-l)">
        <p>{t('kaivuilmoitusForm:yhteenveto:instructions')}</p>
      </Box>

      <SectionTitle>{t('form:headers:perustiedot')}</SectionTitle>
      <BasicInformationSummary formData={getValues()} />

      <SectionTitle>{t('form:labels:areas')}</SectionTitle>
      <AreaSummary formData={getValues()} />

      <SectionTitle>{t('hankePortfolio:tabit:haittojenHallinta')}</SectionTitle>
      <HaittojenhallintaSummary hankealueet={hankealueet} formData={getValues()} />

      <SectionTitle>{t('form:yhteystiedot:header')}</SectionTitle>
      <FormSummarySection>
        <ContactsSummary
          customerWithContacts={customerWithContacts}
          title={t('form:yhteystiedot:titles:customerWithContacts')}
        />
        <ContactsSummary
          customerWithContacts={contractorWithContacts}
          title={t('form:yhteystiedot:titles:contractorWithContacts')}
        />
        <ContactsSummary
          customerWithContacts={propertyDeveloperWithContacts}
          title={t('form:yhteystiedot:titles:rakennuttajat')}
        />
        <ContactsSummary
          customerWithContacts={representativeWithContacts}
          title={t('form:yhteystiedot:titles:representativeWithContacts')}
        />
        <InvoicingCustomerSummary invoicingCustomer={invoicingCustomer} />
      </FormSummarySection>

      <SectionTitle>{t('form:headers:liitteetJaLisatiedot')}</SectionTitle>
      <AttachmentSummary formData={getValues()} attachments={attachments} />
    </div>
  );
};

export default ReviewAndSend;
