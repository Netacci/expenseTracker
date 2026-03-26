import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import budgetReducer from './budgetSlice';
import monthlyPlanReducer from './monthlyPlanSlice';
import incomeReducer from './incomeSlice';
import expenseReducer from './expenseSlice';
import subscriptionReducer from './subscriptionSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  budget: budgetReducer,
  monthlyPlan: monthlyPlanReducer,
  income: incomeReducer,
  expense: expenseReducer,
  subscription: subscriptionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
