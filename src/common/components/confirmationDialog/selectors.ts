import { RootState } from '../app/store';

export const getIsDialogOpen = () => (state: RootState) => state.confirmationDialog.isDialogOpen;
export const getRedirectUrl = () => (state: RootState) => state.confirmationDialog.redirectUrl;
