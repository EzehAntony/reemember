import { Note } from '@/types/note';

const STORAGE_KEY = 'notes';

// Fallback function for generating unique IDs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Safe localStorage access
const getLocalStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

export const getNotes = (): Note[] => {
  const storage = getLocalStorage();
  if (!storage) return [];
  
  const storedNotes = storage.getItem(STORAGE_KEY);
  if (!storedNotes) return [];
  
  try {
    const notes = JSON.parse(storedNotes);
    // Convert string dates back to Date objects
    return notes.map((note: { reminder?: string; createdAt: string }) => ({
      ...note,
      reminder: note.reminder ? new Date(note.reminder) : undefined,
      createdAt: new Date(note.createdAt)
    }));
  } catch (error) {
    console.error('Error parsing notes from localStorage:', error);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  const storage = getLocalStorage();
  if (!storage) return;
  
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
};

export const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'tags' | 'isFavorite' | 'isArchived'>): Note => {
  const notes = getNotes();
  const newNote: Note = {
    ...note,
    id: generateId(),
    createdAt: new Date(),
    tags: [],
    isFavorite: false,
    isArchived: false
  };
  
  const updatedNotes = [...notes, newNote];
  saveNotes(updatedNotes);
  return newNote;
};

export const updateNote = (id: string, updates: Partial<Note>): Note | null => {
  const notes = getNotes();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) return null;
  
  const updatedNote = {
    ...notes[noteIndex],
    ...updates
  };
  
  notes[noteIndex] = updatedNote;
  saveNotes(notes);
  return updatedNote;
};

export const deleteNote = (id: string): boolean => {
  const notes = getNotes();
  const updatedNotes = notes.filter(note => note.id !== id);
  
  if (updatedNotes.length === notes.length) return false;
  
  saveNotes(updatedNotes);
  return true;
}; 