import { createSlice } from "@reduxjs/toolkit";

export const uploadDataSlice = createSlice({
  name: "uploadData",
  initialState: { value: {} },
  reducers: {
    setUploadData(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setUploadData } = uploadDataSlice.actions;
export default uploadDataSlice.reducer;
