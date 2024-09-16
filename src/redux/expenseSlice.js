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
    const { id } = data;
    try {
      const response = await userRequest.post(
        `budgets/${id}/category/create`,
        data
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
    const { id, category_id } = data;
    try {
      const response = await userRequest.post(
        `budgets/${id}/categories/${category_id}/expense/create`,
        data
      );

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const fetchAllCategories = createAsyncThunk(
  'category/fetch-all-categories',
  async (id, thunkAPI) => {
    try {
      const response = await userRequest.get(`budgets/${id}/categories`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const editCategory = createAsyncThunk(
  'category/edit-category',
  async (data, thunkAPI) => {
    const { id, category_id } = data;
    try {
      const response = await userRequest.put(
        `budgets/${id}/categories/${category_id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/delete-category',
  async ({ id, category_id }, thunkAPI) => {
    try {
      const response = await userRequest.delete(
        `budgets/${id}/categories/${category_id}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const fetchAllExpenses = createAsyncThunk(
  'expenses/fetch-all-expenses',
  async ({ id, category_id }, thunkAPI) => {
    try {
      const response = await userRequest.get(
        `budgets/${id}/categories/${category_id}/expenses`
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
    const { id, category_id, expense_id } = data;
    try {
      const response = await userRequest.put(
        `budgets/${id}/categories/${category_id}/expenses/${expense_id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expense/delete-expense',
  async ({ id, category_id, expense_id }, thunkAPI) => {
    try {
      const response = await userRequest.delete(
        `budgets/${id}/categories/${category_id}/expenses/${expense_id}`
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const fetchRecentExpenses = createAsyncThunk(
  'expense/get-recent-expenses',
  async (id, thunkAPI) => {
    console.log(id);
    try {
      const response = await userRequest.get(`budgets/${id}/recent-expenses`);
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
