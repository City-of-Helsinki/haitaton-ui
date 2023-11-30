import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../forms/components/FormSummarySection';
import { ApplicationAttachmentMetadata } from '../types/application';
import FileDownloadList from '../../../common/components/fileDownloadList/FileDownloadList';
import { getAttachmentFile } from '../attachments';

type Props = {
  attachments: ApplicationAttachmentMetadata[];
};

function AttachmentSummary({ attachments }: Props) {
  const { t } = useTranslation();

  const download = (file: ApplicationAttachmentMetadata) =>
    getAttachmentFile(file.applicationId, file.id);

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('hankePortfolio:tabit:liitteet')}</SectionItemTitle>
      <SectionItemContent>
        <FileDownloadList files={attachments} download={download} />
      </SectionItemContent>
    </FormSummarySection>
  );
}

export default AttachmentSummary;
