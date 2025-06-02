import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Games } from "../../types/Game";


// typ för tillståndet som hanterar spel listan
interface GameState {
  games: Games[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
// initialt tillstånd med tom spel lista
const initialState: GameState = {
  games: [],
  status: "idle",
  error: null,
};
// skapar slice med reducer och actions för spelhantering
const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
     // Sätter hela spel listan och markerar status som lyckad
    setGames(state, action: PayloadAction<Games[]>) {
      state.games = action.payload;
      state.status = "succeeded";
    },
    // lägga till nytt spel, sätter status till loading
    addGame(state) {
      state.status = "loading";
      state.error = null;
    },
    // lägger till ett spel i listan och sätter status som lyckad
    addGameSuccess(state, action: PayloadAction<Games>) {
      state.games.push(action.payload);
      state.status = "succeeded";
    },
    // sätter status som failed och sparar felmeddelandet
    addGameFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    // återställer status och felmeddelande till initialt läge
    resetGameState(state) {
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  setGames,
  addGame,
  addGameSuccess,
  addGameFailure,
  resetGameState,
} = gameSlice.actions;

export default gameSlice.reducer;
