
import React from 'react';
import { PlusCircle, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import UnifiedActionCard from '@/components/dashboard/UnifiedActionCard';
import { ActionCardItem } from '@/types/dashboard';
import { useDefaultDashboardConfig } from '@/hooks/dashboard-management/useDefaultDashboardConfig';

interface ActionCardsProps {
  coordenacaoId: string;
  isComunicacao: boolean;
  baseUrl?: string;
  isEditMode?: boolean;
}

const ActionCards: React.FC<ActionCardsProps> = ({ 
  coordenacaoId, 
  isComunicacao,
  baseUrl = '',
  isEditMode = false
}) => {
  // Use the dashboard config hook to get cards configured for this department
  const { config: dashboardCards, isLoading } = useDefaultDashboardConfig('comunicacao');
  
  // Define default cards if no config exists
  const defaultCards = [
    {
      id: 'cadastrar-demanda',
      title: 'Cadastrar Demanda',
      subtitle: 'Registre novas solicitações da imprensa',
      iconId: 'PlusCircle',
      path: `${baseUrl ? `/${baseUrl}` : ''}/cadastrar`,
      color: 'blue',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 1
    },
    {
      id: 'responder-demanda',
      title: 'Responder Demanda',
      subtitle: 'Responda às demandas pendentes',
      iconId: 'MessageSquare',
      path: `${baseUrl ? `/${baseUrl}` : ''}/responder`,
      color: 'green',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 2
    },
    {
      id: 'criar-nota',
      title: 'Criar Nota Oficial',
      subtitle: 'Elabore notas oficiais',
      iconId: 'FileText',
      path: `${baseUrl ? `/${baseUrl}` : ''}/criar-nota`,
      color: 'orange',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 3
    },
    {
      id: 'aprovar-nota',
      title: 'Aprovar Notas',
      subtitle: 'Revise e aprove notas oficiais',
      iconId: 'CheckCircle',
      path: `${baseUrl ? `/${baseUrl}` : ''}/aprovar-nota`,
      color: 'purple-light',
      width: '25',
      height: '1',
      type: 'standard',
      displayMobile: true,
      mobileOrder: 4
    }
  ];

  // Use configured cards if available, otherwise use defaults
  const cards = (dashboardCards && dashboardCards.length > 0) ? dashboardCards : defaultCards;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-24 animate-pulse bg-gray-100">
            <CardContent className="p-4 flex items-center justify-center">
              <div className="text-gray-400">Carregando...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Link key={card.id || index} to={card.path} className="block h-full">
          <UnifiedActionCard
            id={card.id}
            title={card.title}
            subtitle={card.subtitle}
            iconId={card.iconId}
            path={card.path}
            color={card.color}
            width={card.width || '25'}
            height={card.height || '1'}
            hasSubtitle={true}
            iconSize="md"
          />
        </Link>
      ))}
    </div>
  );
};

export default ActionCards;
