import { RootState } from '../../../common/components/app/store';

export const getFormData = () => (state: RootState) => state.hankeForm.hankeDataDraft;
export const getHasFormChanged = () => (state: RootState) => state.hankeForm.hasFormChanged;
export const getIsConfirmationDialogOpen = () => (state: RootState) =>
  state.hankeForm.isConfirmationDialogOpen;
