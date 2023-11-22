import { IconDocument } from 'hds-react';
import FileDownloadLink from '../fileDownloadLink/FileDownloadLink';
import { AttachmentMetadata } from '../../types/attachment';

type FileDownloadListProps<T extends AttachmentMetadata> = {
  files: T[];
  download: (file: T) => Promise<string>;
};

export default function FileDownloadList<T extends AttachmentMetadata>({
  files,
  download,
}: Readonly<FileDownloadListProps<T>>) {
  return (
    <ul>
      {files.map((file) => (
        <li key={file.id} style={{ listStyle: 'none' }}>
          <IconDocument aria-hidden size="xs" style={{ marginRight: 'var(--spacing-3-xs)' }} />
          <FileDownloadLink
            linkText={file.fileName}
            fileName={file.fileName}
            queryKey={['attachmentContent', file.id]}
            queryFunction={() => download(file)}
          />
        </li>
      ))}
    </ul>
  );
}
