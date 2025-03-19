
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { areaSchema } from '@/hooks/useCoordinationAreas';

interface CoordinationAreaFormProps {
  onSubmit: (data: { descricao: string }) => Promise<void>;
  onCancel: () => void;
  defaultValue?: string;
  isSubmitting: boolean;
  submitText?: string;
}

const CoordinationAreaForm: React.FC<CoordinationAreaFormProps> = ({
  onSubmit,
  onCancel,
  defaultValue = '',
  isSubmitting,
  submitText = 'Salvar'
}) => {
  return (
    <DataEntryForm
      schema={areaSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={{
        descricao: defaultValue,
      }}
      renderFields={({ register, formState }) => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register("descricao")}
              className="rounded-lg"
            />
            {formState.errors.descricao && (
              <p className="text-sm text-red-500">{formState.errors.descricao.message}</p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
      submitText={submitText}
    />
  );
};

export default CoordinationAreaForm;
