import { useMutation } from 'react-query';
import { deleteAttachment } from '../attatchments';

export default function useAttachmentDelete() {
  return useMutation(deleteAttachment);
}
