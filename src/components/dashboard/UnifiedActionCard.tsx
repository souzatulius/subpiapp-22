
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionCardItem, CardWidth, CardHeight, CardColor, CardType } from '@/types/dashboard';
import ActionCard from './ActionCard';
import { PencilLine, Trash2, EyeOff } from 'lucide-react';
import KPICard from '@/components/settings/dashboard-management/KPICard';
import DynamicListCard from '@/components/settings/dashboard-management/DynamicListCard';
import OriginSelectionCard from './cards/OriginSelectionCard';
import SmartSearchCard from './SmartSearchCard';
import SearchCard from './grid/card-types/SearchCard';
import CardControls from './card-parts/CardControls';
import { useNavigate } from 'react-router-dom';

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
  children?: React.ReactNode;
}

export function SortableUnifiedActionCard(props: UnifiedActionCardProps) {
  const {
    id,
    isDraggable = false,
    isEditing = false,
    disableWiggleEffect = true,
    children,
    ...rest
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animation: disableWiggleEffect ? 'none' : undefined,
    zIndex: isDragging ? 10 : 'auto',
    boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.2)' : 'none',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`h-full ${isDragging ? 'opacity-80' : ''}`}
      {...attributes}
      {...listeners}
    >
      <UnifiedActionCard 
        id={id} 
        sortableProps={isDraggable ? { attributes, listeners } : undefined} 
        isEditing={isEditing}
        disableWiggleEffect={disableWiggleEffect}
        children={children}
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
  children,
}: UnifiedActionCardProps & { sortableProps?: SortableProps }) {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    if (path && !isEditing) {
      navigate(path);
    }
  };
  
  const renderCardContent = () => {
    if (children) {
      return children;
    }
    
    // Fix for the type error: Check both isSearch and type for smart_search
    if (isSearch || type === 'smart_search') {
      return (
        <SearchCard 
          card={{ id, title, iconId, path, color, type, isSearch }}
          onSearchSubmit={onSearchSubmit}
          isEditMode={isEditing}
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
    
    if (type === 'origin_selection') {
      return (
        <OriginSelectionCard 
          title={title || "Cadastro de Demandas"}
          options={specialCardsData?.originOptions}
        />
      );
    }
    
    if (type === 'smart_search') {
      return (
        <SmartSearchCard 
          placeholder={title || "O que vamos fazer?"} 
          onSearch={onSearchSubmit}
          isEditMode={isEditing}
        />
      );
    }
    
    return (
      <div className="h-full" onClick={handleCardClick}>
        <ActionCard
          id={id}
          title={title}
          iconId={iconId}
          path={path}
          color={color}
          isDraggable={isEditing}
          onEdit={undefined}
          onDelete={undefined}
          onHide={undefined}
          isCustom={isCustom}
          iconSize={iconSize}
          isMobileView={isMobileView}
          showControls={false}
        />
      </div>
    );
  };
  
  return (
    <div className="h-full relative group" onClick={isEditing ? undefined : handleCardClick}>
      {renderCardContent()}
      
      {(isEditing || onEdit) && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CardControls 
            onEdit={onEdit ? () => onEdit(id) : undefined}
            onDelete={onDelete ? () => onDelete(id) : undefined}
            onHide={onHide ? () => onHide(id) : undefined}
          />
        </div>
      )}
    </div>
  );
}

export default UnifiedActionCard;
