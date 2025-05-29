import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import gameSlice from "./slices/gameSlice";
import orderReducer from "./slices/orderSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameSlice,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
