import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Creator {
  id: string;
  name: string;
  email: string;
}

interface CreatorState {
  list: Creator[];
}

const initialState: CreatorState = {
  list: [],
};

const creatorSlice = createSlice({
  name: "creators",
  initialState,
  reducers: {
    setCreators: (state, action: PayloadAction<Creator[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setCreators } = creatorSlice.actions;
export default creatorSlice.reducer;
