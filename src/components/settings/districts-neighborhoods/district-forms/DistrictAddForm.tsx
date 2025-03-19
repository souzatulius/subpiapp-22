
import React from 'react';
import DataEntryForm from '../../DataEntryForm';
import { districtSchema } from '../DistrictForm';

interface DistrictAddFormProps {
  onSubmit: (data: { nome: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DistrictAddForm: React.FC<DistrictAddFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  return (
    <DataEntryForm
      schema={districtSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={{
        nome: '',
      }}
      renderFields={(form) => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              {...form.register('nome')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nome do distrito"
            />
            {form.formState.errors.nome && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.nome.message}
              </p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
    />
  );
};

export default DistrictAddForm;
