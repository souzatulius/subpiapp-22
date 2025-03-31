
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { MessageSquareReply, Loader2 } from 'lucide-react';
import NewRequestOriginCard from '@/components/comunicacao/NewRequestOriginCard';
import PendingDemandsCard from '@/components/comunicacao/PendingDemandsCard';
import NotasManagementCard from '@/components/comunicacao/NotasManagementCard';
import DemandasEmAndamentoCard from '@/components/comunicacao/DemandasEmAndamentoCard';
import ActionCards from '@/components/comunicacao/ActionCards';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

const ComunicacaoDashboard: React.FC<ComunicacaoDashboardProps> = ({ 
  isPreview = false, 
  department = 'comunicacao' 
}) => {
  const { user } = useAuth();
  const [userDepartment, setUserDepartment] = useState<string | null>(department);
  const [isComunicacao, setIsComunicacao] = useState<boolean>(department === 'comunicacao');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [departmentName, setDepartmentName] = useState<string>('');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isPreview) {
      // In preview mode, use the department provided as prop
      setUserDepartment(department);
      setIsComunicacao(department === 'comunicacao');
      fetchDepartmentName(department);
      setIsLoading(false);
      return;
    }

    // If not in preview mode, fetch the user's actual department
    async function fetchUserDepartment() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('usuarios')
          .select('coordenacao_id')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user department:', error);
          return;
        }
        
        if (data) {
          setUserDepartment(data.coordenacao_id);
          
          // Check if user is from Comunicacao
          const { data: coordData, error: coordError } = await supabase
            .from('coordenacoes')
            .select('descricao')
            .eq('id', data.coordenacao_id)
            .single();
          
          if (coordError) {
            console.error('Error fetching coordination info:', coordError);
          } else if (coordData) {
            setIsComunicacao(
              coordData.descricao.toLowerCase().includes('comunica') || 
              data.coordenacao_id === 'comunicacao'
            );
            setDepartmentName(coordData.descricao);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user department:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserDepartment();
  }, [user, isPreview, department]);

  const fetchDepartmentName = async (deptId: string) => {
    if (deptId && deptId !== 'default') {
      try {
        const { data, error } = await supabase
          .from('coordenacoes')
          .select('descricao')
          .eq('id', deptId)
          .single();
          
        if (error) {
          console.error('Error fetching department name:', error);
        } else if (data) {
          setDepartmentName(data.descricao);
        }
      } catch (err) {
        console.error('Failed to fetch department name:', err);
      }
    } else {
      setDepartmentName(deptId === 'default' ? 'Padrão (Todos)' : '');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600 font-medium">Carregando dashboard...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 w-full">
        <div className="space-y-4">
          {/* Welcome Card */}
          <WelcomeCard
            title="Comunicação"
            description="Gerencie demandas e notas oficiais"
            icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
            color="bg-gradient-to-r from-blue-500 to-blue-700"
          />
          
          {/* Action Cards - Moved to top without title */}
          <div className="w-full">
            <ActionCards 
              coordenacaoId={userDepartment || ''} 
              isComunicacao={isComunicacao}
              baseUrl="dashboard/comunicacao" 
            />
          </div>
          
          {/* Dynamic Content Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Card 1: Nova Solicitação - only for Comunicação */}
            {isComunicacao && (
              <div className="col-span-1 md:col-span-1 w-full">
                <NewRequestOriginCard baseUrl="dashboard/comunicacao" />
              </div>
            )}
            
            {/* Card 2: Responder Demandas - for all */}
            <div className="col-span-1 md:col-span-1 w-full">
              <PendingDemandsCard 
                coordenacaoId={userDepartment || ''} 
                isComunicacao={isComunicacao}
                baseUrl="dashboard/comunicacao"
              />
            </div>
            
            {/* Card 3: Gerenciamento de Notas - for all */}
            <div className="col-span-1 md:col-span-1 w-full">
              <NotasManagementCard 
                coordenacaoId={userDepartment || ''} 
                isComunicacao={isComunicacao}
                baseUrl="dashboard/comunicacao/notas"
              />
            </div>
            
            {/* Card 4: Demandas em Andamento - for all */}
            <div className={`col-span-1 md:col-span-${isComunicacao ? 3 : 1} w-full`}>
              <DemandasEmAndamentoCard 
                coordenacaoId={userDepartment || ''} 
                isComunicacao={isComunicacao}
                baseUrl="dashboard/comunicacao" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Only add MobileBottomNav if this page is not in preview mode */}
      {!isPreview && isMobile && <MobileBottomNav />}
    </>
  );
};

export default ComunicacaoDashboard;
