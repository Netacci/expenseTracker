import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userRequest } from '../utils/requestMethods';

const initialState = {
  loading: false,
  error: null,
  user: null,
};

export const fetchUserDetails = createAsyncThunk(
  'user/fetch-user-details',
  async (_, thunkAPI) => {
    try {
      const response = await userRequest.get('user');

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (_, thunkAPI) => {
    try {
      const response = await userRequest.delete('user');

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const changePassword = createAsyncThunk(
  'user/change-password',
  async (data, thunkAPI) => {
    try {
      const response = await userRequest.put('user/change-password', data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const editAccount = createAsyncThunk(
  'user/edit-profile',
  async (data, thunkAPI) => {
    try {
      const response = await userRequest.put('user/edit-profile', data);

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(editAccount.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(editAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      });
  },
});

export default userSlice.reducer;
