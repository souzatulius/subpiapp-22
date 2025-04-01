
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const useSpecialCardActions = () => {
  const [newDemandTitle, setNewDemandTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Quick demand submission
  const handleQuickDemandSubmit = () => {
    if (!newDemandTitle.trim()) {
      toast({
        title: "Título não pode estar vazio",
        description: "Por favor, informe um título para a demanda.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to demand creation with the title as a query parameter
    navigate(`/dashboard/comunicacao/cadastrar?title=${encodeURIComponent(newDemandTitle)}`);
    setNewDemandTitle('');
  };

  // Search submission
  const handleSearchSubmit = (query: string = '') => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;
    
    // For now, we'll just log the search query
    console.log('Search submitted:', searchTerm);
    navigate(`/demandas?q=${encodeURIComponent(searchTerm)}`);
    setSearchQuery('');
  };

  return {
    newDemandTitle,
    setNewDemandTitle,
    handleQuickDemandSubmit,
    searchQuery,
    setSearchQuery,
    handleSearchSubmit
  };
};
