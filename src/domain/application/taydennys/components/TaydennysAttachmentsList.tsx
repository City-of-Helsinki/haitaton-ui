import FileDownloadList from '../../../../common/components/fileDownloadList/FileDownloadList';
import { getAttachmentFile } from '../taydennysAttachmentsApi';
import { TaydennysAttachmentMetadata } from '../types';

type Props = {
  attachments: TaydennysAttachmentMetadata[];
};

export default function TaydennysAttachmentsList({ attachments }: Readonly<Props>) {
  function download(file: TaydennysAttachmentMetadata) {
    return getAttachmentFile(file.taydennysId, file.id);
  }

  return <FileDownloadList files={attachments} download={download} />;
}
