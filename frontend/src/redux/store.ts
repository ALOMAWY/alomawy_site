// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { adminSlice } from "./adminSign";

export const store = configureStore({
  reducer: {
    admin: adminSlice.reducer,
  },
});
