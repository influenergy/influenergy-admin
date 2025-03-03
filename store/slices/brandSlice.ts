import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Brand {
  id: string;
  name: string;
  email: string;
}

interface BrandState {
  list: Brand[];
}

const initialState: BrandState = {
  list: [],
};

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setBrands: (state, action: PayloadAction<Brand[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setBrands } = brandSlice.actions;
export default brandSlice.reducer;
