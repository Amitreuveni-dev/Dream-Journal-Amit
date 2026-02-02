import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { dreamsApi } from './api/dreamsApi';
import authReducer from './slices/authSlice';
import dreamsReducer from './slices/dreamsSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [dreamsApi.reducerPath]: dreamsApi.reducer,
    auth: authReducer,
    dreams: dreamsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, dreamsApi.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
