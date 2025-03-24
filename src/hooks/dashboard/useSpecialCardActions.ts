
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
      toast.error("Título não pode estar vazio", {
        description: "Por favor, informe um título para a demanda."
      });
      return;
    }

    // Navigate to demand creation with the title as a query parameter
    navigate(`/dashboard/comunicacao/cadastrar?title=${encodeURIComponent(newDemandTitle)}`);
    setNewDemandTitle('');
  };

  // Search submission
  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    
    // For now, we'll just log the search query
    // The actual search functionality is now implemented in the SmartSearchCard component
    console.log('Search submitted:', query);
    setSearchQuery(query);
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
