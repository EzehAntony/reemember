"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Note from '@/components/Note';
import NewNoteModal from '@/components/NewNoteModal';
import NoteControls from '@/components/NoteControls';
import { RootState } from '@/store/store';
import {
  addNote,
  updateNote,
  deleteNote,
  setSelectedCategory,
  setSearchQuery,
  toggleFavorites,
  toggleArchived,
  setSortOption,
  toggleFavorite,
  toggleArchive
} from '@/store/notesSlice';
import { CATEGORIES } from '@/config/categories';
import { GiLanternFlame } from 'react-icons/gi';
import { themeColorsList } from '@/data/data';

export default function MainPage() {
  const [activeItem, setActiveItem] = useState(() => localStorage.getItem("theme") || "dark");
  const dispatch = useDispatch();
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);


  //Theme set
  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", activeItem);
    localStorage.setItem("theme", activeItem)
  }, [activeItem])


  // Get state from Redux
  const notes = useSelector((state: RootState) => state.notes.notes);
  const selectedCategory = useSelector((state: RootState) => state.notes.selectedCategory);
  const searchQuery = useSelector((state: RootState) => state.notes.searchQuery);
  const sortOption = useSelector((state: RootState) => state.notes.sortOption);
  const showFavorites = useSelector((state: RootState) => state.notes.showFavorites);
  const showArchived = useSelector((state: RootState) => state.notes.showArchived);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    return CATEGORIES.map(cat => cat.id);
  }, []);

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
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          case 'reminder':
            if (!a.reminder) return 1;
            if (!b.reminder) return -1;
            return new Date(a.reminder).getTime() - new Date(b.reminder).getTime();
          default:
            return 0;
        }
      });
  }, [notes, searchQuery, sortOption, selectedCategory, showFavorites, showArchived]);

  const handleCreateNote = (note: { title: string; content: string; reminder?: Date; category?: string }) => {
    dispatch(addNote({
      ...note,
      reminder: note.reminder ? note.reminder.toISOString() : undefined,
    }));
    setIsNewNoteModalOpen(false);
  };

  const handleEditNote = (id: string, title: string, content: string, reminder?: Date, category?: string) => {
    dispatch(updateNote({
      id,
      updates: {
        title,
        content,
        reminder: reminder ? reminder.toISOString() : undefined,
        category,
      },
    }));
  };

  const handleDeleteNote = (id: string) => {
    dispatch(deleteNote(id));
  };

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const handleArchiveNote = (id: string) => {
    dispatch(toggleArchive(id));
  };

  // Don't render anything until we're on the client
  if (!isClient) {
    return null;
  }



  return (
    <div className="min-h-screen bg-base-300 text-base-content">

      <header className="fixed top-0 left-0 right-0 bg-base-300 backdrop-blur-md z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="relative flex items-center justify-between w-full">
              <h1 className="text-4xl font-['Dancing_Script'] font-semibold tracking-wide">
                <span className="text-base-content font-semibold  ">
                  Reemember
                </span>

              </h1>
              <div className='dropdown dropdown-end'>
                <GiLanternFlame tabIndex={0} role='button' className="text-4xl btn-block text-base-content" />
                <ul tabIndex={0} className='dropdown-content flex flex-col menu bg-base-100 rounded-box z-1 w-52 p-z shadow-sm '>
                  {themeColorsList.map((color, index) => <li onClick={() => { setActiveItem(color) }} key={index}><a>{color}</a></li>)}
                </ul>
              </div>


            </div>


            <button
              onClick={() => setIsNewNoteModalOpen(true)}
              className="hidden md:flex px-6 py-3 bg-primary rounded-lg transition-all duration-300 font-medium text-sm tracking-wide uppercase cursor-pointer items-center gap-2"
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
          onSearchChange={(query) => dispatch(setSearchQuery(query))}
          sortOption={sortOption}
          onSortChange={(option) => dispatch(setSortOption(option))}
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => dispatch(setSelectedCategory(category))}
          showFavorites={showFavorites}
          onToggleFavorites={() => dispatch(toggleFavorites())}
          showArchived={showArchived}
          onToggleArchived={() => dispatch(toggleArchived())}
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
            <p className="text-base-content/50 text-lg">
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
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-content rounded-full transition-all duration-300 cursor-pointer shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 flex items-center justify-center backdrop-blur-sm border border-primary-500/20"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* New Note Modal */}
      {isNewNoteModalOpen && (
        <NewNoteModal
          onClose={() => setIsNewNoteModalOpen(false)}
          onCreate={handleCreateNote}
          categories={categories}
        />
      )}
    </div>
  );
} 