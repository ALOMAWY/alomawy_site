import { createSlice } from "@reduxjs/toolkit";
import { getItemFromLocalStorage, setItemInLocalStorage, removeItemInLocalStorage } from "../utils/localStorage";

const SESSION_KEY = "admin_session";

interface initialStateInterface {
  user: true | null;
}

const initialState: initialStateInterface = {
  user: getItemFromLocalStorage<boolean | null>(SESSION_KEY, null) ? true : null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    signResolved: (state) => {
      state.user = true;
      setItemInLocalStorage(SESSION_KEY, true);
    },
    signRejected: (state) => {
      state.user = null;
      removeItemInLocalStorage(SESSION_KEY);
    },
    signOut: (state) => {
      state.user = null;
      removeItemInLocalStorage(SESSION_KEY);
    },
  },
});

export const { signResolved, signRejected, signOut } = adminSlice.actions;
export default adminSlice.reducer;
