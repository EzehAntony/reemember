import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '@/types/note';

interface NotesState {
  notes: Note[];
  selectedCategory: string | null;
  searchQuery: string;
  showFavorites: boolean;
  showArchived: boolean;
  sortOption: 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'reminder';
}

const initialState: NotesState = {
  notes: [],
  selectedCategory: null,
  searchQuery: '',
  showFavorites: false,
  showArchived: false,
  sortOption: 'newest',
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt' | 'tags' | 'isFavorite' | 'isArchived'>>) => {
      const newNote: Note = {
        ...action.payload,
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        createdAt: new Date(),
        tags: [],
        isFavorite: false,
        isArchived: false,
      };
      state.notes.push(newNote);
    },
    updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<Note> }>) => {
      const { id, updates } = action.payload;
      const noteIndex = state.notes.findIndex(note => note.id === id);
      if (noteIndex !== -1) {
        state.notes[noteIndex] = { ...state.notes[noteIndex], ...updates };
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleFavorites: (state) => {
      state.showFavorites = !state.showFavorites;
    },
    toggleArchived: (state) => {
      state.showArchived = !state.showArchived;
    },
    setSortOption: (state, action: PayloadAction<NotesState['sortOption']>) => {
      state.sortOption = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const note = state.notes.find(note => note.id === action.payload);
      if (note) {
        note.isFavorite = !note.isFavorite;
      }
    },
    toggleArchive: (state, action: PayloadAction<string>) => {
      const note = state.notes.find(note => note.id === action.payload);
      if (note) {
        note.isArchived = !note.isArchived;
      }
    },
  },
});

export const {
  addNote,
  updateNote,
  deleteNote,
  setSelectedCategory,
  setSearchQuery,
  toggleFavorites,
  toggleArchived,
  setSortOption,
  toggleFavorite,
  toggleArchive,
} = notesSlice.actions;

export default notesSlice.reducer; 