import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth.slice';
import incidentReducer from './incident.slice';
import alertsReducer from './alerts.slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    incident: incidentReducer,
    alerts: alertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;