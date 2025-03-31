
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { 
  ClipboardList, 
  FileCheck, 
  MessageSquareReply, 
  FileText, 
  ListFilter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  badge?: number;
}

interface ActionCardsProps {
  coordenacaoId: string;
  isComunicacao: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, icon, color, path, badge }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className={`h-40 ${color} text-white shadow-md overflow-hidden cursor-pointer 
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95`}
      onClick={() => navigate(path)}
    >
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card Nova Solicitação - only for Comunicação */}
      {isComunicacao && (
        <ActionCard
          title="Nova Solicitação"
          icon={<ClipboardList className="w-20 h-20" />}
          color="bg-blue-500"
          path="/dashboard/comunicacao/cadastrar"
        />
      )}
      
      {/* Card Responder Demandas - for all */}
      <ActionCard
        title="Responder Demandas"
        icon={<MessageSquareReply className="w-20 h-20" />}
        color="bg-orange-500"
        path="/dashboard/comunicacao/responder"
        badge={pendingDemandsCount}
      />
      
      {/* Card Criar Nota Oficial - only for Comunicação */}
      {isComunicacao && (
        <ActionCard
          title="Criar Nota Oficial"
          icon={<FileText className="w-20 h-20" />}
          color="bg-blue-700"
          path="/dashboard/comunicacao/criar-nota"
        />
      )}
      
      {/* Card Aprovar Notas - for all */}
      <ActionCard
        title="Aprovar Notas"
        icon={<FileCheck className="w-20 h-20" />}
        color={isComunicacao ? "bg-green-600" : "bg-blue-700"}
        path="/dashboard/comunicacao/consultar-notas?filter=pendentes"
        badge={pendingApprovalCount}
      />
      
      {/* Card Consultar Demandas - for all */}
      <ActionCard
        title="Consultar Demandas"
        icon={<ListFilter className="w-20 h-20" />}
        color="bg-green-600"
        path="/dashboard/comunicacao/consultar-demandas"
      />
      
      {/* Card Consultar Notas - for all */}
      <ActionCard
        title="Consultar Notas"
        icon={<FileText className="w-20 h-20" />}
        color="bg-orange-500"
        path="/dashboard/comunicacao/consultar-notas"
      />
    </div>
  );
};

export default ActionCards;
