import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userRequest } from '../utils/requestMethods';
import { createMonthlyPlan, editMonthlyPlan } from './monthlyPlanSlice';

/** Legacy slice name "budget" — data is now monthly plans from `/monthly-plans`. */
const initialState = {
  loading: false,
  error: null,
  budgets: null,
  budget: null,
  report: null,
};

export const createBudget = createAsyncThunk(
  'budget/create',
  async (data, thunkAPI) => {
    try {
      const response = await userRequest.post('monthly-plans/create', data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchAllBudgets = createAsyncThunk(
  'budget/fetch-all-budgets',
  async (_, thunkAPI) => {
    try {
      const response = await userRequest.get('monthly-plans');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchSingleBudget = createAsyncThunk(
  'budget/get-single-budget',
  async (planId, thunkAPI) => {
    try {
      const response = await userRequest.get(`monthly-plans/${planId}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const editBudget = createAsyncThunk(
  'budget/edit-budget',
  async (data, thunkAPI) => {
    const { id, ...rest } = data;
    try {
      const response = await userRequest.put(`monthly-plans/${id}`, rest);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/delete-budget',
  async (planId, thunkAPI) => {
    try {
      await userRequest.delete(`monthly-plans/${planId}`);
      return planId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const generateReport = createAsyncThunk(
  'budget/generate-report',
  async (planId, thunkAPI) => {
    try {
      const response = await userRequest.post(
        `monthly-plans/${planId}/generate-report`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

/** Load persisted HTML for a plan (GET …/report). */
export const fetchSavedPlanReport = createAsyncThunk(
  'budget/fetch-saved-report',
  async (planId, thunkAPI) => {
    try {
      const response = await userRequest.get(`monthly-plans/${planId}/report`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    resetBudget: (state) => {
      state.budget = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(editBudget.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(editBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budget = action.payload;
      })
      .addCase(fetchAllBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchAllBudgets.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchSingleBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budget = action.payload;
      })
      .addCase(fetchSingleBudget.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      // Plan detail + list use `budget`; edits go through monthlyPlanSlice thunk
      .addCase(editMonthlyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.budget = action.payload;
        if (Array.isArray(state.budgets) && action.payload) {
          const pid =
            action.payload._id?.toString?.() ?? action.payload.id?.toString?.();
          state.budgets = state.budgets.map((b) => {
            const bid = b._id?.toString?.() ?? b.id?.toString?.();
            return bid === pid ? { ...b, ...action.payload } : b;
          });
        }
      })
      .addCase(createMonthlyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.budget = action.payload;
        if (Array.isArray(state.budgets) && action.payload) {
          const pid =
            action.payload._id?.toString?.() ?? action.payload.id?.toString?.();
          const exists = state.budgets.some(
            (b) =>
              (b._id?.toString?.() ?? b.id?.toString?.()) === pid
          );
          if (!exists) {
            state.budgets = [action.payload, ...state.budgets];
          }
        }
      })
      .addCase(generateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload.report;
      })
      .addCase(generateReport.rejected, (state) => {
        state.loading = false;
        state.error = false;
      });
  },
});

export const { resetBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
