
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Problem } from '@/hooks/problems/types';
import { SupervisaoTecnica } from '@/types/common';
import { Image } from 'lucide-react';
import IconSelector from '../IconSelector';

interface ProblemEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  areas: SupervisaoTecnica[];
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string; icone?: string }) => Promise<void>;
  isSubmitting: boolean;
}

const ProblemEditDialog = ({ isOpen, onClose, problem, areas, onSubmit, isSubmitting }: ProblemEditDialogProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
    defaultValues: {
      descricao: problem?.descricao || '',
      supervisao_tecnica_id: problem?.supervisao_tecnica_id || ''
    }
  });
  
  const [selectedIcon, setSelectedIcon] = useState<string | null>(problem?.icone || null);
  const [showIconSelector, setShowIconSelector] = useState(false);

  React.useEffect(() => {
    if (problem) {
      reset({
        descricao: problem.descricao,
        supervisao_tecnica_id: problem.supervisao_tecnica_id
      });
      setSelectedIcon(problem.icone || null);
    }
  }, [problem, reset]);

  const selectedArea = watch('supervisao_tecnica_id');

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
          <DialogTitle>Editar Problema</DialogTitle>
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
            <Label htmlFor="supervisao_tecnica_id">Supervisão Técnica</Label>
            <Select
              onValueChange={(value) => setValue('supervisao_tecnica_id', value)}
              value={selectedArea}
            >
              <SelectTrigger id="supervisao_tecnica_id" className={errors.supervisao_tecnica_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione uma área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.supervisao_tecnica_id && (
              <p className="text-sm text-red-500">{errors.supervisao_tecnica_id.message}</p>
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

export default ProblemEditDialog;
