import { RootState } from '../../../common/redux/store';

export const getFormData = () => (state: RootState) => state.hankeForm.hankeDataDraft;
export const getHasFormChanged = () => (state: RootState) => state.hankeForm.hasFormChanged;
export const getShowNotification = () => (state: RootState) => state.hankeForm.showNotification;
