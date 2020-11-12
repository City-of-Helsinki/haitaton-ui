import { RootState } from '../../../common/components/app/store';

export const getFormData = (state: RootState) => state.hankeForm.hankeData;
export const getRequestStatus = (state: RootState) => state.hankeForm.requestStatus;
