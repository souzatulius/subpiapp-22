
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { X, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray-light' | 'gray-dark' | 'blue-dark' | 'orange-light' | 'gray-ultra-light';
  path?: string;
  id: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  isDraggable?: boolean;
  width?: '25' | '50' | '75' | '100';
  height?: '1' | '2';
  isCustom?: boolean;
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100';
    case 'blue-dark':
      return 'bg-subpi-blue text-white border-subpi-blue hover:bg-subpi-blue-dark';
    case 'green':
      return 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100';
    case 'orange':
      return 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100';
    case 'orange-light':
      return 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100';
    case 'purple':
      return 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100';
    case 'red':
      return 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100';
    case 'gray-light':
      return 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100';
    case 'gray-dark':
      return 'bg-gray-700 text-white border-gray-600 hover:bg-gray-800';
    case 'gray-ultra-light':
      return 'bg-gray-25 text-gray-600 border-gray-50 hover:bg-gray-50';
    default:
      return 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100';
  }
};

const getWidthClasses = (width: string = '25') => {
  switch (width) {
    case '25':
      return 'col-span-1';
    case '50':
      return 'col-span-1 md:col-span-2';
    case '75':
      return 'col-span-1 md:col-span-3';
    case '100':
      return 'col-span-1 md:col-span-4';
    default:
      return 'col-span-1';
  }
};

const getHeightClasses = (height: string = '1') => {
  return height === '2' ? 'row-span-2' : '';
};

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
      navigate(path);
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
          rounded-xl shadow-md hover:shadow-xl overflow-hidden 
          ${getColorClasses(color)} ${isDraggable ? 'touch-action-none' : ''} group`}
        onClick={handleClick}
        data-card-id={id}
      >
        <CardContent className={`relative flex flex-col items-center justify-center p-6 md:p-4 h-full ${height === '2' ? 'min-h-[240px]' : ''} transform-gpu hover:scale-[1.03]`}>
          {onDelete && (
            <button 
              className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              onClick={handleDelete}
              aria-label="Remover card"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {onEdit && (
            <button 
              className="absolute top-2 right-8 p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
              onClick={handleEdit}
              aria-label="Editar card"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <div className="mb-4">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-center">{title}</h3>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O card "{title}" será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
              onClick={confirmDelete}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionCard;
