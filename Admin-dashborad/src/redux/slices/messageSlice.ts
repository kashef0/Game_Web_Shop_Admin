import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../../types/Message";


interface MessageState {
  messages: Message[];
  loading: boolean
}

const initialState: MessageState = {
  messages: [],
  loading: false
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Sätter hela meddelande listan
    setMessage(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>){
        state.loading = action.payload;
    },
  },
});

export const { setMessage, setLoading } = messageSlice.actions;

export default messageSlice.reducer;
