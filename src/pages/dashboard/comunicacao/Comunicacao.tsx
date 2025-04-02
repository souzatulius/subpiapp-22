
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { MessageSquareReply, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
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

  // Use React Query for better caching, loading states and error handling
  const { data: userData, isLoading: isUserDataLoading, error: userDataError } = useQuery({
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
      
      // Fetch user's department
      const { data: userDept, error: userDeptError } = await supabase
        .from('usuarios')
        .select('coordenacao_id')
        .eq('id', user.id)
        .single();
      
      if (userDeptError) {
        console.error('Error fetching user department:', userDeptError);
        throw userDeptError;
      }
      
      if (!userDept?.coordenacao_id) {
        return {
          coordenacaoId: 'default',
          isComunicacao: false,
          departmentName: 'Padrão'
        };
      }
      
      // Fetch department name
      const { data: coordData, error: coordError } = await supabase
        .from('coordenacoes')
        .select('descricao')
        .eq('id', userDept.coordenacao_id)
        .single();
      
      if (coordError) {
        console.error('Error fetching coordination info:', coordError);
        throw coordError;
      }
      
      const isComunicacao = 
        coordData?.descricao.toLowerCase().includes('comunica') || 
        userDept.coordenacao_id === 'comunicacao';
      
      return {
        coordenacaoId: userDept.coordenacao_id,
        isComunicacao,
        departmentName: coordData?.descricao || 'Departamento'
      };
    },
    enabled: !isPreview && !!user,
    retry: 1,
    refetchOnWindowFocus: false
  });
  
  useEffect(() => {
    if (userDataError) {
      toast({
        title: "Erro ao carregar informações",
        description: "Não foi possível carregar as informações do departamento.",
        variant: "destructive"
      });
    }
  }, [userDataError]);

  if (isUserDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600 font-medium">Carregando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeCard
        title="Comunicação"
        description="Gerencie demandas e notas oficiais"
        icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
        color="bg-gradient-to-r from-blue-500 to-blue-700"
      />
      
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
