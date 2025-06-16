"use client";

import React, { useState } from 'react';
import { CATEGORIES } from '@/config/categories';
import EditNoteModal from './EditNoteModal';

interface NoteProps {
  id: string;
  title: string;
  content: string;
  reminder?: Date;
  category?: string;
  onEdit: (id: string, title: string, content: string, reminder?: Date, category?: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({ id, title, content, reminder, category, onEdit, onDelete, onToggleFavorite, onArchive }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    onDelete(id);
    setIsDeleteConfirmOpen(false);
  };

  const handleSave = (title: string, content: string, reminder?: Date, category?: string) => {
    onEdit(id, title, content, reminder, category);
    setIsEditModalOpen(false);
  };

  const categoryInfo = category ? CATEGORIES.find(c => c.id === category) : null;

  return (
    <>
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#242424] rounded-xl p-6 h-full flex flex-col group hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 border border-white/5">
        {categoryInfo && (
          <div className="mb-3">
            <span
              className="inline-block px-3 py-1 text-sm rounded-full"
              style={{
                backgroundColor: `${categoryInfo.color}20`,
                color: categoryInfo.color
              }}
            >
              {categoryInfo.name}
            </span>
          </div>
        )}

        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-white line-clamp-2">{title}</h3>
          <div className="flex gap-2 flex-shrink-0 ml-4">
            <button
              onClick={() => onToggleFavorite(id)}
              className="p-2 text-white/50 hover:text-yellow-400 transition-colors duration-200"
              title="Toggle favorite"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <button
              onClick={() => onArchive(id)}
              className="p-2 text-white/50 hover:text-indigo-400 transition-colors duration-200"
              title="Archive note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </button>
            <button
              onClick={handleEdit}
              className="p-2 text-white/50 hover:text-white transition-colors duration-200"
              title="Edit note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-white/50 hover:text-red-400 transition-colors duration-200"
              title="Delete note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-white/70 line-clamp-4 flex-grow mt-4">{content}</p>

        {reminder && (
          <div className="mt-4 text-sm text-white/50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(reminder).toLocaleString()}
          </div>
        )}
      </div>

      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSave}
        note={{ id, title, content, reminder, category }}
      />

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Delete Note</h3>
            <p className="text-white/70 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Note; 