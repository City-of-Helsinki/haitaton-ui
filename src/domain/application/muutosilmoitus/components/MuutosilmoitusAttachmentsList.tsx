import FileDownloadList from '../../../../common/components/fileDownloadList/FileDownloadList';
import { getAttachmentFile } from '../muutosilmoitusAttachmentsApi';
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
    return getAttachmentFile(file.muutosilmoitusId, file.id);
  }

  return <FileDownloadList files={attachments} download={allowDownload ? download : undefined} />;
}
