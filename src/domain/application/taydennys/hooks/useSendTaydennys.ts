import { useQueryClient } from 'react-query';
import { Application, JohtoselvitysData, KaivuilmoitusData } from '../../types/application';
import useDebouncedMutation from '../../../../common/hooks/useDebouncedMutation';
import { sendTaydennys } from '../taydennysApi';

type Options = {
  onSuccess: (data: Application) => void;
};

export default function useSendTaydennys(options?: Options) {
  const { onSuccess } = options || {};
  const queryClient = useQueryClient();

  return useDebouncedMutation(
    (id: string) => sendTaydennys<JohtoselvitysData | KaivuilmoitusData>(id),
    {
      async onSuccess(data) {
        await queryClient.invalidateQueries(['application', data.id], { refetchInactive: true });
        onSuccess && onSuccess(data);
      },
    },
  );
}
