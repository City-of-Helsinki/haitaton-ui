import { useQueryClient } from 'react-query';
import { sendApplication } from '../utils';
import { Application, PaperDecisionReceiver } from '../types/application';
import useDebouncedMutation from '../../../common/hooks/useDebouncedMutation';
import { sendMuutosilmoitus } from '../muutosilmoitus/muutosilmoitusApi';

type Options = {
  isMuutosilmoitus?: boolean;
  onSuccess?: (data: Application) => void;
};

/**
 * Send application or muutosilmoitus to Allu.
 */
export default function useSendApplication(options?: Options) {
  const { isMuutosilmoitus, onSuccess } = options || {};
  const queryClient = useQueryClient();

  return useDebouncedMutation(
    (variables: {
      id: number | string;
      paperDecisionReceiver: PaperDecisionReceiver | undefined | null;
    }) =>
      isMuutosilmoitus
        ? sendMuutosilmoitus(variables.id as string, variables.paperDecisionReceiver)
        : sendApplication(variables.id as number, variables.paperDecisionReceiver),
    {
      async onSuccess(data) {
        await queryClient.invalidateQueries(['application', data.id], { refetchInactive: true });
        onSuccess && onSuccess(data);
      },
    },
  );
}
