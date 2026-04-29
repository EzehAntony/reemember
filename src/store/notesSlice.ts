import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "@/types/note";

interface PendingOpAdd {
  type: "add";
  note: Note;
}
interface PendingOpUpdate {
  type: "update";
  id: string;
  updates: Partial<Note>;
}
interface PendingOpDelete {
  type: "delete";
  id: string;
}
type PendingOp = PendingOpAdd | PendingOpUpdate | PendingOpDelete;

interface NotesState {
  notes: Note[];
  selectedCategory: string | null;
  searchQuery: string;
  showFavorites: boolean;
  showArchived: boolean;
  sortOption: "newest" | "oldest" | "title-asc" | "title-desc" | "reminder";
  pendingOps: PendingOp[];
  lastSyncAt?: string;
}

const initialState: NotesState = {
  notes: [],
  selectedCategory: null,
  searchQuery: "",
  showFavorites: false,
  showArchived: false,
  sortOption: "newest",
  pendingOps: [],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (
      state,
      action: PayloadAction<
        Omit<Note, "tags" | "isFavorite" | "isArchived"> &
          Partial<Pick<Note, "id" | "createdAt">>
      >
    ) => {
      const newNote: Note = {
        ...action.payload,
        id:
          action.payload.id ||
          Date.now().toString(36) + Math.random().toString(36).substring(2),
        createdAt: action.payload.createdAt || new Date().toISOString(),
        tags: [],
        isFavorite: false,
        isArchived: false,
        reminder: action.payload.reminder
          ? String(action.payload.reminder)
          : undefined,
      };
      state.notes.push(newNote);
      state.pendingOps.push({ type: "add", note: newNote });
    },
    updateNote: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Note> }>
    ) => {
      const { id, updates } = action.payload;
      const noteIndex = state.notes.findIndex((note) => note.id === id);
      if (noteIndex !== -1) {
        state.notes[noteIndex] = {
          ...state.notes[noteIndex],
          ...updates,
          reminder: updates.reminder ? String(updates.reminder) : undefined,
        };
        state.pendingOps.push({ type: "update", id, updates });
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      state.pendingOps.push({ type: "delete", id: action.payload });
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
    setSortOption: (state, action: PayloadAction<NotesState["sortOption"]>) => {
      state.sortOption = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((note) => note.id === action.payload);
      if (note) {
        note.isFavorite = !note.isFavorite;
        state.pendingOps.push({
          type: "update",
          id: note.id,
          updates: { isFavorite: note.isFavorite },
        });
      }
    },
    toggleArchive: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((note) => note.id === action.payload);
      if (note) {
        note.isArchived = !note.isArchived;
        state.pendingOps.push({
          type: "update",
          id: note.id,
          updates: { isArchived: note.isArchived },
        });
      }
    },
    replaceNotesFromServer: (
      state,
      action: PayloadAction<{ notes: Note[]; syncTime?: string }>
    ) => {
      // Replace local notes with server dataset while preserving client ids
      state.notes = action.payload.notes.map((n) => ({
        ...n,
        id: n.id, // clientId provided by API equals local id
      }));
      state.pendingOps = [];
      state.lastSyncAt = action.payload.syncTime || new Date().toISOString();
    },
    clearSyncedOps: (state) => {
      state.pendingOps = [];
      state.lastSyncAt = new Date().toISOString();
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
  replaceNotesFromServer,
  clearSyncedOps,
} = notesSlice.actions;

export default notesSlice.reducer;
