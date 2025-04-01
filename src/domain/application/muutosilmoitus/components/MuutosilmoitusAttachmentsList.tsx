import FileDownloadList from '../../../../common/components/fileDownloadList/FileDownloadList';
import { downloadAttachment } from '../muutosilmoitusAttachmentsApi';
import { MuutosilmoitusAttachmentMetadata } from '../types';

type Props = {
  attachments: MuutosilmoitusAttachmentMetadata[];
  allowDownload?: boolean;
};

export default function MuutosilmoitusAttachmentsList({
  attachments,
  allowDownload = true,
}: Readonly<Props>) {
  function download(file: MuutosilmoitusAttachmentMetadata) {
    return downloadAttachment(file.muutosilmoitusId, file.id);
  }

  return <FileDownloadList files={attachments} download={allowDownload ? download : undefined} />;
}
