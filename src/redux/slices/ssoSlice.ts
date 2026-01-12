import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface SsoSession {
  projectSlug: string;
  projectName: string;
  returnUrl: string;
  state?: string;
}

interface SsoState {
  sessionId: string | null;
  sessionData: SsoSession | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SsoState = {
  sessionId: null,
  sessionData: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchSsoSession = createAsyncThunk(
  'sso/fetchSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/sso/session?id=${sessionId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch SSO session');
      }

      const data = await response.json();
      return { sessionId, sessionData: data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch SSO session');
    }
  }
);

export const authorizeSso = createAsyncThunk(
  'sso/authorize',
  async (
    { sessionId, token }: { sessionId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/sso/authorize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to authorize SSO');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to authorize SSO'
      );
    }
  }
);

const ssoSlice = createSlice({
  name: 'sso',
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    clearSsoState: (state) => {
      state.sessionId = null;
      state.sessionData = null;
      state.error = null;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch SSO session
    builder
      .addCase(fetchSsoSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSsoSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessionId = action.payload.sessionId;
        state.sessionData = action.payload.sessionData;
      })
      .addCase(fetchSsoSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Authorize SSO
    builder
      .addCase(authorizeSso.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authorizeSso.fulfilled, (state) => {
        state.isLoading = false;
        state.sessionId = null;
        state.sessionData = null;
      })
      .addCase(authorizeSso.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSessionId, clearSsoState, clearError } = ssoSlice.actions;
export default ssoSlice.reducer;
