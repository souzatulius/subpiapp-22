
import React from 'react';
import { ActionCardItem } from '@/types/dashboard';
import OriginsDemandCardWrapper from '../../cards/OriginsDemandCardWrapper';
import PendingActivitiesCard from '../../cards/PendingActivitiesCard';
import PendingTasksCard from '../../cards/PendingTasksCard';
import ComunicadosCard from '../../cards/ComunicadosCard';
import UserProfileCard from '../../cards/UserProfileCard';
import NotificationSettingsCard from '../../cards/NotificationSettingsCard';

interface CardSpecialContentProps {
  card: ActionCardItem;
  renderSpecialCardContent?: (cardId: string) => React.ReactNode | null;
  specialCardsData?: any;
}

export const getSpecialContent = ({
  card,
  renderSpecialCardContent,
  specialCardsData
}: CardSpecialContentProps) => {
  if (renderSpecialCardContent) {
    const customContent = renderSpecialCardContent(card.id);
    if (customContent) return customContent;
  }

  if (card.type === 'origin_demand_chart' || card.id === 'origem-demandas-card' || 
      card.id.includes('origem-demandas') || 
      card.id.includes('origemDemandas') ||
      card.id.includes('origin-demand-chart') ||
      card.title === "Atividades em Andamento") {
    return <OriginsDemandCardWrapper 
      className="w-full h-full" 
      color={card.color}
      title={card.title}
      subtitle={card.subtitle}
    />;
  }
  
  if (card.type === 'pending_actions' || card.isPendingActions) {
    return <PendingActivitiesCard 
      color={card.color}
      title={card.title}
      subtitle={card.subtitle}
    />;
  }
  
  if (card.type === 'pending_tasks' || card.isPendingTasks) {
    return <PendingTasksCard 
      id={card.id}
      title={card.title}
      userDepartmentId={card.departmentId}
      isComunicacao={card.isComunicacao}
    />;
  }
  
  if (card.type === 'communications' || card.isComunicados) {
    return <ComunicadosCard 
      id={card.id}
      title={card.title}
      className="w-full h-full shadow-md border border-gray-100 rounded-xl"
    />;
  }
  
  if (card.type === 'user_profile' || card.isUserProfile) {
    return <UserProfileCard
      id={card.id}
      title={card.title}
    />;
  }
  
  if (card.type === 'notification_settings' || card.isNotificationSettings) {
    return <NotificationSettingsCard
      id={card.id}
      title={card.title}
    />;
  }
  
  return null;
};

export default getSpecialContent;
