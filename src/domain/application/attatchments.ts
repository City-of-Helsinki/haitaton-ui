import api from '../api/api';
import { ApplicationAttachmentMetadata, AttachmentType } from './types/application';

// Get attachments related to an application
export async function getAttachments(applicationId: number | null | undefined) {
  const response = await api.get<ApplicationAttachmentMetadata[]>(
    `/hakemukset/${applicationId}/liitteet`
  );
  return response.data;
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
  const response = await api.post<ApplicationAttachmentMetadata>(
    `/hakemukset/${applicationId}/liitteet?tyyppi=${attachmentType}`,
    { liite: file },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

// Download attachment file
export async function getAttachmentFile(attachmentId: string) {
  const response = await api.get<File>(`/hakemukset/${attachmentId}/content`);
  return response.data;
}

// Delete attachment
export async function deleteAttachment(attachmentId: string | undefined) {
  const response = await api.delete(`/hakemukset/${attachmentId}`);
  return response.data;
}
