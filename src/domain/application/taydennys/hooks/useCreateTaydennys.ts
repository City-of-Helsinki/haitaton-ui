import { useQueryClient } from 'react-query';
import { createTaydennys } from '../taydennysApi';
import { JohtoselvitysData, KaivuilmoitusData } from '../../types/application';
import useDebouncedMutation from '../../../../common/hooks/useDebouncedMutation';

export default function useCreateTaydennys<
  ApplicationData extends JohtoselvitysData | KaivuilmoitusData,
>() {
  const queryClient = useQueryClient();

  return useDebouncedMutation(createTaydennys<ApplicationData>, {
    async onSuccess(_, id) {
      await queryClient.invalidateQueries(['application', id], { refetchInactive: true });
    },
  });
}
