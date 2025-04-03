import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionCardItem, CardWidth, CardHeight, CardColor, CardType } from '@/types/dashboard';
import ActionCard from './ActionCard';
import { PencilLine, Trash2, EyeOff } from 'lucide-react';
import KPICard from '@/components/settings/dashboard-management/KPICard';
import DynamicListCard from '@/components/settings/dashboard-management/DynamicListCard';
import OriginSelectionCard from './cards/OriginSelectionCard';
import SmartSearchCard from './cards/SmartSearchCard';
import CardControls from './card-parts/CardControls';
import OriginFormCard from './cards/OriginFormCard';
import DynamicCard from './DynamicCard';

export interface Controls {
  cardId: string;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isCustom?: boolean;
}

export const Controls: React.FC<Controls> = ({ cardId, onEdit, onDelete, onHide, isCustom = false }) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(cardId);
        }}
        className="p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-600 hover:text-blue-800 transition-all"
        title="Editar card"
      >
        <PencilLine className="h-3.5 w-3.5" />
      </button>

      {onHide && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onHide(cardId);
          }}
          className="p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-orange-600 hover:text-orange-800 transition-all"
          title="Ocultar card"
        >
          <EyeOff className="h-3.5 w-3.5" />
        </button>
      )}
      
      {isCustom && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cardId);
          }}
          className="p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 hover:text-red-600 transition-all"
          title="Excluir card"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export interface UnifiedActionCardProps extends ActionCardItem {
  isDraggable?: boolean;
  isEditing?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  disableWiggleEffect?: boolean;
  showSpecialFeatures?: boolean;
  quickDemandTitle?: string;
  onQuickDemandTitleChange?: (value: string) => void;
  onQuickDemandSubmit?: () => void;
  onSearchSubmit?: (query: string) => void;
  specialCardsData?: any;
  hasSubtitle?: boolean;
  isMobileView?: boolean;
  dataSourceKey?: string;
}

export function SortableUnifiedActionCard(props: UnifiedActionCardProps) {
  const {
    id,
    isDraggable = false,
    isEditing = false,
    disableWiggleEffect = false,
    ...rest
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animation: disableWiggleEffect ? 'none' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <UnifiedActionCard 
        id={id} 
        sortableProps={isDraggable ? { attributes, listeners } : undefined} 
        isEditing={isEditing}
        {...rest} 
      />
    </div>
  );
}

export interface SortableProps {
  attributes: ReturnType<typeof useSortable>['attributes']; 
  listeners: ReturnType<typeof useSortable>['listeners'];
}

export function UnifiedActionCard({
  id,
  title,
  subtitle,
  iconId,
  path,
  color,
  width,
  height,
  type = 'standard',
  isEditing = false,
  onEdit,
  onDelete,
  onHide,
  sortableProps,
  iconSize,
  isCustom,
  isQuickDemand,
  isSearch,
  isMobileView = false,
  showSpecialFeatures = true,
  quickDemandTitle,
  onQuickDemandTitleChange,
  onQuickDemandSubmit,
  onSearchSubmit,
  specialCardsData,
  disableWiggleEffect,
  hasBadge,
  badgeValue,
  hasSubtitle,
  dataSourceKey,
}: UnifiedActionCardProps & { sortableProps?: SortableProps }) {
  
  const renderCardContent = () => {
    if (type === 'dynamic' && dataSourceKey) {
      return (
        <DynamicCard 
          title={title}
          dataSourceKey={dataSourceKey}
          iconComponent={iconId ? React.createElement(getIconComponentFromId(iconId), { className: 'h-6 w-6' }) : undefined}
        />
      );
    }
    
    if (type === 'data_dynamic' && specialCardsData?.kpis) {
      const kpis = specialCardsData.kpis;
      
      if (title.includes('Solicitações de imprensa')) {
        return (
          <KPICard 
            title="Solicitações de imprensa"
            value={kpis.pressRequests.today}
            previousValue={kpis.pressRequests.yesterday}
            percentageChange={kpis.pressRequests.percentageChange}
            loading={kpis.pressRequests.loading}
            variant={kpis.pressRequests.percentageChange > 0 ? "success" : "default"}
          />
        );
      } else if (title.includes('Demandas em aprovação')) {
        return (
          <KPICard 
            title="Demandas em aprovação"
            value={kpis.pendingApproval.total}
            secondaryValue={kpis.pendingApproval.awaitingResponse}
            secondaryLabel="aguardando resposta"
            loading={kpis.pendingApproval.loading}
            variant="warning"
          />
        );
      } else if (title.includes('Notas produzidas')) {
        return (
          <KPICard 
            title="Notas produzidas"
            value={kpis.notesProduced.total}
            secondaryValue={kpis.notesProduced.approved}
            secondaryLabel={`aprovadas | ${kpis.notesProduced.rejected} recusadas`}
            loading={kpis.notesProduced.loading}
            variant="success"
          />
        );
      }
    }
    
    if (type === 'in_progress_demands' && specialCardsData?.lists) {
      return (
        <DynamicListCard 
          title="Demandas em andamento"
          items={specialCardsData.lists.recentDemands.items || []}
          loading={specialCardsData.lists.recentDemands.loading}
          emptyMessage="Nenhuma demanda em andamento"
          viewAllPath="/dashboard/comunicacao/demandas"
          viewAllLabel="Ver todas as demandas"
        />
      );
    }
    
    if (type === 'recent_notes' && specialCardsData?.lists) {
      return (
        <DynamicListCard 
          title="Notas de imprensa"
          items={specialCardsData.lists.recentNotes.items || []}
          loading={specialCardsData.lists.recentNotes.loading}
          emptyMessage="Nenhuma nota de imprensa"
          viewAllPath="/dashboard/comunicacao/notas"
          viewAllLabel="Ver todas as notas"
        />
      );
    }
    
    if (type === 'origin_selection' && specialCardsData?.originOptions) {
      return (
        <OriginSelectionCard 
          title="De onde vem a demanda?"
          options={specialCardsData.originOptions || []}
        />
      );
    }
    
    if (dataSourceKey === 'form_origem') {
      return <OriginFormCard />;
    }
    
    if (dataSourceKey === 'smartSearch' || type === 'smart_search') {
      return (
        <SmartSearchCard 
          placeholder="O que vamos fazer?" 
          onSearch={onSearchSubmit}
          isEditMode={isEditing}
        />
      );
    }
    
    return (
      <div
        className="h-full"
        {...(sortableProps ? { ...sortableProps.attributes, ...sortableProps.listeners } : {})}
      >
        <ActionCard
          id={id}
          title={title}
          iconId={iconId}
          path={path}
          color={color}
          isDraggable={isEditing}
          onEdit={onEdit}
          onDelete={onDelete}
          onHide={onHide}
          isCustom={isCustom}
          iconSize={iconSize}
          isMobileView={isMobileView}
        />
      </div>
    );
  };
  
  return (
    <div className="h-full relative group">
      {renderCardContent()}
      
      {(isEditing || onEdit) && (
        <CardControls 
          onEdit={onEdit ? (e) => { 
            e.stopPropagation();
            onEdit(id); 
          } : undefined}
          onDelete={onDelete ? (e) => { 
            e.stopPropagation();
            onDelete(id); 
          } : undefined}
        />
      )}
    </div>
  );
}

function getIconComponentFromId(iconId: string) {
  const IconMap = {
    'message-square-reply': () => import('lucide-react').then(mod => mod.MessageSquareReply),
    'plus-circle': () => import('lucide-react').then(mod => mod.PlusCircle),
    'list-filter': () => import('lucide-react').then(mod => mod.ListFilter),
    'message-circle': () => import('lucide-react').then(mod => mod.MessageCircle),
    'file-text': () => import('lucide-react').then(mod => mod.FileText),
    'check-circle': () => import('lucide-react').then(mod => mod.CheckCircle),
    'trophy': () => import('lucide-react').then(mod => mod.Trophy),
    'bar-chart-2': () => import('lucide-react').then(mod => mod.BarChart2),
    'search': () => import('lucide-react').then(mod => mod.Search),
    'clipboard-document-check': () => import('lucide-react').then(mod => mod.ClipboardCheck),
    'list-bullet': () => import('lucide-react').then(mod => mod.List),
    'inbox-arrow-down': () => import('lucide-react').then(mod => mod.InboxIcon),
    'document-check': () => import('lucide-react').then(mod => mod.FileCheck),
    'document-plus': () => import('lucide-react').then(mod => mod.FilePlus),
    'document-text': () => import('lucide-react').then(mod => mod.FileText),
  };
  
  const LoadedIcon = React.lazy(() => 
    IconMap[iconId]?.() || import('lucide-react').then(mod => ({ default: mod.MessageSquare }))
  );
  
  return (props: any) => (
    <React.Suspense fallback={<div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full" />}>
      <LoadedIcon {...props} />
    </React.Suspense>
  );
}

export default UnifiedActionCard;
