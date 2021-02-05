import { combineReducers } from '@reduxjs/toolkit';
import hankeFormReducer from '../../domain/hanke/edit/reducer';
import mapReducer from '../../domain/map/reducer';
import confirmationDialogReducer from '../components/confirmationDialog/reducer';

export const rootReducer = combineReducers({
  map: mapReducer,
  hankeForm: hankeFormReducer,
  confirmationDialog: confirmationDialogReducer,
});
