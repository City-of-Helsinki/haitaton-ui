import { useQuery } from 'react-query';
import { getAttachments } from '../attatchments';
import { ApplicationAttachmentMetadata } from '../types/application';

export default function useAttachments(id: number | null | undefined) {
  return useQuery<ApplicationAttachmentMetadata[]>(['attachments', id], () => getAttachments(id), {
    enabled: Boolean(id),
  });
}
