import React from 'react';
import { SortOption } from '@/types/note';
import { CiFilter } from 'react-icons/ci';
import { FaSortAlphaDown } from 'react-icons/fa';



interface NoteControlsProps {
  searchQuery: string;
  onSearchChange: ( query: string ) => void;
  sortOption: SortOption;
  onSortChange: ( option: SortOption ) => void;
  selectedCategory: string | null;
  onCategoryChange: ( category: string | null ) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  showArchived: boolean;
  onToggleArchived: () => void;
  categories: string[];
}

const NoteControls: React.FC<NoteControlsProps> = ( {
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  showFavorites,
  onToggleFavorites,
  showArchived,
  onToggleArchived,
  categories,
} ) => {
  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */ }
      <div className="relative">
        <input
          type="text"
          value={ searchQuery }
          onChange={ ( e ) => onSearchChange( e.target.value ) }
          placeholder="Search notes..."
          className="w-full px-4 py-3 bg-base-200 border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-base-content placeholder-base-content/50"
        />
        <svg
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={ 2 }
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Controls Row */ }
      <div className="flex flex-wrap gap-4 items-center">
        {/* Sort Dropdown */ }
        <div className='relative flex justify-between items-center  w-fit px-2 py-2 bg-base-200 border border-base-content/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-base-content'>
          <select
            value={ sortOption }
            onChange={ ( e ) => onSortChange( e.target.value as SortOption ) }
            className="appearance-none outline-none border-0 bg-base-200  px-2 "
          >


            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="reminder">Reminder Date</option>
          </select>
          <FaSortAlphaDown />
        </div>

        {/* Category Filter */ }
        <div className='relative flex justify-between items-center space-x-2 w-fit px-2 py-2 bg-base-200 border border-base-content/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-base-content'>
          <select
            value={ selectedCategory || '' }
            onChange={ ( e ) => onCategoryChange( e.target.value || null ) }
            className="appearance-none outline-none border-0 bg-base-200  px-2 "
          >
           
            <option value="" className='text-sm'>All Categories</option>
            { categories.map( ( category ) => (
              <option className='px-2 text-sm' key={ category } value={ category }>
                { category }
              </option>
            ) ) }
          </select>
          <div className="pointer-events-none inset-y-0 right-3 flex items-center">
            <CiFilter className="text-white w-4 h-4" />
          </div>
        </div>





        {/* Filter Buttons */ }
        <div className="flex gap-2">
          <button
            onClick={ onToggleFavorites }
            className={ `px-4 py-2 rounded-lg transition-all duration-200 ${ showFavorites
              ? 'bg-primary/20 text-primary'
              : 'bg-base-200 text-base-content/70 hover:bg-base-content/10'
              }` }
          >
            <svg
              className="w-5 h-5"
              fill={ showFavorites ? 'currentColor' : 'none' }
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={ 2 }
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>

          <button
            onClick={ onToggleArchived }
            className={ `px-4 py-2 rounded-lg transition-all duration-200 ${ showArchived
              ? 'bg-primary/20 text-primary'
              : 'bg-base/5 text-base-content/70 hover:bg-base-content/10'
              }` }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={ 2 }
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteControls; 