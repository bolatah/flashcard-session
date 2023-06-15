import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFlashcard } from "@/types/Flashcard";

interface FlashcardState {
  flashcards: IFlashcard[];
  dialogs: {
    isAddDialogOpen: boolean;
    isEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    isPreviewDialogOpen: boolean;
  };
  selectedFlashcard: IFlashcard | null;
  previewFlashcard: IFlashcard | null;
  previewIndex: number;
  englishText: string;
  turkishText: string;
  searchText: string;
}

const initialState: FlashcardState = {
  flashcards: [],
  dialogs: {
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
    isPreviewDialogOpen: false,
  },
  selectedFlashcard: null,
  previewFlashcard: null,
  previewIndex: 0,
  englishText: "",
  turkishText: "",
  searchText: "",
};

const flashcardSlice = createSlice({
  name: "flashcard",
  initialState,
  reducers: {
    setFlashcards: (state, action: PayloadAction<IFlashcard[]>) => {
      state.flashcards = action.payload;
    },
    setSelectedFlashcard: (state, action: PayloadAction<IFlashcard | null>) => {
      state.selectedFlashcard = action.payload;
    },
    setPreviewFlashcard: (state, action: PayloadAction<IFlashcard | null>) => {
      state.previewFlashcard = action.payload;
    },
    setPreviewIndex: (state, action: PayloadAction<number>) => {
      state.previewIndex = action.payload;
    },
    setEnglishText: (state, action: PayloadAction<string>) => {
      state.englishText = action.payload;
    },
    setTurkishText: (state, action: PayloadAction<string>) => {
      state.turkishText = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setDialogOpen: (
      state,
      action: PayloadAction<{
        dialogName: keyof typeof state.dialogs;
        isOpen: boolean;
      }>
    ) => {
      const { dialogName, isOpen } = action.payload;
      state.dialogs[dialogName] = isOpen;
    },
  },
});

export const {
  setFlashcards,
  setSelectedFlashcard,
  setPreviewFlashcard,
  setPreviewIndex,
  setEnglishText,
  setTurkishText,
  setSearchText,
  setDialogOpen,
} = flashcardSlice.actions;

export default flashcardSlice;
