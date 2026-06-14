import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Page, Section, SectionType } from '@/domain';

interface DraftPageState {
  page: Page | null;
  originalPage: Page | null; // For dirty detection
  isDirty: boolean;
}

const initialState: DraftPageState = {
  page: null,
  originalPage: null,
  isDirty: false,
};

const draftPageSlice = createSlice({
  name: "draftPage",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<Page>) {
      state.page = action.payload;
      state.originalPage = JSON.parse(JSON.stringify(action.payload));
      state.isDirty = false;
    },
    updatePageTitle(state, action: PayloadAction<string>) {
      if (!state.page) return;
      state.page.title = action.payload;
      state.isDirty = true;
    },
    updateSection(
      state,
      action: PayloadAction<{
        sectionId: string;
        props: Record<string, unknown>;
      }>
    ) {
      if (!state.page) return;
      const section = state.page.sections.find(
        (s) => s.id === action.payload.sectionId
      );
      if (section) {
        section.props = { ...section.props, ...action.payload.props };
        state.isDirty = true;
      }
    },
    addSection(
      state,
      action: PayloadAction<{
        id: string;
        type: SectionType;
        props: Record<string, unknown>;
        index?: number;
      }>
    ) {
      if (!state.page) return;
      const newSection: Section = {
        id: action.payload.id,
        type: action.payload.type,
        props: action.payload.props,
      };
      if (
        action.payload.index !== undefined &&
        action.payload.index < state.page.sections.length
      ) {
        state.page.sections.splice(action.payload.index, 0, newSection);
      } else {
        state.page.sections.push(newSection);
      }
      state.isDirty = true;
    },
    removeSection(state, action: PayloadAction<string>) {
      if (!state.page) return;
      state.page.sections = state.page.sections.filter(
        (s) => s.id !== action.payload
      );
      state.isDirty = true;
    },
    reorderSections(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      if (!state.page) return;
      const { fromIndex, toIndex } = action.payload;
      const sections = state.page.sections;
      if (
        fromIndex < 0 ||
        fromIndex >= sections.length ||
        toIndex < 0 ||
        toIndex >= sections.length
      ) {
        return;
      }
      const [moved] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, moved);
      state.isDirty = true;
    },
    resetDraft(state) {
      if (state.originalPage) {
        state.page = JSON.parse(JSON.stringify(state.originalPage));
        state.isDirty = false;
      }
    },
    clearDraft(state) {
      state.page = null;
      state.originalPage = null;
      state.isDirty = false;
    },
  },
});

export const {
  setPage,
  updatePageTitle,
  updateSection,
  addSection,
  removeSection,
  reorderSections,
  resetDraft,
  clearDraft,
} = draftPageSlice.actions;

export default draftPageSlice.reducer;
