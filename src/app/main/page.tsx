"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Note from '@/components/Note';
import NewNoteModal from '@/components/NewNoteModal';
import NoteControls from '@/components/NoteControls';
import { Note as NoteType, SortOption } from '@/types/note';
import { getNotes, addNote, updateNote, deleteNote } from '@/utils/storage';

export default function MainPage() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load notes from localStorage on component mount
  useEffect(() => {
    if (isClient) {
      const storedNotes = getNotes();
      setNotes(storedNotes);
      console.log(storedNotes)
    }
  }, [isClient, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(notes.map(note => note.category).filter((cat): cat is string => cat !== undefined));
    return Array.from(uniqueCategories);
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = !selectedCategory || note.category === selectedCategory;
        const matchesFavorites = !showFavorites || note.isFavorite;
        const matchesArchived = note.isArchived === showArchived;

        return matchesSearch && matchesCategory && matchesFavorites && matchesArchived;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'newest':
            return b.createdAt.getTime() - a.createdAt.getTime();
          case 'oldest':
            return a.createdAt.getTime() - b.createdAt.getTime();
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          case 'reminder':
            if (!a.reminder) return 1;
            if (!b.reminder) return -1;
            return a.reminder.getTime() - b.reminder.getTime();
          default:
            return 0;
        }
      });
  }, [notes, searchQuery, sortOption, selectedCategory, showFavorites, showArchived]);

  const handleCreateNote = (note: { title: string; content: string; reminder?: Date; category?: string }) => {
    const newNote = addNote(note);
    if (newNote) {
      setNotes(prevNotes => [...prevNotes, newNote]);
      setIsNewNoteModalOpen(false);
    }
  };

  const handleEditNote = (id: string, title: string, content: string, reminder?: Date, category?: string) => {
    const updatedNote = updateNote(id, { title, content, reminder, category });
    if (updatedNote) {
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === id ? updatedNote : note
      ));
    }
  };

  const handleDeleteNote = (id: string) => {
    if (deleteNote(id)) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    }
  };

  const handleToggleFavorite = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, isFavorite: !note.isFavorite }
        : note
    ));
  };

  const handleArchiveNote = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, isArchived: !note.isArchived }
        : note
    ));
  };

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212] text-white">
     
      <header className="fixed top-0 left-0 right-0 bg-[#0A0A0A]/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <h1 className="text-4xl font-['Dancing_Script'] font-semibold tracking-wide">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-300 to-cyan-200">
                  Reemember
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 blur-xl -z-10" />
              </h1>
            </div>
      
            <button
              onClick={() => setIsNewNoteModalOpen(true)}
              className="hidden md:flex px-6 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-all duration-300 font-medium text-sm tracking-wide uppercase cursor-pointer shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
          </div>
        </div>
      </header>

  
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-6">
        {/* Controls */}
        <NoteControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showFavorites={showFavorites}
          onToggleFavorites={() => setShowFavorites(!showFavorites)}
          showArchived={showArchived}
          onToggleArchived={() => setShowArchived(!showArchived)}
          categories={categories}
        />

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.map((note) => (
            <Note 
              key={note.id} 
              {...note} 
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onToggleFavorite={handleToggleFavorite}
              onArchive={handleArchiveNote}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">
              {searchQuery
                ? "No notes found matching your search."
                : showArchived
                ? "No archived notes."
                : "No notes yet. Create your first note!"}
            </p>
          </div>
        )}
      </main>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsNewNoteModalOpen(true)}
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-indigo-500/40 hover:bg-indigo-500/50 text-white rounded-full transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center backdrop-blur-sm border border-indigo-500/20"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* New Note Modal */}
      <NewNoteModal
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        onSave={handleCreateNote}
      />
    </div>
  );
} 