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

  const download = (file: AttachmentMetadata) => getAttachmentFile(hankeTunnus, file.id);

  return (
    <FormSummarySection>
      <SectionItemTitle>{t('form:labels:addedFiles')}</SectionItemTitle>
      <SectionItemContent>
        <FileDownloadList files={attachments} download={download} />
      </SectionItemContent>
    </FormSummarySection>
  );
}

export default AttachmentSummary;
