import { useNavigate } from 'react-router-dom';
import { CardColor, CardWidth, CardHeight, CardType } from '@/types/dashboard';
import { getIconComponentFromId } from '@/hooks/dashboard/defaultCards';
import CardControls from './card-parts/CardControls';
import { MoveIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getColorClasses, getTextColorClass } from './utils/cardColorUtils';
import ChartPreview from './charts/ChartPreview';
import { memo } from 'react';
import NotesApprovalCard from './cards/NotesApprovalCard';
import PendingDemandsCard from './cards/PendingDemandsCard';
export interface ActionCardProps {
  id: string;
  title: string;
  iconId: string;
  path: string;
  color: CardColor;
  isDraggable?: boolean;
  width?: CardWidth;
  height?: CardHeight;
  type?: CardType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHide?: (id: string) => void;
  isCustom?: boolean;
  dataSourceKey?: string;
  displayMobile?: boolean;
  mobileOrder?: number;
  children?: React.ReactNode;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  isMobileView?: boolean;
  showControls?: boolean;
  subtitle?: string;
  chartId?: string;
  specialContent?: React.ReactNode;
}
const getIconSize = (size?: 'sm' | 'md' | 'lg' | 'xl'): string => {
  switch (size) {
    case 'sm':
      return 'w-6 h-6';
    case 'lg':
      return 'w-10 h-10';
    case 'xl':
      return 'w-10 h-10';
    case 'md':
    default:
      return 'w-10 h-10';
  }
};
const ActionCard = memo(({
  id,
  title,
  subtitle,
  iconId,
  path,
  color,
  isDraggable = false,
  onEdit,
  onDelete,
  onHide,
  isCustom = false,
  iconSize = 'md',
  isMobileView = false,
  children,
  showControls = true,
  chartId,
  type,
  specialContent
}: ActionCardProps) => {
  const navigate = useNavigate();
  const colorClasses = getColorClasses(color);
  const textColorClass = getTextColorClass(color, id);
  const renderIcon = () => {
    if (!iconId) return null;
    const LucideIcon = (LucideIcons as any)[iconId];
    if (LucideIcon) {
      return <LucideIcon className={getIconSize(iconSize)} />;
    }
    const FallbackIcon = getIconComponentFromId(iconId);
    return FallbackIcon ? <FallbackIcon className={getIconSize(iconSize)} /> : null;
  };
  const isNotesApprovalCard = id === 'aprovar-notas';
  const isPendingDemandsCard = id === 'responder-demandas';
  return <div className={`w-full h-full rounded-xl shadow-md overflow-hidden 
        ${!isDraggable ? 'cursor-pointer' : 'cursor-grab'} 
        hover:shadow-lg ${colorClasses} group relative`}>
      {isDraggable && <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-80 transition-opacity duration-200">
          <div className="p-1.5 rounded-full bg-white bg-opacity-60 text-gray-600">
            <MoveIcon className="h-3.5 w-3.5" />
          </div>
        </div>}

      {showControls && (onEdit || onDelete || onHide) && <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CardControls onEdit={onEdit ? () => onEdit(id) : undefined} onDelete={onDelete ? () => onDelete(id) : undefined} onHide={onHide ? () => onHide(id) : undefined} />
        </div>}

      <div className="relative h-full flex flex-col items-center justify-center text-center px-[10px] py-[20px] bg-transparent my-0">
        {specialContent ? <div className="w-full h-full">{specialContent}</div> : isNotesApprovalCard ? <NotesApprovalCard /> : isPendingDemandsCard ? <PendingDemandsCard /> : children ? children : chartId ? <div className="w-full h-full flex flex-col">
            <ChartPreview chartId={chartId} />
          </div> : <>
            <div className="mb-2.5 text-gray-800">
              {renderIcon()}
            </div>
            <div className="line-clamp-2 max-w-[90%] py-[6px] my-[5px]">
              <h3 className="font-semibold text-lg leading-tight break-words text-balance text-slate-50">
                {title}
              </h3>
              {subtitle && <p className="text-sm text-gray-700 opacity-80 mt-1 line-clamp-2">
                  {subtitle}
                </p>}
            </div>
          </>}
      </div>
    </div>;
});
ActionCard.displayName = 'ActionCard';
export default ActionCard;