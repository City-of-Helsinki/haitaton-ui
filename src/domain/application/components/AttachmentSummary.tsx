import React from 'react';
import { IconDocument } from 'hds-react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { ApplicationAttachmentMetadata } from '../types/application';

type Props = {
  attachments: ApplicationAttachmentMetadata[];
};

function AttachmentSummary({ attachments }: Props) {
  const { t } = useTranslation();

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('hankePortfolio:tabit:liitteet')}</SectionItemTitle>
      <SectionItemContent>
        {attachments.map((attachment) => (
          <p key={attachment.id}>
            <IconDocument aria-hidden size="xs" style={{ marginRight: 'var(--spacing-3-xs)' }} />
            {attachment.fileName}
          </p>
        ))}
      </SectionItemContent>
    </FormSummarySection>
  );
}

export default AttachmentSummary;
