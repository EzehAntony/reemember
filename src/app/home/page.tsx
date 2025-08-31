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
import { signIn, signOut, useSession } from 'next-auth/react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function MainPage () {
  const { data: session } = useSession();
  const [ activeItem, setActiveItem ] = useState( () => localStorage.getItem( "theme" ) || "dark" );
  const dispatch = useDispatch();
  const [ isNewNoteModalOpen, setIsNewNoteModalOpen ] = useState( false );
  const [ isClient, setIsClient ] = useState( false );
  const [ isLogoutModalOpen, setIsLogoutModalOpen ] = useState( false );

  useEffect( () => {
    document.querySelector( "html" )?.setAttribute( "data-theme", activeItem );
    localStorage.setItem( "theme", activeItem );
  }, [ activeItem ] );

  useEffect( () => setIsClient( true ), [] );

  const notes = useSelector( ( state: RootState ) => state.notes.notes );
  const selectedCategory = useSelector( ( state: RootState ) => state.notes.selectedCategory );
  const searchQuery = useSelector( ( state: RootState ) => state.notes.searchQuery );
  const sortOption = useSelector( ( state: RootState ) => state.notes.sortOption );
  const showFavorites = useSelector( ( state: RootState ) => state.notes.showFavorites );
  const showArchived = useSelector( ( state: RootState ) => state.notes.showArchived );

  const categories = useMemo( () => CATEGORIES.map( cat => cat.id ), [] );

  const filteredNotes = useMemo( () => {
    return notes
      .filter( note => {
        const matchesSearch =
          note.title.toLowerCase().includes( searchQuery.toLowerCase() ) ||
          note.content.toLowerCase().includes( searchQuery.toLowerCase() ) ||
          note.tags.some( tag => tag.toLowerCase().includes( searchQuery.toLowerCase() ) );

        const matchesCategory = !selectedCategory || note.category === selectedCategory;
        const matchesFavorites = !showFavorites || note.isFavorite;
        const matchesArchived = note.isArchived === showArchived;

        return matchesSearch && matchesCategory && matchesFavorites && matchesArchived;
      } )
      .sort( ( a, b ) => {
        switch ( sortOption ) {
          case 'newest':
            return new Date( b.createdAt ).getTime() - new Date( a.createdAt ).getTime();
          case 'oldest':
            return new Date( a.createdAt ).getTime() - new Date( b.createdAt ).getTime();
          case 'title-asc':
            return a.title.localeCompare( b.title );
          case 'title-desc':
            return b.title.localeCompare( a.title );
          case 'reminder':
            if ( !a.reminder ) return 1;
            if ( !b.reminder ) return -1;
            return new Date( a.reminder ).getTime() - new Date( b.reminder ).getTime();
          default:
            return 0;
        }
      } );
  }, [ notes, searchQuery, sortOption, selectedCategory, showFavorites, showArchived ] );

  const handleCreateNote = ( note: { title: string; content: string; reminder?: Date; category?: string; } ) => {
    dispatch( addNote( {
      ...note,
      reminder: note.reminder ? note.reminder.toISOString() : undefined,
    } ) );
    setIsNewNoteModalOpen( false );
  };

  const handleEditNote = ( id: string, title: string, content: string, reminder?: Date, category?: string ) => {
    dispatch( updateNote( {
      id,
      updates: { title, content, reminder: reminder ? reminder.toISOString() : undefined, category },
    } ) );
  };

  const handleDeleteNote = ( id: string ) => dispatch( deleteNote( id ) );
  const handleToggleFavorite = ( id: string ) => dispatch( toggleFavorite( id ) );
  const handleArchiveNote = ( id: string ) => dispatch( toggleArchive( id ) );

  if ( !isClient ) return null;
  return (
    <div className="min-h-screen bg-base-300 text-base-content">

      <header className="fixed top-0 left-0 right-0 bg-base-300 backdrop-blur-md z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-semibold">Reemember</h1>

          <div className="flex items-center gap-2">
            {/* Theme selector */ }
            <div className="dropdown dropdown-end">
              <GiLanternFlame tabIndex={ 0 } role="button" className="text-4xl cursor-pointer" />
              <ul tabIndex={ 0 } className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-sm">
                { themeColorsList.map( ( color, index ) => (
                  <li key={ index } onClick={ () => setActiveItem( color ) }>
                    <a>{ color }</a>
                  </li>
                ) ) }
              </ul>
            </div>

            {/* Create button */ }
            <button
              onClick={ () => setIsNewNoteModalOpen( true ) }
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-lg font-medium text-sm uppercase hover:bg-secondary transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>

            {/* User profile / Sign in */ }
            { session && session.user ? (
              <div className="relative">
                <Image
                  alt="user"
                  src={ session.user.image || "" }
                  width={ 50 }
                  height={ 50 }
                  className="rounded-full cursor-pointer"
                  onClick={ () => setIsLogoutModalOpen( !isLogoutModalOpen ) }
                />

                {/* Logout modal */ }
                { isLogoutModalOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-base-200 border border-base-300 rounded-lg shadow-lg p-2 z-50">
                    <button
                      onClick={ () => { signOut( { callbackUrl: '/' } ); setIsLogoutModalOpen( false ); } }
                      className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-neutral transition"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                ) }
              </div>
            ) : (
              <button
                onClick={ () => signIn( undefined, { callbackUrl: '/home' } ) }
                className="w-12 h-12 flex items-center justify-center bg-secondary text-secondary-content rounded-full shadow-sm hover:bg-neutral transition-colors"
                aria-label="Sign in"
              >
                <FaSignInAlt className="text-lg" />
              </button>
            ) }
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-6 pt-24 pb-6">

        {/* Greeting */ }
        { session?.user?.name && (
          <p className="text-lg font-medium mb-4">Hello, { session.user.name }</p>
        ) }
        {/* Controls */ }
        <NoteControls
          searchQuery={ searchQuery }
          onSearchChange={ ( query ) => dispatch( setSearchQuery( query ) ) }
          sortOption={ sortOption }
          onSortChange={ ( option ) => dispatch( setSortOption( option ) ) }
          selectedCategory={ selectedCategory }
          onCategoryChange={ ( category ) => dispatch( setSelectedCategory( category ) ) }
          showFavorites={ showFavorites }
          onToggleFavorites={ () => dispatch( toggleFavorites() ) }
          showArchived={ showArchived }
          onToggleArchived={ () => dispatch( toggleArchived() ) }
          categories={ categories }
        />

        {/* Notes Grid */ }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          { filteredNotes.map( ( note ) => (
            <Note
              key={ note.id }
              { ...note }
              onEdit={ handleEditNote }
              onDelete={ handleDeleteNote }
              onToggleFavorite={ handleToggleFavorite }
              onArchive={ handleArchiveNote }
            />
          ) ) }
        </div>

        {/* Empty State */ }
        { filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base-content text-lg">
              { searchQuery
                ? "No notes found matching your search."
                : showArchived
                  ? "No archived notes."
                  : "No notes yet. Create your first note!" }
            </p>
          </div>
        ) }
      </main>

      {/* Mobile Floating Action Button */ }
      <button
        onClick={ () => setIsNewNoteModalOpen( true ) }
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-content rounded-full transition-all duration-300 cursor-pointer shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 flex items-center justify-center backdrop-blur-sm border border-primary-500/20"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2.5 } d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* New Note Modal */ }
      { isNewNoteModalOpen && (
        <NewNoteModal
          onClose={ () => setIsNewNoteModalOpen( false ) }
          onCreate={ handleCreateNote }
          categories={ categories }
        />
      ) }
    </div>
  );
} 