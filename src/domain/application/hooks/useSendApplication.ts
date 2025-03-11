import { useQueryClient } from 'react-query';
import { sendApplication } from '../utils';
import { Application, PaperDecisionReceiver } from '../types/application';
import useDebouncedMutation from '../../../common/hooks/useDebouncedMutation';

type Options = {
  onSuccess: (data: Application) => void;
};

export default function useSendApplication(options?: Options) {
  const { onSuccess } = options || {};
  const queryClient = useQueryClient();

  return useDebouncedMutation(
    (variables: { id: number; paperDecisionReceiver: PaperDecisionReceiver | undefined | null }) =>
      sendApplication(variables.id, variables.paperDecisionReceiver),
    {
      async onSuccess(data) {
        await queryClient.invalidateQueries(['application', data.id], { refetchInactive: true });
        onSuccess && onSuccess(data);
      },
    },
  );
}
