
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { z } from 'zod';

// Schema for coordination validation
export const coordinationSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  sigla: z.string().optional(),
});

interface CoordinationFormProps {
  onSubmit: (data: { descricao: string, sigla?: string }) => Promise<void>;
  onCancel: () => void;
  defaultValues?: {
    descricao: string;
    sigla?: string;
  };
  isSubmitting: boolean;
  submitText?: string;
}

const CoordinationForm: React.FC<CoordinationFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    descricao: '',
    sigla: '',
  },
  isSubmitting,
  submitText = 'Salvar'
}) => {
  return (
    <DataEntryForm
      schema={coordinationSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={defaultValues}
      renderFields={({ register, formState }) => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register("descricao")}
              className="rounded-lg"
              placeholder="Nome da coordenação"
            />
            {formState.errors.descricao && (
              <p className="text-sm text-red-500">{formState.errors.descricao.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="sigla">Sigla (opcional)</Label>
            <Input
              id="sigla"
              {...register("sigla")}
              className="rounded-lg"
              placeholder="Sigla da coordenação (ex: STLP)"
            />
            {formState.errors.sigla && (
              <p className="text-sm text-red-500">{formState.errors.sigla.message}</p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
      submitText={submitText}
    />
  );
};

export default CoordinationForm;
