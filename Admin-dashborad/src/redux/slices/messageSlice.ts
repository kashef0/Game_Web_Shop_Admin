import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../../types/Message";


interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Sätter hela meddelande listan
    setMessage(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
  },
});

export const { setMessage } = messageSlice.actions;

export default messageSlice.reducer;
