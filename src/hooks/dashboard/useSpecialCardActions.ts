
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const useSpecialCardActions = () => {
  const navigate = useNavigate();
  const [newDemandTitle, setNewDemandTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickDemandSubmit = () => {
    if (newDemandTitle.trim()) {
      // Store the title in localStorage to retrieve it in the cadastrar page
      localStorage.setItem('quick_demand_title', newDemandTitle);
      // Navigate to the cadastrar page
      navigate('/dashboard/comunicacao/cadastrar');
      
      // Reset the field
      setNewDemandTitle('');
    }
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    
    // Simple implementation: search for cards matching the query
    if (query.toLowerCase().includes('demanda')) {
      navigate('/dashboard/comunicacao/cadastrar');
    } else if (query.toLowerCase().includes('responder')) {
      navigate('/dashboard/comunicacao/responder');
    } else if (query.toLowerCase().includes('nota') || query.toLowerCase().includes('aprovar')) {
      navigate('/dashboard/comunicacao/aprovar-nota');
    } else if (query.toLowerCase().includes('relatorio') || query.toLowerCase().includes('número')) {
      navigate('/dashboard/comunicacao/relatorios');
    } else {
      // Show toast with "no results found"
      toast({
        title: "Busca",
        description: `Nenhum resultado encontrado para '${query}'`,
        variant: "default",
      });
    }
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
