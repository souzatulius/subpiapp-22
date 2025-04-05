
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchDemandFormProps {
  onSearchSubmit?: (query: string) => void;
}

const SearchDemandForm: React.FC<SearchDemandFormProps> = ({ onSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-between">
      <div className="flex-grow flex items-center">
        <Input
          placeholder="Buscar demandas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mt-2">
        <Button type="submit" size="sm" className="w-full" variant="default">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
    </form>
  );
};

export default SearchDemandForm;
