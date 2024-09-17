import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userRequest } from '../utils/requestMethods';

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
      const response = await userRequest.post('budgets/create', data);
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
      const response = await userRequest.get('budgets');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchSingleBudget = createAsyncThunk(
  'budget/get-single-budget',
  async (id, thunkAPI) => {
    try {
      const response = await userRequest.get(`budgets/${id}`);

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const editBudget = createAsyncThunk(
  'budget/edit-budget',
  async (data, thunkAPI) => {
    const { id } = data;
    try {
      const response = await userRequest.put(`budgets/${id}`, data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteBudget = createAsyncThunk(
  'budget/delete-budget',
  async (id, thunkAPI) => {
    try {
      const response = await userRequest.delete(`budgets/${id}`);

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const generateReport = createAsyncThunk(
  'budget/generate-report',
  async (id, thunkAPI) => {
    try {
      const response = await userRequest.post(`budgets/${id}/generate-report`);
      console.log(response);
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
