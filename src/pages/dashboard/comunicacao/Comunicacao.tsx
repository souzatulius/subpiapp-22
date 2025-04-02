
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { MessageSquareReply, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { toast } from '@/components/ui/use-toast';
import PendingDemandsCard from '@/components/comunicacao/PendingDemandsCard';
import NotasManagementCard from '@/components/comunicacao/NotasManagementCard';
import DemandasEmAndamentoCard from '@/components/comunicacao/DemandasEmAndamentoCard';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Use React Query with prefetch and low staleTime for better caching
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user_department', user?.id, isPreview],
    queryFn: async () => {
      if (isPreview) {
        return {
          coordenacaoId: department,
          isComunicacao: department === 'comunicacao',
          departmentName: department === 'comunicacao' ? 'Comunicação' : department
        };
      }
      
      if (!user) return null;
      
      try {
        // Fetch user's department with a single query to improve performance
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            coordenacao_id,
            coordenacoes:coordenacao_id (descricao)
          `)
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (!data?.coordenacao_id) {
          return {
            coordenacaoId: 'default',
            isComunicacao: false,
            departmentName: 'Padrão'
          };
        }
        
        const isComunicacao = 
          (data?.coordenacoes?.descricao || '').toLowerCase().includes('comunica') || 
          data.coordenacao_id === 'comunicacao';
        
        return {
          coordenacaoId: data.coordenacao_id,
          isComunicacao,
          departmentName: data?.coordenacoes?.descricao || 'Departamento'
        };
      } catch (err) {
        console.error('Error fetching user department data:', err);
        throw err;
      }
    },
    enabled: !isPreview && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes before refetch
    retry: 1
  });
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <span className="text-blue-600 font-medium text-lg">Carregando informações do departamento...</span>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    // Display error toast only once
    React.useEffect(() => {
      toast({
        title: "Erro ao carregar informações",
        description: "Não foi possível carregar as informações do departamento.",
        variant: "destructive"
      });
    }, []);
    
    return (
      <div className="space-y-6">
        <WelcomeCard
          title="Comunicação"
          description="Gerencie demandas e notas oficiais"
          icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-800">
          Ocorreu um erro ao carregar os dados. Por favor, recarregue a página.
        </div>
      </div>
    );
  }

  // Main content with cards
  return (
    <div className="space-y-6">
      <WelcomeCard
        title="Comunicação"
        description="Gerencie demandas e notas oficiais"
        icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-500 to-blue-700"
      />
      
      {!isPreview && userData && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Only render what's needed and with proper display loading states */}
          {userData.coordenacaoId && (
            <PendingDemandsCard 
              coordenacaoId={userData.coordenacaoId} 
              isComunicacao={userData.isComunicacao || false} 
            />
          )}
          
          {userData.coordenacaoId && (
            <NotasManagementCard 
              coordenacaoId={userData.coordenacaoId} 
              isComunicacao={userData.isComunicacao || false}
            />
          )}
          
          {userData.coordenacaoId && (
            <DemandasEmAndamentoCard 
              coordenacaoId={userData.coordenacaoId} 
              isComunicacao={userData.isComunicacao || false}
            />
          )}
        </div>
      )}
      
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
