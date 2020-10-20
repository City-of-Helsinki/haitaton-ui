import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import projectsReducer from '../../../features/hanke/list/reducer';
import mapReducer from '../../../features/hanke/map/reducer';

const rootReducer = combineReducers({
  projects: projectsReducer,
  map: mapReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types

export default store;
