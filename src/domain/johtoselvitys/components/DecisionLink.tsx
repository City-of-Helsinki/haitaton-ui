import { IconDownload, IconSize } from 'hds-react';
import api from '../../api/api';
import FileDownloadLink from '../../../common/components/fileDownloadLink/FileDownloadLink';

async function getDecision(id: number | null): Promise<string> {
  const { data } = await api.get<Blob>(`hakemukset/${id}/paatos`, { responseType: 'blob' });
  return URL.createObjectURL(data);
}

type Props = {
  applicationId: number | null;
  linkText: string;
  filename: string | undefined | null;
};

function DecisionLink({ linkText, filename, applicationId }: Props) {
  return (
    <FileDownloadLink
      linkText={linkText}
      fileName={filename}
      linkIcon={
        <IconDownload
          aria-hidden
          size={IconSize.ExtraSmall}
          style={{ marginRight: 'var(--spacing-3-xs)' }}
        />
      }
      queryKey={['decision', applicationId]}
      queryFunction={() => getDecision(applicationId)}
    />
  );
}

export default DecisionLink;
