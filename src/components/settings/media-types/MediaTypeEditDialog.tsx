
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { MediaType } from '@/hooks/useMediaTypes';
import { Image } from 'lucide-react';
import IconSelector from '../IconSelector';
import useMediaTypeIcon from '@/hooks/useMediaTypeIcon';

interface MediaTypeEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: MediaType;
  onSubmit: (data: { descricao: string; icone?: string }) => Promise<void>;
  isSubmitting: boolean;
}

const MediaTypeEditDialog = ({ isOpen, onClose, mediaType, onSubmit, isSubmitting }: MediaTypeEditDialogProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      descricao: mediaType?.descricao || '',
    }
  });
  
  const [selectedIcon, setSelectedIcon] = useState<string | null>(mediaType?.icone || null);
  const [showIconSelector, setShowIconSelector] = useState(false);

  React.useEffect(() => {
    if (mediaType) {
      reset({
        descricao: mediaType.descricao,
      });
      setSelectedIcon(mediaType.icone || null);
    }
  }, [mediaType, reset]);

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      icone: selectedIcon
    });
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setShowIconSelector(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tipo de Mídia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register('descricao', { required: 'Descrição é obrigatória' })}
              className={errors.descricao ? 'border-red-500' : ''}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500">{errors.descricao.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Ícone</Label>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 border rounded-md flex items-center justify-center bg-gray-50">
                {selectedIcon ? (
                  <img src={selectedIcon} alt="Selected icon" className="w-6 h-6" />
                ) : (
                  <Image className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowIconSelector(true)}
              >
                {selectedIcon ? 'Alterar ícone' : 'Selecionar ícone'}
              </Button>
              {selectedIcon && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedIcon(null)}
                  className="text-red-500"
                >
                  Remover
                </Button>
              )}
            </div>
          </div>

          {showIconSelector && (
            <IconSelector
              onSelect={handleIconSelect}
              onClose={() => setShowIconSelector(false)} 
            />
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MediaTypeEditDialog;
