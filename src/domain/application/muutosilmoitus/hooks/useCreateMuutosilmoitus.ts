import { useQueryClient } from 'react-query';
import { KaivuilmoitusData } from '../../types/application';
import useDebouncedMutation from '../../../../common/hooks/useDebouncedMutation';
import { createMuutosilmoitus } from '../muutosilmoitusApi';

export default function useCreateMuutosilmoitus<ApplicationData extends KaivuilmoitusData>() {
  const queryClient = useQueryClient();

  return useDebouncedMutation(createMuutosilmoitus<ApplicationData>, {
    async onSuccess(_, id) {
      await queryClient.invalidateQueries(['application', id], { refetchInactive: true });
    },
  });
}
