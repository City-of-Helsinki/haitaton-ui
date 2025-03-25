import api from '../../api/api';
import { AttachmentType } from '../types/application';
import { MuutosilmoitusAttachmentMetadata } from './types';

// Upload attachment for muutosilmoitus
export async function uploadAttachment({
  muutosilmoitusId,
  attachmentType,
  file,
  abortSignal,
}: {
  muutosilmoitusId: string;
  attachmentType: AttachmentType;
  file: File;
  abortSignal?: AbortSignal;
}) {
  const { data } = await api.post<MuutosilmoitusAttachmentMetadata>(
    `/muutosilmoitukset/${muutosilmoitusId}/liitteet?tyyppi=${attachmentType}`,
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

// Download attachment file
export async function getAttachmentFile(muutosilmoitusId: string, attachmentId: string) {
  const { data } = await api.get<Blob>(
    `/muutosilmoitukset/${muutosilmoitusId}/liitteet/${attachmentId}/content`,
    { responseType: 'blob' },
  );
  return URL.createObjectURL(data);
}

// Delete attachment
export async function deleteAttachment({
  muutosilmoitusId,
  attachmentId,
}: {
  muutosilmoitusId: string | null;
  attachmentId: string | undefined;
}) {
  await api.delete(`/muutosilmoitukset/${muutosilmoitusId}/liitteet/${attachmentId}`);
}
