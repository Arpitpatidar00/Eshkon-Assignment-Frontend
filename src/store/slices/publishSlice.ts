import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DiffResult, VersionBump } from '@/domain';

interface PublishState {
  status: "idle" | "previewing" | "publishing" | "success" | "error";
  currentVersion: string | null;
  newVersion: string | null;
  bump: VersionBump | null;
  diff: DiffResult | null;
  changelog: string | null;
  error: string | null;
}

const initialState: PublishState = {
  status: "idle",
  currentVersion: null,
  newVersion: null,
  bump: null,
  diff: null,
  changelog: null,
  error: null,
};

const publishSlice = createSlice({
  name: "publish",
  initialState,
  reducers: {
    setPublishPreview(
      state,
      action: PayloadAction<{
        currentVersion: string | null;
        newVersion: string;
        bump: VersionBump;
        diff: DiffResult;
        changelog: string;
      }>
    ) {
      state.status = "previewing";
      state.currentVersion = action.payload.currentVersion;
      state.newVersion = action.payload.newVersion;
      state.bump = action.payload.bump;
      state.diff = action.payload.diff;
      state.changelog = action.payload.changelog;
      state.error = null;
    },
    startPublish(state) {
      state.status = "publishing";
      state.error = null;
    },
    publishSuccess(
      state,
      action: PayloadAction<{ version: string; changelog: string }>
    ) {
      state.status = "success";
      state.currentVersion = action.payload.version;
      state.newVersion = null;
      state.changelog = action.payload.changelog;
      state.error = null;
    },
    publishError(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },
    resetPublish(state) {
      state.status = "idle";
      state.newVersion = null;
      state.bump = null;
      state.diff = null;
      state.changelog = null;
      state.error = null;
    },
  },
});

export const {
  setPublishPreview,
  startPublish,
  publishSuccess,
  publishError,
  resetPublish,
} = publishSlice.actions;

export default publishSlice.reducer;
