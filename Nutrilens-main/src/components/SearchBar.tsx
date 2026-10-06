import React, { useState, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search products...", 
  onSearch,
  showFilters = false,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
    // Default search behavior
    console.log('Searching for:', query);
  };

  const clearSearch = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-20 h-12 text-base bg-background border-2 border-muted focus:border-primary rounded-full shadow-soft"
            aria-label="Search products"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {showFilters && (
              <Button
                type="button"
                onClick={toggleFilters}
                variant="ghost"
                size="sm"
                className={`p-1.5 rounded-full ${
                  isFiltersOpen ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label="Toggle filters"
              >
                <Filter className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-medium"
            >
              Search
            </Button>
          </div>
        </div>
      </form>

      {/* Filters Panel */}
      {showFilters && isFiltersOpen && (
        <div className="mt-4 p-4 bg-card rounded-2xl border border-border shadow-soft animate-fade-in">
          <h3 className="font-semibold text-foreground mb-3">Filter by:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="px-3 py-2 text-sm bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-full">
              Dairy
            </button>
            <button className="px-3 py-2 text-sm bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-full">
              Snacks
            </button>
            <button className="px-3 py-2 text-sm bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-full">
              Grains
            </button>
            <button className="px-3 py-2 text-sm bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-full">
              Pantry
            </button>
          </div>
        </div>
      )}

      {/* Search Suggestions (placeholder for future implementation) */}
      {query && (
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Searching for "{query}"...</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;