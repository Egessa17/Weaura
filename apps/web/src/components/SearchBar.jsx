
import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar = ({ onSearch, onToggleFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
        Search
      </Button>
      {onToggleFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={onToggleFilters}
          className="lg:hidden"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      )}
    </form>
  );
};

export default SearchBar;
