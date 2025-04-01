
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import WelcomeCard from '@/components/shared/WelcomeCard';
import { MessageSquareReply, Loader2, Edit, X, Eye, EyeOff } from 'lucide-react';
import NewRequestOriginCard from '@/components/comunicacao/NewRequestOriginCard';
import PendingDemandsCard from '@/components/comunicacao/PendingDemandsCard';
import NotasManagementCard from '@/components/comunicacao/NotasManagementCard';
import DemandasEmAndamentoCard from '@/components/comunicacao/DemandasEmAndamentoCard';
import ActionCards from '@/components/comunicacao/ActionCards';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/layouts/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ComunicacaoDashboardProps {
  isPreview?: boolean;
  department?: string;
}

interface ContentCardVisibility {
  newRequest: boolean;
  pendingDemands: boolean;
  notasManagement: boolean;
  demandasEmAndamento: boolean;
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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [contentVisibility, setContentVisibility] = useState<ContentCardVisibility>({
    newRequest: true,
    pendingDemands: true,
    notasManagement: true,
    demandasEmAndamento: true
  });
  
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

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const toggleCardVisibility = (cardKey: keyof ContentCardVisibility) => {
    setContentVisibility(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));

    toast({
      title: "Visibilidade alterada",
      description: `O card foi ${contentVisibility[cardKey] ? 'ocultado' : 'exibido'}`,
      variant: "success"
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600 font-medium">Carregando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 pb-20 md:pb-6">
      {/* Welcome Card and Edit Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <WelcomeCard
          title="Comunicação"
          description="Gerencie demandas e notas oficiais"
          icon={<MessageSquareReply className="h-6 w-6 mr-2" />}
          color="bg-gradient-to-r from-blue-500 to-blue-700"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleEditMode}
          className="ml-auto"
        >
          {isEditMode ? "Concluir edição" : "Editar dashboard"}
        </Button>
      </div>
      
      {/* Action Cards - Moved to top without title */}
      <div>
        <ActionCards 
          coordenacaoId={userDepartment || ''} 
          isComunicacao={isComunicacao}
          baseUrl="dashboard/comunicacao" 
        />
      </div>
      
      {/* Dynamic Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Nova Solicitação - only for Comunicação */}
        {(isComunicacao && (contentVisibility.newRequest || isEditMode)) && (
          <div className="col-span-1 md:col-span-1 relative">
            {isEditMode && (
              <div className="absolute top-2 right-2 z-10 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 bg-white rounded-full shadow hover:bg-gray-100" 
                  onClick={() => toggleCardVisibility('newRequest')}
                >
                  {contentVisibility.newRequest ? 
                    <EyeOff className="h-4 w-4 text-orange-600" /> : 
                    <Eye className="h-4 w-4 text-blue-600" />
                  }
                </Button>
              </div>
            )}
            <div className={isEditMode && !contentVisibility.newRequest ? "opacity-50" : ""}>
              <NewRequestOriginCard baseUrl="dashboard/comunicacao" />
            </div>
          </div>
        )}
        
        {/* Card 2: Responder Demandas - for all */}
        {(contentVisibility.pendingDemands || isEditMode) && (
          <div className="col-span-1 md:col-span-1 relative">
            {isEditMode && (
              <div className="absolute top-2 right-2 z-10 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 bg-white rounded-full shadow hover:bg-gray-100" 
                  onClick={() => toggleCardVisibility('pendingDemands')}
                >
                  {contentVisibility.pendingDemands ? 
                    <EyeOff className="h-4 w-4 text-orange-600" /> : 
                    <Eye className="h-4 w-4 text-blue-600" />
                  }
                </Button>
              </div>
            )}
            <div className={isEditMode && !contentVisibility.pendingDemands ? "opacity-50" : ""}>
              <PendingDemandsCard 
                coordenacaoId={userDepartment || ''} 
                isComunicacao={isComunicacao}
                baseUrl="dashboard/comunicacao"
              />
            </div>
          </div>
        )}
        
        {/* Card 3: Gerenciamento de Notas - for all */}
        {(contentVisibility.notasManagement || isEditMode) && (
          <div className="col-span-1 md:col-span-1 relative">
            {isEditMode && (
              <div className="absolute top-2 right-2 z-10 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 bg-white rounded-full shadow hover:bg-gray-100" 
                  onClick={() => toggleCardVisibility('notasManagement')}
                >
                  {contentVisibility.notasManagement ? 
                    <EyeOff className="h-4 w-4 text-orange-600" /> : 
                    <Eye className="h-4 w-4 text-blue-600" />
                  }
                </Button>
              </div>
            )}
            <div className={isEditMode && !contentVisibility.notasManagement ? "opacity-50" : ""}>
              <NotasManagementCard 
                coordenacaoId={userDepartment || ''} 
                isComunicacao={isComunicacao}
                baseUrl="dashboard/comunicacao/notas"
              />
            </div>
          </div>
        )}
        
        {/* Card 4: Demandas em Andamento - for all */}
        {(contentVisibility.demandasEmAndamento || isEditMode) && (
          <div className={`col-span-1 md:col-span-${isComunicacao ? 3 : 1} relative`}>
            {isEditMode && (
              <div className="absolute top-2 right-2 z-10 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 bg-white rounded-full shadow hover:bg-gray-100" 
                  onClick={() => toggleCardVisibility('demandasEmAndamento')}
                >
                  {contentVisibility.demandasEmAndamento ? 
                    <EyeOff className="h-4 w-4 text-orange-600" /> : 
                    <Eye className="h-4 w-4 text-blue-600" />
                  }
                </Button>
              </div>
            )}
            <div className={isEditMode && !contentVisibility.demandasEmAndamento ? "opacity-50" : ""}>
              <DemandasEmAndamentoCard 
                coordenacaoId={userDepartment || ''} 
                isComunicacao={isComunicacao}
                baseUrl="dashboard/comunicacao" 
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Only add MobileBottomNav if this page is not in preview mode */}
      {!isPreview && isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ComunicacaoDashboard;
