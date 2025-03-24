
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import CardControls from './card-parts/CardControls';
import IconRenderer from './card-parts/IconRenderer';
import DeleteConfirmationDialog from './card-parts/DeleteConfirmationDialog';
import { getColorClasses } from './utils/cardColorUtils';
import { getCorrectPath } from './utils/cardPathHandler';

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  color: 'blue' | 'green' | 'orange' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light' | 'gray-ultra-light' | 'lime';
  path?: string;
  id: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  isDraggable?: boolean;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
  isCustom?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  icon,
  onClick,
  color,
  path,
  id,
  onDelete,
  onEdit,
  isDraggable = false,
  width = '25',
  height = '1',
  isCustom = false
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleClick = () => {
    if (path) {
      // Ensure path exists before navigating
      // Map standard card titles to their correct paths if needed
      const correctPath = getCorrectPath(title, path);
      
      // Navigate to the corrected path
      navigate(correctPath);
      
      // Log navigation for debugging purposes
      console.log(`Navigating to: ${correctPath}`);
    } else if (onClick) {
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(id);
      toast({
        title: "Card removido",
        description: `O card "${title}" foi removido com sucesso.`,
        variant: "success",
      });
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card 
        className={`cursor-pointer transition-all duration-300 border border-gray-200 
          rounded-xl shadow-md hover:shadow-xl overflow-hidden h-full
          ${getColorClasses(color)} ${isDraggable ? 'touch-action-none' : ''} group`}
        onClick={handleClick}
        data-card-id={id}
      >
        <CardContent className={`relative flex flex-col items-center justify-center p-6 md:p-4 h-full ${height === '2' ? 'min-h-[240px]' : 'min-h-[140px]'} transform-gpu hover:scale-[1.03] overflow-hidden`}>
          <CardControls 
            onDelete={onDelete ? handleDelete : undefined}
            onEdit={onEdit ? handleEdit : undefined}
          />
          <div className="mb-4">
            <IconRenderer icon={icon} title={title} />
          </div>
          <h3 className="text-lg font-medium text-center">{title}</h3>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title={title}
      />
    </>
  );
};

export default ActionCard;
