import { RootState } from '../../common/redux/store';

export const getIsLoading = () => (state: RootState) => state.loading.isLoading;
