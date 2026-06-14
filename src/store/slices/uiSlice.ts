import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  selectedSectionId: string | null;
  sidebarOpen: boolean;
  previewMode: boolean;
  loading: boolean;
  toastMessage: string | null;
  toastType: "success" | "error" | "info" | null;
}

const initialState: UIState = {
  selectedSectionId: null,
  sidebarOpen: true,
  previewMode: false,
  loading: false,
  toastMessage: null,
  toastType: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedSection(state, action: PayloadAction<string | null>) {
      state.selectedSectionId = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setPreviewMode(state, action: PayloadAction<boolean>) {
      state.previewMode = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    showToast(
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "info";
      }>
    ) {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    clearToast(state) {
      state.toastMessage = null;
      state.toastType = null;
    },
  },
});

export const {
  setSelectedSection,
  toggleSidebar,
  setSidebarOpen,
  setPreviewMode,
  setLoading,
  showToast,
  clearToast,
} = uiSlice.actions;

export default uiSlice.reducer;
