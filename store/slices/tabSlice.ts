import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabState {
  activeTab: "creators" | "brands";
}

const initialState: TabState = {
  activeTab: null,
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<"creators" | "brands">) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;
