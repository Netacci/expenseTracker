import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userRequest } from '../utils/requestMethods';

const initialState = {
  loading: false,
  error: null,
  incomes: null,
};

export const createIncome = createAsyncThunk(
  'income/create',
  async (data, thunkAPI) => {
    const { planId, ...body } = data;
    try {
      const response = await userRequest.post(
        `monthly-plans/${planId}/incomes/create`,
        body
      );

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const fetchAllIncomes = createAsyncThunk(
  'income/fetch-all-incomes',
  async (planId, thunkAPI) => {
    try {
      const response = await userRequest.get(
        `monthly-plans/${planId}/incomes`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const editIncome = createAsyncThunk(
  'income/edit-income',
  async (data, thunkAPI) => {
    const { planId, income_id, ...body } = data;
    try {
      const response = await userRequest.put(
        `monthly-plans/${planId}/incomes/${income_id}`,
        body
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteIncome = createAsyncThunk(
  'income/delete-income',
  async ({ planId, income_id }, thunkAPI) => {
    try {
      const response = await userRequest.delete(
        `monthly-plans/${planId}/incomes/${income_id}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(editIncome.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(editIncome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editIncome.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAllIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload;
      })
      .addCase(fetchAllIncomes.rejected, (state) => {
        state.loading = false;
        state.error = false;
      });
  },
});

export default incomeSlice.reducer;
