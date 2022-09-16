import { combineReducers } from '@reduxjs/toolkit';
import hankePortfolioReducer from '../../domain/hanke/portfolio/reducer';
import mapReducer from '../../domain/map/reducer';
import confirmationDialogReducer from '../components/confirmationDialog/reducer';
import appReducer from '../../domain/app/reducer';

export const rootReducer = combineReducers({
  map: mapReducer,
  hankePortfolio: hankePortfolioReducer,
  confirmationDialog: confirmationDialogReducer,
  app: appReducer,
});
