import { combineReducers } from '@reduxjs/toolkit';
import hankeFormReducer from '../../domain/hanke/edit/reducer';
import mapReducer from '../../domain/map/reducer';
import confirmationDialogReducer from '../components/confirmationDialog/reducer';
import appReducer from '../../domain/app/reducer';

export const rootReducer = combineReducers({
  map: mapReducer,
  hankeForm: hankeFormReducer,
  confirmationDialog: confirmationDialogReducer,
  app: appReducer,
});
