
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Service } from '@/hooks/services/types';
import { Area } from '@/hooks/services/types';

interface ServiceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  areas: Area[];
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string }) => Promise<void>;
  isSubmitting: boolean;
}

const ServiceEditDialog: React.FC<ServiceEditDialogProps> = ({
  isOpen,
  onClose,
  service,
  areas,
  onSubmit,
  isSubmitting
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
    defaultValues: {
      descricao: service?.descricao || '',
      supervisao_tecnica_id: service?.supervisao_id || service?.supervisao_tecnica_id || ''
    }
  });

  React.useEffect(() => {
    if (service) {
      reset({
        descricao: service.descricao,
        supervisao_tecnica_id: service.supervisao_id || service.supervisao_tecnica_id || '',
      });
    }
  }, [service, reset]);

  const selectedAreaId = watch('supervisao_tecnica_id');

  if (!isOpen || !service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              value={selectedAreaId}
            >
              <SelectTrigger id="supervisao_tecnica_id" className={errors.supervisao_tecnica_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione uma supervisão técnica" />
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

export default ServiceEditDialog;
