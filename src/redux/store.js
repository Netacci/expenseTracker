import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import budgetReducer from './budgetSlice';
import incomeReducer from './incomeSlice';
import expenseReducer from './expenseSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  budget: budgetReducer,
  income: incomeReducer,
  expense: expenseReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
