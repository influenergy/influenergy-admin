import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Collaboration {
  id: string;
  name: string;
  description: string;
  brand: string;
  creator: string;
  status: string;
  createdAt: string;
}

interface CollaborationState {
  list: Collaboration[];
}

const initialState: CollaborationState = {
  list: [],
};

const collaborationSlice = createSlice({
  name: "collaborations",
  initialState,
  reducers: {
    setCollaborations: (state, action: PayloadAction<Collaboration[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setCollaborations } = collaborationSlice.actions;

export default collaborationSlice.reducer;
