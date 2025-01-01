import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    (value: string) => {
      const timeoutId = setTimeout(() => {
        onSearch(value);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [onSearch]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchTerm);
    return cleanup;
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search your bookmarks..."
        className="w-full pl-12 pr-4 py-3 rounded-xl border border-dark-border bg-dark-card text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent focus:border-transparent transition-all"
      />
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm('');
            toast.success('Search cleared!');
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.343 6.343a1 1 0 011.414 0L12 10.586l4.243-4.243a1 1 0 111.414 1.414L13.414 12l4.243 4.243a1 1 0 01-1.414 1.414L12 13.414l-4.243 4.243a1 1 0 01-1.414-1.414L10.586 12 6.343 7.757a1 1 0 010-1.414z" fill="currentColor"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar; 