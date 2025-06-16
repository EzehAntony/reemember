export interface NoteData {
  id: string;
  title: string;
  content: string;
  reminder?: Date;
  createdAt: Date;
  color: string;
}

export const mockNotes: NoteData[] = [
  {
    id: '1',
    title: 'Meeting Notes',
    content: 'Discuss project timeline and deliverables for the upcoming quarter. Need to coordinate with design team and set up weekly syncs.',
    reminder: new Date('2024-03-20T10:00:00'),
    createdAt: new Date('2024-03-15'),
    color: 'from-indigo-500/10 to-blue-500/10',
  },
  {
    id: '2',
    title: 'Shopping List',
    content: 'Milk, eggs, bread, and vegetables for the week. Don\'t forget to get some snacks for the movie night!',
    createdAt: new Date('2024-03-16'),
    color: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    id: '3',
    title: 'Ideas for Next Project',
    content: 'Consider implementing dark mode and adding more interactive features. Research new animation libraries and user feedback.',
    reminder: new Date('2024-03-25T15:30:00'),
    createdAt: new Date('2024-03-17'),
    color: 'from-amber-500/10 to-orange-500/10',
  },
]; 