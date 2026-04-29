"use client";

import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '@/config/categories';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineStar, HiOutlineArchive } from 'react-icons/hi';
import { HiStar as HiStarSolid } from 'react-icons/hi';
import EditNoteModal from './EditNoteModal';

interface NoteProps {
  id: string;
  title: string;
  content: string;
  reminder?: string;
  category?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  onEdit: ( id: string, title: string, content: string, reminder?: Date, category?: string ) => void;
  onDelete: ( id: string ) => void;
  onToggleFavorite: ( id: string ) => void;
  onArchive: ( id: string ) => void;
}

const Note: React.FC<NoteProps> = ( { id, title, content, reminder, category, isFavorite, isArchived, onEdit, onDelete, onToggleFavorite, onArchive } ) => {
  const [ isEditModalOpen, setIsEditModalOpen ] = useState( false );

  const [ isSynced, setIsSynced ] = useState<boolean | null>( null ); // null = loading, true = in DB, false = not synced

  const categoryInfo = category ? CATEGORIES.find( c => c.id === category ) : null;
  const reminderDate = reminder ? new Date( reminder ) : undefined;

  useEffect( () => {
    const checkDatabase = async () => {
      try {
        const res = await fetch( `/api/notes/${ id }` );
        if ( !res.ok ) {
          setIsSynced( false );
          return;
        }
        const data = await res.json();
        setIsSynced( !!data && !data.error );
      } catch {
        setIsSynced( false );
      }
    };

    checkDatabase();
  }, [ id ] );

  const getGradientColors = () => {
    if ( !categoryInfo ) return 'from-base-200 to-base-300';
    switch ( categoryInfo.id ) {
      case 'work': return 'from-indigo-500/20 to-blue-500/10';
      case 'personal': return 'from-emerald-500/20 to-teal-500/10';
      case 'ideas': return 'from-amber-500/20 to-orange-500/10';
      case 'learning': return 'from-purple-500/20 to-pink-500/10';
      case 'tasks': return 'from-cyan-500/20 to-blue-500/10';
      default: return 'from-base-200 to-base-300';
    }
  };

  return (
    <>
      <div className={ `bg-gradient-to-br ${ getGradientColors() } rounded-xl p-6 h-full flex flex-col group transition-all duration-300 border border-base-content/5 backdrop-blur-sm hover:shadow-lg` }>

        {/* Category */ }
        <div className="mb-3 flex items-center justify-between">
          { categoryInfo ? (
            <span
              className="inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider"
              style={ {
                backgroundColor: `${ categoryInfo.color }20`,
                color: categoryInfo.color
              } }
            >
              { categoryInfo.name }
            </span>
          ) : <div /> }

          {/* Sync Status */ }
          <div className="flex items-center gap-2">
            { isSynced === true && (
              <span title="Synced" className="text-success text-xs">● Synced</span>
            ) }
            { isSynced === false && (
              <span title="Not Synced" className="text-error text-xs">○ Offline</span>
            ) }
          </div>
        </div>

        {/* Title + Actions */ }
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-base-content line-clamp-2">{ title }</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={ () => onToggleFavorite( id ) }
              className="p-2 hover:bg-base-content/10 rounded-lg transition-colors text-warning"
              title="Favorite"
            >
              { isFavorite ? <HiStarSolid className="w-5 h-5" /> : <HiOutlineStar className="w-5 h-5" /> }
            </button>
            <button
              onClick={ () => setIsEditModalOpen( true ) }
              className="p-2 hover:bg-base-content/10 rounded-lg transition-colors text-primary"
              title="Edit"
            >
              <HiOutlinePencil className="w-5 h-5" />
            </button>
            <button
              onClick={ () => onArchive( id ) }
              className="p-2 hover:bg-base-content/10 rounded-lg transition-colors text-info"
              title="Archive"
            >
              <HiOutlineArchive className="w-5 h-5" />
            </button>
            <button
              onClick={ () => onDelete( id ) }
              className="p-2 hover:bg-base-content/10 rounded-lg transition-colors text-error"
              title="Delete"
            >
              <HiOutlineTrash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */ }
        <p className="text-base-content/70 line-clamp-4 flex-grow mt-4 whitespace-pre-wrap">{ content }</p>

        {/* Footer */ }
        <div className="mt-4 pt-4 border-t border-base-content/5 flex items-center justify-between text-xs text-base-content/50">
          { reminder && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              { reminderDate?.toLocaleDateString() }
            </div>
          ) }
          { isArchived && <span className="bg-base-content/10 px-2 py-0.5 rounded">Archived</span> }
        </div>
      </div>

      <EditNoteModal
        isOpen={ isEditModalOpen }
        onClose={ () => setIsEditModalOpen( false ) }
        onSave={ ( title, content, reminderDate, category ) =>
          onEdit( id, title, content, reminderDate, category )
        }
        note={ { id, title, content, reminder: reminder ? new Date( reminder ) : undefined, category } }
      />
    </>
  );
};

export default Note;
