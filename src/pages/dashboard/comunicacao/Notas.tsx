
import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FileText, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { supabase } from '@/integrations/supabase/client';
import NotaForm from '@/components/dashboard/forms/NotaForm';
import { NotaFormSchema } from '@/components/dashboard/forms/schemas/notaFormSchema';
import { useToast } from '@/components/ui/use-toast';

const Notas = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get pending notes count
  const { data: pendingNotesCount = 0 } = useQuery({
    queryKey: ['pendingNotesCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notas_oficiais')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return count || 0;
    },
  });

  // Navigate to view or edit a note
  const handleViewNote = (id: string) => {
    // Fix the navigation path to match existing routes
    navigate(`/dashboard/comunicacao/notas/detalhe?id=${id}`);
  };
  
  const handleEditNote = (id: string) => {
    // Fix the navigation path to match existing routes 
    navigate(`/dashboard/comunicacao/notas/editar?id=${id}`);
  };
  
  const handleCreateNote = () => {
    navigate('/dashboard/comunicacao/criar-nota');
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <WelcomeCard
        title="Notas"
        description="Crie e publique notas oficiais para imprensa e para o público"
        icon={<FileText className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-purple-600 to-purple-800"
      />
      
      <div className="mt-6 flex justify-end mb-4">
        <Button 
          onClick={handleCreateNote}
          className="rounded-xl"
        >
          <FileText className="h-4 w-4 mr-2" />
          Nova Nota
        </Button>
      </div>
      
      <div className="mt-6">
        <NotaForm />
      </div>
    </div>
  );
};

export default Notas;
