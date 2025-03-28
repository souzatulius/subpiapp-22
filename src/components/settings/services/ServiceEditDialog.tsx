
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service } from '@/hooks/services/types';
import { supabase } from '@/integrations/supabase/client';

interface Problem {
  id: string;
  descricao: string;
}

interface ServiceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSubmit: (data: { descricao: string; problema_id: string }) => Promise<void>;
  isSubmitting: boolean;
}

const ServiceEditDialog = ({ 
  isOpen, 
  onClose, 
  service, 
  onSubmit, 
  isSubmitting 
}: ServiceEditDialogProps) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    defaultValues: {
      descricao: '',
      problema_id: ''
    }
  });

  // Reset form when service changes
  useEffect(() => {
    if (service) {
      reset({
        descricao: service.descricao,
        problema_id: service.problema_id
      });
    }
  }, [service, reset]);

  // Fetch problems
  useEffect(() => {
    const fetchProblems = async () => {
      if (!isOpen) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('problemas')
          .select('id, descricao')
          .order('descricao');

        if (error) throw error;
        setProblems(data || []);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [isOpen]);

  const handleFormSubmit = async (data: { descricao: string; problema_id: string }) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Digite a descrição do serviço"
              {...register('descricao', { required: 'Descrição é obrigatória' })}
              className={errors.descricao ? 'border-red-500' : ''}
            />
            {errors.descricao && (
              <p className="text-sm text-red-500">{errors.descricao.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="problema_id">Problema/Tema</Label>
            <Select
              onValueChange={(value) => setValue('problema_id', value)}
              defaultValue={service?.problema_id}
            >
              <SelectTrigger id="problema_id" className={errors.problema_id ? 'border-red-500' : ''}>
                <SelectValue placeholder={isLoading ? 'Carregando...' : 'Selecione um problema/tema'} />
              </SelectTrigger>
              <SelectContent>
                {problems.map((problem) => (
                  <SelectItem key={problem.id} value={problem.id}>
                    {problem.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.problema_id && (
              <p className="text-sm text-red-500">{errors.problema_id.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceEditDialog;
