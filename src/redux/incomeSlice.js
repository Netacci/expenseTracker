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
    const { id } = data;
    try {
      const response = await userRequest.post(
        `budgets/${id}/income/create`,
        data
      );

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const fetchAllIncomes = createAsyncThunk(
  'income/fetch-all-incomes',
  async (id, thunkAPI) => {
    try {
      const response = await userRequest.get(`budgets/${id}/incomes`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const editIncome = createAsyncThunk(
  'income/edit-income',
  async (data, thunkAPI) => {
    const { id, income_id } = data;
    try {
      const response = await userRequest.put(
        `budgets/${id}/incomes/${income_id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteIncome = createAsyncThunk(
  'income/delete-income',
  async ({ id, income_id }, thunkAPI) => {
    try {
      const response = await userRequest.delete(
        `budgets/${id}/incomes/${income_id}`
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
