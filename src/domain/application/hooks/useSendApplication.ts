import { useQueryClient } from 'react-query';
import { sendApplication } from '../utils';
import useApplicationSendNotification from './useApplicationSendNotification';
import { Application } from '../types/application';
import useDebouncedMutation from '../../../common/hooks/useDebouncedMutation';

type Options = {
  onSuccess: (data: Application) => void;
};

export default function useSendApplication(options?: Options) {
  const { onSuccess } = options || {};
  const queryClient = useQueryClient();
  const { showSendSuccess, showSendError } = useApplicationSendNotification();

  return useDebouncedMutation(sendApplication, {
    onError() {
      showSendError();
    },
    async onSuccess(data) {
      showSendSuccess();
      await queryClient.invalidateQueries(['application', data.id], { refetchInactive: true });
      onSuccess && onSuccess(data);
    },
  });
}
