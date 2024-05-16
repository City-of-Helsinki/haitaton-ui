import { Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SectionTitle } from '../forms/components/FormSummarySection';
import { KaivuilmoitusFormValues } from './types';
import BasicInformationSummary from '../application/components/summary/KaivuilmoitusBasicInformationSummary';
import AttachmentSummary from '../application/components/summary/KaivuilmoitusAttachmentSummary';
import React from 'react';
import { ApplicationAttachmentMetadata } from '../application/types/application';

type Props = {
  attachments: ApplicationAttachmentMetadata[] | undefined;
};

export const ReviewAndSend: React.FC<React.PropsWithChildren<Props>> = ({ attachments }) => {
  const { getValues } = useFormContext<KaivuilmoitusFormValues>();
  const { t } = useTranslation();

  return (
    <div>
      <Box mb="var(--spacing-l)">
        <p>{t('kaivuilmoitusForm:yhteenveto:instructions')}</p>
      </Box>

      <SectionTitle>{t('form:headers:perustiedot')}</SectionTitle>
      <BasicInformationSummary formData={getValues()} />

      <SectionTitle>{t('form:headers:liitteetJaLisatiedot')}</SectionTitle>
      <AttachmentSummary formData={getValues()} attachments={attachments} />
    </div>
  );
};

export default ReviewAndSend;
