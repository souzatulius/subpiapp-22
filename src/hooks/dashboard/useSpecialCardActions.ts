
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const useSpecialCardActions = () => {
  const navigate = useNavigate();
  const [newDemandTitle, setNewDemandTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleQuickDemandSubmit = () => {
    if (!newDemandTitle.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um título para a demanda.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to new demand form with the prefilled title
    navigate(`/dashboard/comunicacao/cadastrar?title=${encodeURIComponent(newDemandTitle)}`);
  };
  
  const handleSearchSubmit = (query?: string) => {
    const queryToUse = query || searchQuery;
    if (!queryToUse.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite um termo para pesquisar.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to search results with the query parameter
    navigate(`/demandas?q=${encodeURIComponent(queryToUse)}`);
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
