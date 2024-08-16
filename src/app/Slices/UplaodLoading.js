import { createSlice } from "@reduxjs/toolkit";

export const uploadSlice = createSlice({
  name: "uploadLoading",
  initialState: { value: false },
  reducers: {
    setUpload(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
