import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userRequest } from '../utils/requestMethods';

const initialState = {
  loading: false,
  error: null,
  subscriptions: [],
};

export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetch-all',
  async (_, thunkAPI) => {
    try {
      const response = await userRequest.get('subscriptions');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscription/create',
  async (payload, thunkAPI) => {
    try {
      const response = await userRequest.post('subscriptions/create', payload);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'subscription/update',
  async ({ id, ...payload }, thunkAPI) => {
    try {
      const response = await userRequest.put(`subscriptions/${id}`, payload);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  'subscription/delete',
  async (id, thunkAPI) => {
    try {
      await userRequest.delete(`subscriptions/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload || [];
      })
      .addCase(fetchSubscriptions.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.subscriptions = [action.payload, ...(state.subscriptions || [])];
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        const id = action.payload?._id?.toString?.() ?? action.payload?.id?.toString?.();
        state.subscriptions = (state.subscriptions || []).map((sub) => {
          const sid = sub?._id?.toString?.() ?? sub?.id?.toString?.();
          return sid === id ? action.payload : sub;
        });
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        const id = action.payload?.toString?.() ?? String(action.payload);
        state.subscriptions = (state.subscriptions || []).filter((sub) => {
          const sid = sub?._id?.toString?.() ?? sub?.id?.toString?.();
          return sid !== id;
        });
      });
  },
});

export default subscriptionSlice.reducer;
