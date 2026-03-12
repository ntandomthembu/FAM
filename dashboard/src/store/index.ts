import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

const TOKEN_STORAGE_KEY = 'fmd_token';
const USER_STORAGE_KEY = 'fmd_user';

const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

const getStoredUser = () => {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
        return null;
    }
};

const clearStoredSession = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
};

const storedToken = getStoredToken();
const storedUser = getStoredUser();

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: storedUser as any,
        token: storedToken as string | null,
        isAuthenticated: Boolean(storedToken),
    },
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;

            localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            clearStoredSession();
        },
    },
});

// Dashboard slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: null as any,
        loading: false,
        error: null as string | null,
    },
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setDashboardData: (state, action: PayloadAction<any>) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export const { setLoading, setDashboardData, setError } = dashboardSlice.actions;

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        dashboard: dashboardSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;