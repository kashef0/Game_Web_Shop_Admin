import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../../types/Order";
// Typ för order tillståndet i Redux
interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}
// Initialt tillstånd tom lista ingen laddning eller fel
const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};
// slice med reducer funktioner och actions för orderhantering
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // sätter hela listan med ordrar och resetar laddningsstatus och fel
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    // lägger till en ny order i början av listan
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },
    // uppdaterar en existerande order baserat på dess _id
    updateOrder(state, action: PayloadAction<Order>) {
      const index = state.orders.findIndex(o => o._id === action.payload._id);
      if (index !== -1) state.orders[index] = action.payload;
    },
    // tar bort en order baserat på _id
    deleteOrder(state, action: PayloadAction<string>) {
      state.orders = state.orders.filter(o => o._id !== action.payload);
    },
    // sätter laddningsstatus (true/false)
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // sätter felmeddelande eller null om inget fel
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  setLoading,
  setError,
} = orderSlice.actions;

export default orderSlice.reducer;
