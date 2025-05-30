import React from 'react';
import { Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { JohtoselvitysFormValues } from './types';
import { FormSummarySection, SectionTitle } from '../forms/components/FormSummarySection';
import BasicInformationSummary from '../application/components/summary/JohtoselvitysBasicInformationSummary';
import AreaSummary from './components/AreaSummary';
import ContactsSummary from '../application/components/summary/ContactsSummary';
import AttachmentSummary from '../application/components/summary/AttachmentSummary';
import { ApplicationAttachmentMetadata } from '../application/types/application';

type Props = {
  attachments: ApplicationAttachmentMetadata[] | undefined;
};

export const ReviewAndSend: React.FC<React.PropsWithChildren<Props>> = ({ attachments }) => {
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

      <SectionTitle>{t('form:labels:areas')}</SectionTitle>
      <AreaSummary formData={getValues()} />

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
      </FormSummarySection>

      <SectionTitle>{t('hankePortfolio:tabit:liitteet')}</SectionTitle>
      {attachments && attachments.length > 0 ? (
        <AttachmentSummary attachments={attachments} />
      ) : null}
    </div>
  );
};

export default ReviewAndSend;
