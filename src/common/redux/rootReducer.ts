import { combineReducers } from '@reduxjs/toolkit';
import projectsReducer from '../../domain/hanke/list/reducer';
import hankeFormReducer from '../../domain/hanke/edit/reducer';
import mapReducer from '../../domain/map/reducer';
import confirmationDialogReducer from '../components/confirmationDialog/reducer';

export const rootReducer = combineReducers({
  projects: projectsReducer,
  map: mapReducer,
  hankeForm: hankeFormReducer,
  confirmationDialog: confirmationDialogReducer,
});
