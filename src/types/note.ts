export interface Note {
  id: string;
  title: string;
  content: string;
  reminder?: Date;
  category?: string;
  createdAt: Date;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'reminder';

export interface NoteTemplate {
  id: string;
  name: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
} 