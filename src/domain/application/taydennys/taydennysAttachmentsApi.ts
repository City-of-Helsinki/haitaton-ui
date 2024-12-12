import api from '../../api/api';
import { AttachmentType } from '../types/application';
import { TaydennysAttachmentMetadata } from './types';

// Upload attachment for täydennys
export async function uploadAttachment({
  taydennysId,
  attachmentType,
  file,
  abortSignal,
}: {
  taydennysId: string;
  attachmentType: AttachmentType;
  file: File;
  abortSignal?: AbortSignal;
}) {
  const { data } = await api.post<TaydennysAttachmentMetadata>(
    `/taydennykset/${taydennysId}/liitteet?tyyppi=${attachmentType}`,
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
export async function getAttachmentFile(taydennysId: string, attachmentId: string) {
  const { data } = await api.get<Blob>(
    `/taydennykset/${taydennysId}/liitteet/${attachmentId}/content`,
    { responseType: 'blob' },
  );
  return URL.createObjectURL(data);
}

// Delete attachment
export async function deleteAttachment({
  taydennysId,
  attachmentId,
}: {
  taydennysId: string | null;
  attachmentId: string | undefined;
}) {
  await api.delete(`/taydennykset/${taydennysId}/liitteet/${attachmentId}`);
}
