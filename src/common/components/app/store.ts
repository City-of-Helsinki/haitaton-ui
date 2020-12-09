import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { rootReducer } from './rootReducer';

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware({ immutableCheck: false })],
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types

// eslint-disable-next-line import/no-cycle
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
