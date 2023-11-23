import { useQuery } from 'react-query';
import { getAttachments } from './hankeAttachmentsApi';
import { HankeAttachmentMetadata } from './types';
import { HANKE_ATTACHMENTS_QUERY_KEY } from './constants';

export default function useHankeAttachments(hankeTunnus: string | null | undefined) {
  return useQuery<HankeAttachmentMetadata[]>(
    [HANKE_ATTACHMENTS_QUERY_KEY, hankeTunnus],
    () => getAttachments(hankeTunnus),
    {
      enabled: Boolean(hankeTunnus),
    },
  );
}
