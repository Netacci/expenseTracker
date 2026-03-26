import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userRequest } from '../utils/requestMethods';

const initialState = {
  loading: false,
  error: null,
  categories: null,
  expenses: null,
  loadingExpenses: false,
  recentExpenses: null,
};

export const createCategory = createAsyncThunk(
  'category/create',
  async (data, thunkAPI) => {
    const { planId, bucketId, ...body } = data;
    try {
      const response = await userRequest.post(
        `monthly-plans/${planId}/buckets/${bucketId}/category/create`,
        body
      );

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const createExpense = createAsyncThunk(
  'expense/create',
  async (data, thunkAPI) => {
    const { planId, bucketId, category_id, ...body } = data;
    try {
      const response = await userRequest.post(
        `monthly-plans/${planId}/buckets/${bucketId}/categories/${category_id}/expense/create`,
        body
      );

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const fetchAllCategories = createAsyncThunk(
  'category/fetch-all-categories',
  async ({ planId, bucketId }, thunkAPI) => {
    try {
      const response = await userRequest.get(
        `monthly-plans/${planId}/buckets/${bucketId}/categories`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const editCategory = createAsyncThunk(
  'category/edit-category',
  async (data, thunkAPI) => {
    const { planId, bucketId, category_id, ...body } = data;
    try {
      const response = await userRequest.put(
        `monthly-plans/${planId}/buckets/${bucketId}/categories/${category_id}`,
        body
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/delete-category',
  async ({ planId, bucketId, category_id }, thunkAPI) => {
    try {
      const response = await userRequest.delete(
        `monthly-plans/${planId}/buckets/${bucketId}/categories/${category_id}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const fetchAllExpenses = createAsyncThunk(
  'expenses/fetch-all-expenses',
  async ({ planId, bucketId, category_id }, thunkAPI) => {
    try {
      const response = await userRequest.get(
        `monthly-plans/${planId}/buckets/${bucketId}/categories/${category_id}/expenses`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const editExpense = createAsyncThunk(
  'expense/edit-expense',
  async (data, thunkAPI) => {
    const { planId, bucketId, category_id, expense_id, ...body } = data;
    try {
      const response = await userRequest.put(
        `monthly-plans/${planId}/buckets/${bucketId}/categories/${category_id}/expenses/${expense_id}`,
        body
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expense/delete-expense',
  async ({ planId, bucketId, category_id, expense_id }, thunkAPI) => {
    try {
      const response = await userRequest.delete(
        `monthly-plans/${planId}/buckets/${bucketId}/categories/${category_id}/expenses/${expense_id}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const fetchRecentExpenses = createAsyncThunk(
  'expense/get-recent-expenses',
  async (planId, thunkAPI) => {
    try {
      const response = await userRequest.get(
        `monthly-plans/${planId}/recent-expenses`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    resetExpenses: (state) => {
      state.expenses = null;
      state.loadingExpenses = false;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(editCategory.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchAllExpenses.pending, (state) => {
        state.loadingExpenses = true;
        state.error = null;
      })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => {
        state.loadingExpenses = false;
        state.expenses = action.payload;
      })

      .addCase(fetchAllExpenses.rejected, (state) => {
        state.loadingExpenses = false;
        state.error = false;
      })
      .addCase(fetchRecentExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.recentExpenses = action.payload;
      })
      .addCase(fetchRecentExpenses.rejected, (state) => {
        state.error = false;
        state.loading = false;
      });
  },
});

export const { resetExpenses } = expenseSlice.actions;

export default expenseSlice.reducer;
