import { RootState } from '../../../common/components/app/store';

export const getFormData = () => (state: RootState) => state.hankeForm.hankeDataDraft;
