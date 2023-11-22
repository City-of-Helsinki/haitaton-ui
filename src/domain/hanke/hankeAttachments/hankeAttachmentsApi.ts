import api from '../../api/api';
import { HankeAttachmentMetadata } from './types';

// Get attachments metadata related to hanke
export async function getAttachments(hankeTunnus?: string | null) {
  const { data } = await api.get<HankeAttachmentMetadata[]>(`/hankkeet/${hankeTunnus}/liitteet`);
  return data;
}

// Upload attachment for hanke
export async function uploadAttachment({
  hankeTunnus,
  file,
  abortSignal,
}: {
  hankeTunnus: string;
  file: File;
  abortSignal?: AbortSignal;
}) {
  const { data } = await api.post<HankeAttachmentMetadata>(
    `/hankkeet/${hankeTunnus}/liitteet`,
    { liite: file },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: abortSignal,
    },
  );
  return data;
}

// Download hanke attachment file
export async function getAttachmentFile(hankeTunnus: string, attachmentId: string) {
  const { data } = await api.get<Blob>(
    `/hankkeet/${hankeTunnus}/liitteet/${attachmentId}/content`,
    { responseType: 'blob' },
  );
  return URL.createObjectURL(data);
}

// Delete hanke attachment
export async function deleteAttachment({
  hankeTunnus,
  attachmentId,
}: {
  hankeTunnus: string;
  attachmentId: string;
}) {
  await api.delete(`/hankkeet/${hankeTunnus}/liitteet/${attachmentId}`);
}
