import React, { useState } from 'react';
import { Search, Compass } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationRequest: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationRequest }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city, zip code, or coordinates (e.g., 'London' or '40.7,-74.0')"
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
          >
            <Search size={20} />
          </button>
        </div>
        <button
          type="button"
          onClick={onLocationRequest}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Compass size={20} />
          <span className="hidden sm:inline">Use My Location</span>
        </button>
      </div>
    </form>
  );
};