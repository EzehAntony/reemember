export interface Category {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'work',
    name: 'Work',
    description: 'Professional tasks, meetings, and work-related notes',
    keywords: ['meeting', 'project', 'deadline', 'task', 'work', 'job', 'office', 'business', 'client', 'team'],
    color: 'from-indigo-500/10 to-blue-500/10',
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Personal life, daily activities, and private matters',
    keywords: ['personal', 'life', 'family', 'home', 'daily', 'private', 'health', 'fitness', 'hobby'],
    color: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    id: 'ideas',
    name: 'Ideas',
    description: 'Creative ideas, inspiration, and brainstorming',
    keywords: ['idea', 'creative', 'inspiration', 'brainstorm', 'concept', 'design', 'art', 'innovation'],
    color: 'from-amber-500/10 to-orange-500/10',
  },
  {
    id: 'learning',
    name: 'Learning',
    description: 'Study notes, educational content, and learning resources',
    keywords: ['study', 'learn', 'education', 'course', 'book', 'research', 'knowledge', 'tutorial'],
    color: 'from-purple-500/10 to-pink-500/10',
  },
  {
    id: 'tasks',
    name: 'Tasks',
    description: 'To-do lists, reminders, and action items',
    keywords: ['todo', 'task', 'reminder', 'deadline', 'schedule', 'appointment', 'checklist', 'action'],
    color: 'from-cyan-500/10 to-blue-500/10',
  },
];

export function suggestCategory(title: string, content: string): string {
  const text = (title + ' ' + content).toLowerCase();
  let bestMatch = { category: 'personal', score: 0 };

  CATEGORIES.forEach(category => {
    const score = category.keywords.reduce((total, keyword) => {
      const keywordCount = (text.match(new RegExp(keyword, 'g')) || []).length;
      return total + keywordCount;
    }, 0);

    if (score > bestMatch.score) {
      bestMatch = { category: category.id, score };
    }
  });

  return bestMatch.category;
} 