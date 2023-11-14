import { IconDocument } from 'hds-react';
import FileDownloadLink from '../fileDownloadLink/FileDownloadLink';
import { AttachmentMetadata } from '../../types/attachment';

type Props = {
  files: AttachmentMetadata[];
  fileDownLoadFunction: (file: AttachmentMetadata) => Promise<string>;
};

export default function FileDownloadList({ files, fileDownLoadFunction }: Readonly<Props>) {
  return (
    <ul>
      {files.map((file) => (
        <li key={file.id} style={{ listStyle: 'none' }}>
          <IconDocument aria-hidden size="xs" style={{ marginRight: 'var(--spacing-3-xs)' }} />
          <FileDownloadLink
            linkText={file.fileName}
            fileName={file.fileName}
            queryKey={['attachmentContent', file.id]}
            queryFunction={() => fileDownLoadFunction(file)}
          />
        </li>
      ))}
    </ul>
  );
}
