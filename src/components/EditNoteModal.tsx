"use client";

import React, { useState, useEffect } from 'react';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, reminder?: Date, category?: string) => void;
  note: {
    id: string;
    title: string;
    content: string;
    reminder?: Date;
    category?: string;
  };
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [reminder, setReminder] = useState(note.reminder ? new Date(note.reminder).toISOString().slice(0, 16) : '');
  const [category, setCategory] = useState(note.category || '');

  useEffect(() => {
    if (isOpen) {
      setTitle(note.title);
      setContent(note.content);
      setReminder(note.reminder ? new Date(note.reminder).toISOString().slice(0, 16) : '');
      setCategory(note.category || '');
    }
  }, [isOpen, note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, content, reminder ? new Date(reminder) : undefined, category || undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] p-6 rounded-xl max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Note</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white/70 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white/70 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white min-h-[200px] resize-y"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white/70 mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
              placeholder="e.g., Work, Personal, Ideas"
            />
          </div>

          <div>
            <label htmlFor="reminder" className="block text-sm font-medium text-white/70 mb-2">
              Reminder (optional)
            </label>
            <input
              type="datetime-local"
              id="reminder"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNoteModal; 