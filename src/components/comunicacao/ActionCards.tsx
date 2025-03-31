
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  ClipboardList, 
  FileCheck, 
  MessageSquareReply, 
  FileText, 
  ListFilter,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CardControls from '@/components/dashboard/card-parts/CardControls';

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  badge?: number;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
  onEdit?: () => void;
}

interface ActionCardsProps {
  coordenacaoId: string;
  isComunicacao: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  icon, 
  color, 
  path, 
  badge,
  onToggleVisibility,
  isVisible = true,
  onEdit
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <Card 
      className={`h-40 ${color} text-white shadow-md overflow-hidden cursor-pointer 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95
        relative group`}
      onClick={handleClick}
    >
      {/* Controls for edit and visibility */}
      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {onToggleVisibility && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 transition-colors"
            title={isVisible ? "Ocultar card" : "Mostrar card"}
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 transition-colors"
            title="Editar card"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>

      <div className="relative p-6 h-full flex flex-col items-center justify-center text-center">
        {badge !== undefined && badge > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge > 99 ? '99+' : badge}
          </div>
        )}
        <div className="text-white mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
    </Card>
  );
};

const ActionCards: React.FC<ActionCardsProps> = ({ coordenacaoId, isComunicacao }) => {
  const [pendingDemandsCount, setPendingDemandsCount] = useState(0);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({
    novaSolicitacao: true,
    responderDemandas: true,
    criarNota: true,
    aprovarNotas: true,
    consultarDemandas: true,
    consultarNotas: true
  });
  
  // Load saved card visibility from localStorage
  useEffect(() => {
    const savedVisibility = localStorage.getItem('actionCardsVisibility');
    if (savedVisibility) {
      try {
        const parsed = JSON.parse(savedVisibility);
        setVisibleCards({...visibleCards, ...parsed});
      } catch (e) {
        console.error('Error parsing saved card visibility', e);
      }
    }
  }, []);
  
  // Save card visibility to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('actionCardsVisibility', JSON.stringify(visibleCards));
  }, [visibleCards]);
  
  useEffect(() => {
    async function fetchCounts() {
      // Fetch count of pending demands
      try {
        let query = supabase
          .from('demandas')
          .select('id', { count: 'exact' })
          .eq('status', 'pendente');
          
        if (!isComunicacao) {
          query = query.eq('coordenacao_id', coordenacaoId);
        }
        
        const { count, error } = await query;

        if (error) {
          console.error('Error fetching pending demands count:', error);
        } else {
          setPendingDemandsCount(count || 0);
        }
      } catch (err) {
        console.error('Failed to fetch pending demands count:', err);
      }
      
      // Fetch count of pending approvals
      try {
        let query = supabase
          .from('notas_oficiais')
          .select('id', { count: 'exact' })
          .eq('status', 'pendente');
          
        if (!isComunicacao) {
          query = query.eq('coordenacao_id', coordenacaoId);
        }
        
        const { count, error } = await query;

        if (error) {
          console.error('Error fetching pending approvals count:', error);
        } else {
          setPendingApprovalCount(count || 0);
        }
      } catch (err) {
        console.error('Failed to fetch pending approvals count:', err);
      }
    }
    
    fetchCounts();
  }, [coordenacaoId, isComunicacao]);

  const toggleCardVisibility = (cardKey: string) => {
    setVisibleCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };

  // Filter cards that should be displayed
  const getVisibleCardCount = () => {
    let count = 0;
    if (isComunicacao && visibleCards.novaSolicitacao) count++;
    if (visibleCards.responderDemandas) count++;
    if (isComunicacao && visibleCards.criarNota) count++;
    if (visibleCards.aprovarNotas) count++;
    if (visibleCards.consultarDemandas) count++;
    if (visibleCards.consultarNotas) count++;
    return count;
  };

  const visibleCardCount = getVisibleCardCount();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Card Nova Solicitação - only for Comunicação */}
      {isComunicacao && visibleCards.novaSolicitacao && (
        <ActionCard
          title="Nova Solicitação"
          icon={<ClipboardList className="w-20 h-20" />}
          color="bg-blue-500"
          path="/dashboard/comunicacao/cadastrar"
          onToggleVisibility={() => toggleCardVisibility('novaSolicitacao')}
          isVisible={true}
          onEdit={() => {}}
        />
      )}
      
      {/* Card Responder Demandas - for all */}
      {visibleCards.responderDemandas && (
        <ActionCard
          title="Responder Demandas"
          icon={<MessageSquareReply className="w-20 h-20" />}
          color="bg-orange-500"
          path="/dashboard/comunicacao/responder"
          badge={pendingDemandsCount}
          onToggleVisibility={() => toggleCardVisibility('responderDemandas')}
          isVisible={true}
          onEdit={() => {}}
        />
      )}
      
      {/* Card Criar Nota Oficial - only for Comunicação */}
      {isComunicacao && visibleCards.criarNota && (
        <ActionCard
          title="Criar Nota Oficial"
          icon={<FileText className="w-20 h-20" />}
          color="bg-blue-700"
          path="/dashboard/comunicacao/criar-nota"
          onToggleVisibility={() => toggleCardVisibility('criarNota')}
          isVisible={true}
          onEdit={() => {}}
        />
      )}
      
      {/* Card Aprovar Notas - for all */}
      {visibleCards.aprovarNotas && (
        <ActionCard
          title="Aprovar Notas"
          icon={<FileCheck className="w-20 h-20" />}
          color={isComunicacao ? "bg-green-600" : "bg-blue-700"}
          path="/dashboard/comunicacao/consultar-notas?filter=pendentes"
          badge={pendingApprovalCount}
          onToggleVisibility={() => toggleCardVisibility('aprovarNotas')}
          isVisible={true}
          onEdit={() => {}}
        />
      )}
      
      {/* Card Consultar Demandas - for all */}
      {visibleCards.consultarDemandas && (
        <ActionCard
          title="Consultar Demandas"
          icon={<ListFilter className="w-20 h-20" />}
          color="bg-green-600"
          path="/dashboard/comunicacao/consultar-demandas"
          onToggleVisibility={() => toggleCardVisibility('consultarDemandas')}
          isVisible={true}
          onEdit={() => {}}
        />
      )}
      
      {/* Card Consultar Notas - for all */}
      {visibleCards.consultarNotas && (
        <ActionCard
          title="Consultar Notas"
          icon={<FileText className="w-20 h-20" />}
          color="bg-orange-500"
          path="/dashboard/comunicacao/consultar-notas"
          onToggleVisibility={() => toggleCardVisibility('consultarNotas')}
          isVisible={true}
          onEdit={() => {}}
        />
      )}
    </div>
  );
};

export default ActionCards;
