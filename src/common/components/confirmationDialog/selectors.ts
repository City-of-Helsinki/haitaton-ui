import { RootState } from '../../redux/store';

export const getIsDialogOpen = () => (state: RootState) => state.confirmationDialog.isDialogOpen;
export const getRedirectUrl = () => (state: RootState) => state.confirmationDialog.redirectUrl;
