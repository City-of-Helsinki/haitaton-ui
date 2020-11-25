import { combineReducers } from '@reduxjs/toolkit';
import projectsReducer from '../../../domain/hanke/list/reducer';
import hankeFormReducer from '../../../domain/hanke/edit/reducer';
import confirmationDialogReducer from '../confirmationDialog/reducer';

// eslint-disable-next-line import/no-cycle
import mapReducer from '../../../domain/map/reducer';

export const rootReducer = combineReducers({
  projects: projectsReducer,
  map: mapReducer,
  hankeForm: hankeFormReducer,
  confirmationDialog: confirmationDialogReducer,
});
