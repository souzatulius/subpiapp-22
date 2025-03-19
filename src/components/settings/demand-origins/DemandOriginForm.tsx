
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { z } from 'zod';

// Schema for demand origin validation
export const demandOriginSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
});

interface DemandOriginFormProps {
  onSubmit: (data: { descricao: string }) => Promise<void>;
  onCancel: () => void;
  defaultValue?: string;
  isSubmitting: boolean;
  submitText?: string;
}

const DemandOriginForm: React.FC<DemandOriginFormProps> = ({
  onSubmit,
  onCancel,
  defaultValue = '',
  isSubmitting,
  submitText = 'Salvar'
}) => {
  return (
    <DataEntryForm
      schema={demandOriginSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={{
        descricao: defaultValue,
      }}
      renderFields={() => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              defaultValue={defaultValue}
              placeholder="Nome da origem de demanda"
              autoFocus
            />
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
      submitText={submitText}
    />
  );
};

export default DemandOriginForm;
