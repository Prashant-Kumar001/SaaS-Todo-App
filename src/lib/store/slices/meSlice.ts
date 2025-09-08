import { ISubscription, ITodo, IUser } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type DashboardState = {
  user: IUser | null;
  todos: ITodo[];
  subscription: ISubscription | null;
  loading: boolean;
  error: string;
  Has_db: boolean;
};

const initialState: DashboardState = {
  user: null,
  todos: [],
  subscription: null,
  loading: true,
  error: "",
  Has_db: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {

    setHas_db: (state, action: PayloadAction<boolean>) => {
      state.Has_db = action.payload
    },

    setDashboardData: (
      state,
      action: PayloadAction<Omit<DashboardState, "loading">>
    ) => {
      state.user = action.payload?.user;
      state.todos = action.payload?.todos;
      state.subscription = action.payload?.subscription;
    },

    addTodos: (state, action: PayloadAction<ITodo>) => {
      state.todos = [...state.todos, action.payload];
    },

    toggleTodos: (state, action: PayloadAction<ITodo>) => {
      const next = state.todos.map((t) =>
        t.id === action.payload.id
          ? { ...t, ...action.payload }
          : t
      );
      state.todos = next;
    },

    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },



    clearDashboard: () => initialState,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setHas_db,
  setDashboardData,
  clearDashboard,
  addTodos,
  deleteTodo,
  toggleTodos,
  setLoading,
  setError,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
