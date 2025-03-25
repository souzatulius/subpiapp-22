
import React from 'react';
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
import { Area } from '@/hooks/problems/types';
import IconSelector from './IconSelector';

interface ProblemEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  areas: Area[];
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string; icone?: string }) => Promise<void>;
  isSubmitting: boolean;
}

const ProblemEditDialog = ({ isOpen, onClose, problem, areas, onSubmit, isSubmitting }: ProblemEditDialogProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
    defaultValues: {
      descricao: problem?.descricao || '',
      supervisao_tecnica_id: problem?.supervisao_tecnica_id || '',
      icone: problem?.icone || ''
    }
  });

  React.useEffect(() => {
    if (problem) {
      reset({
        descricao: problem.descricao,
        supervisao_tecnica_id: problem.supervisao_tecnica_id,
        icone: problem.icone || ''
      });
    }
  }, [problem, reset]);

  const selectedArea = watch('supervisao_tecnica_id');
  const selectedIcon = watch('icone');

  const handleIconSelect = (icon: string) => {
    setValue('icone', icon);
  };

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
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
            <Label>Ícone</Label>
            <IconSelector selectedIcon={selectedIcon} onSelectIcon={handleIconSelect} />
          </div>

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
