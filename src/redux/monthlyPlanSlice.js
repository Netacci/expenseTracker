import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userRequest } from '../utils/requestMethods';

const initialState = {
  loading: false,
  error: null,
  plans: null,
  plan: null,
  report: null,
};

export const createMonthlyPlan = createAsyncThunk(
  'monthlyPlan/create',
  async (data, thunkAPI) => {
    try {
      const response = await userRequest.post('monthly-plans/create', data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchAllMonthlyPlans = createAsyncThunk(
  'monthlyPlan/fetch-all',
  async (_, thunkAPI) => {
    try {
      const response = await userRequest.get('monthly-plans');
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchMonthlyPlan = createAsyncThunk(
  'monthlyPlan/fetch-one',
  async (planId, thunkAPI) => {
    try {
      const response = await userRequest.get(`monthly-plans/${planId}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const editMonthlyPlan = createAsyncThunk(
  'monthlyPlan/edit',
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

export const deleteMonthlyPlan = createAsyncThunk(
  'monthlyPlan/delete',
  async (planId, thunkAPI) => {
    try {
      await userRequest.delete(`monthly-plans/${planId}`);
      return planId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createBucket = createAsyncThunk(
  'monthlyPlan/create-bucket',
  async ({ planId, name, description }, { dispatch }) => {
    const response = await userRequest.post(
      `monthly-plans/${planId}/buckets/create`,
      { name, description }
    );
    await dispatch(fetchMonthlyPlan(planId));
    return response.data.data;
  }
);

export const deleteBucket = createAsyncThunk(
  'monthlyPlan/delete-bucket',
  async ({ planId, bucketId }, { dispatch }) => {
    await userRequest.delete(
      `monthly-plans/${planId}/buckets/${bucketId}`
    );
    await dispatch(fetchMonthlyPlan(planId));
    return bucketId;
  }
);

export const editBucket = createAsyncThunk(
  'monthlyPlan/edit-bucket',
  async ({ planId, bucketId, name, description }, { dispatch }) => {
    const response = await userRequest.put(
      `monthly-plans/${planId}/buckets/${bucketId}`,
      { name, description }
    );
    await dispatch(fetchMonthlyPlan(planId));
    return response.data.data;
  }
);

export const generateReport = createAsyncThunk(
  'monthlyPlan/generate-report',
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

export const monthlyPlanSlice = createSlice({
  name: 'monthlyPlan',
  initialState,
  reducers: {
    resetPlan: (state) => {
      state.plan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editMonthlyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload;
      })
      .addCase(fetchAllMonthlyPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMonthlyPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchAllMonthlyPlans.rejected, (state) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchMonthlyPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload;
      })
      .addCase(fetchMonthlyPlan.rejected, (state) => {
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
      })
      .addCase(deleteMonthlyPlan.fulfilled, (state) => {
        state.plan = null;
      })
      .addCase(createMonthlyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload;
      })
      .addCase(createMonthlyPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMonthlyPlan.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { resetPlan } = monthlyPlanSlice.actions;
export default monthlyPlanSlice.reducer;
