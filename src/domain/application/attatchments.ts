import api from '../api/api';
import { ApplicationAttachmentMetadata, AttachmentType } from './types/application';

// Get attachments metadata related to an application
export async function getAttachments(applicationId: number | null | undefined) {
  const { data } = await api.get<ApplicationAttachmentMetadata[]>(
    `/hakemukset/${applicationId}/liitteet`
  );
  return data;
}

// Upload attachment for application
export async function uploadAttachment({
  applicationId,
  attachmentType,
  file,
}: {
  applicationId: number;
  attachmentType: AttachmentType;
  file: File;
}) {
  const { data } = await api.post<ApplicationAttachmentMetadata>(
    `/hakemukset/${applicationId}/liitteet?tyyppi=${attachmentType}`,
    { liite: file },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
}

// Download attachment file
export async function getAttachmentFile(applicationId: number, attachmentId: string) {
  const { data } = await api.get<Blob>(
    `/hakemukset/${applicationId}/liitteet/${attachmentId}/content`,
    { responseType: 'blob' }
  );
  return URL.createObjectURL(data);
}

// Delete attachment
export async function deleteAttachment({
  applicationId,
  attachmentId,
}: {
  applicationId: number | null;
  attachmentId: string | undefined;
}) {
  const { data } = await api.delete(`/hakemukset/${applicationId}/liitteet/${attachmentId}`);
  return data;
}
