
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface DashboardSearchCardProps {
  placeholder?: string;
  isEditMode?: boolean;
  onSearchSubmit?: (query: string) => void;
}

const DashboardSearchCard: React.FC<DashboardSearchCardProps> = ({
  placeholder = "Buscar...",
  isEditMode = false,
  onSearchSubmit
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit && searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full flex items-center space-x-2 p-2"
      onClick={(e) => isEditMode && e.stopPropagation()}
    >
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1"
        disabled={isEditMode}
      />
      <Button 
        type="submit" 
        variant="outline" 
        size="icon"
        disabled={isEditMode}
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default DashboardSearchCard;
