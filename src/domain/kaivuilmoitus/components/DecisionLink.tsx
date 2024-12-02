import React from 'react';
import { IconDownload } from 'hds-react';
import api from '../../api/api';
import FileDownloadLink from '../../../common/components/fileDownloadLink/FileDownloadLink';

async function getDecision(id: string | null): Promise<string> {
  const { data } = await api.get<Blob>(`/paatokset/${id}`, { responseType: 'blob' });
  return URL.createObjectURL(data);
}

type Props = {
  id: string;
  linkText: string;
  filename: string | undefined | null;
};

function DecisionLink({ linkText, filename, id }: Props) {
  return (
    <FileDownloadLink
      linkText={linkText}
      fileName={filename}
      linkIcon={
        <IconDownload aria-hidden size="xs" style={{ marginRight: 'var(--spacing-3-xs)' }} />
      }
      queryKey={['decision', id]}
      queryFunction={() => getDecision(id)}
    />
  );
}

export default DecisionLink;
