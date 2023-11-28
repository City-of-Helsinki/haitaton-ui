import { useTranslation } from 'react-i18next';
import { AttachmentMetadata } from '../../../../common/types/attachment';
import FileDownloadList from '../../../../common/components/fileDownloadList/FileDownloadList';
import {
  FormSummarySection,
  SectionItemContent,
  SectionItemTitle,
} from '../../../forms/components/FormSummarySection';
import { getAttachmentFile } from '../../hankeAttachments/hankeAttachmentsApi';
import { HankeAttachmentMetadata } from '../../hankeAttachments/types';

type Props = {
  hankeTunnus: string;
  attachments: HankeAttachmentMetadata[];
};

function AttachmentSummary({ hankeTunnus, attachments }: Readonly<Props>) {
  const { t } = useTranslation();

  function downloadFile(file: AttachmentMetadata) {
    return getAttachmentFile(hankeTunnus, file.id);
  }

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('form:labels:addedFiles')}</SectionItemTitle>
      <SectionItemContent>
        <FileDownloadList files={attachments} fileDownLoadFunction={downloadFile} />
      </SectionItemContent>
    </FormSummarySection>
  );
}

export default AttachmentSummary;
