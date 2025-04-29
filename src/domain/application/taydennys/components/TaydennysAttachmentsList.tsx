import FileDownloadList from '../../../../common/components/fileDownloadList/FileDownloadList';
import { downloadAttachment } from '../taydennysAttachmentsApi';
import { TaydennysAttachmentMetadata } from '../types';

type Props = {
  attachments: TaydennysAttachmentMetadata[];
  allowDownload?: boolean;
};

export default function TaydennysAttachmentsList({
  attachments,
  allowDownload = true,
}: Readonly<Props>) {
  function download(file: TaydennysAttachmentMetadata) {
    return downloadAttachment(file.taydennysId, file.id);
  }

  return <FileDownloadList files={attachments} download={allowDownload ? download : undefined} />;
}
