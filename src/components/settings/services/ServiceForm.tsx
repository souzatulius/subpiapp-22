
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Problem {
  id: string;
  descricao: string;
}

interface ServiceFormProps {
  onSubmit: (data: { problema_id: string; services: { descricao: string }[] }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ServiceForm = ({ onSubmit, onCancel, isSubmitting }: ServiceFormProps) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      problema_id: '',
      services: [{ descricao: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services'
  });

  const selectedProblemId = watch('problema_id');

  // Fetch problems
  useEffect(() => {
    const fetchProblems = async () => {
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
  }, []);

  // Add a new service input
  const handleAddService = () => {
    append({ descricao: '' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="problema_id">Problema/Tema</Label>
        <Select
          onValueChange={(value) => setValue('problema_id', value)}
          value={selectedProblemId}
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
          <p className="text-sm text-red-500">{errors.problema_id?.message?.toString()}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Serviços</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddService}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Adicionar Serviço
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder={`Descrição do serviço ${index + 1}`}
                {...register(`services.${index}.descricao`, { 
                  required: 'Descrição é obrigatória' 
                })}
                className={errors.services?.[index]?.descricao ? 'border-red-500' : ''}
              />
              {errors.services?.[index]?.descricao && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.services[index]?.descricao?.message?.toString()}
                </p>
              )}
            </div>
            {fields.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => remove(index)}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
