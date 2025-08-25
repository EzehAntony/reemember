"use client";

import React, { useState, useEffect } from 'react';
import { CATEGORIES, suggestCategory } from '@/config/categories';

interface NewNoteModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onCreate: (note: { title: string; content: string; reminder?: Date; category?: string }) => void;
  categories?: string[];
}

const NewNoteModal: React.FC<NewNoteModalProps> = ({ isOpen = true, onClose, onCreate, categories = [] }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reminder, setReminder] = useState('');
  const [category, setCategory] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setReminder('');
      setCategory('');
      setSuggestedCategory(null);
    }
  }, [isOpen]);

  // Update suggested category when title or content changes
  useEffect(() => {
    if (title || content) {
      const suggestion = suggestCategory(title, content);
      setSuggestedCategory(suggestion);
      if (!category) {
        setCategory(suggestion);
      }
    }
  }, [title, content, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      title,
      content,
      reminder: reminder ? new Date(reminder) : undefined,
      category: category || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-base-300/5 text-base-content backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 ">
          <h2 className="text-2xl font-bold text-neutral-content">New Note</h2>
          <button
            onClick={onClose}
            className="text-neutral-content/70 hover:text-neutral-content transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-content/70 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-base-300 border border-neutral-content/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-base-content"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-neutral-content/70 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-base-300 border border-neutral-content/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-base-content min-h-[200px] max-h-[400px] resize-y"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-neutral-content/70 mb-2">
              Category
            </label>
            <div className="flex flex-col gap-2">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-base-300 border border-neutral-content/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-base-content"
              >
                <option value="">Select a category</option>
                {categories.map((catId) => {
                  const cat = CATEGORIES.find(c => c.id === catId);
                  return (
                    <option key={catId} value={catId}>
                      {cat?.name || catId}
                    </option>
                  );
                })}
              </select>
              {suggestedCategory && !category && (
                <div className="text-sm text-base-content">
                  Suggested category: {CATEGORIES.find(c => c.id === suggestedCategory)?.name || suggestedCategory}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reminder" className="block text-sm font-medium text-neutral-content/70 mb-2">
              Reminder (optional)
            </label>
            <input
              type="datetime-local"
              id="reminder"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full px-4 py-3 bg-base-300 border border-neutral-content/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-base-content"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-neutral">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-content hover:text-neutral-content transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/30 transition-colors duration-200"
            >
              Create Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewNoteModal; 