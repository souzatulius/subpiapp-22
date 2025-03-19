
import React from 'react';
import DataEntryForm from '../../DataEntryForm';
import { neighborhoodSchema } from '../NeighborhoodForm';

interface NeighborhoodAddFormProps {
  onSubmit: (data: { nome: string; distrito_id: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  districts: any[];
}

const NeighborhoodAddForm: React.FC<NeighborhoodAddFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  districts,
}) => {
  return (
    <DataEntryForm
      schema={neighborhoodSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={{
        nome: '',
        distrito_id: '',
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
              placeholder="Nome do bairro"
            />
            {form.formState.errors.nome && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.nome.message}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="distrito_id" className="text-sm font-medium">
              Distrito
            </label>
            <select
              id="distrito_id"
              {...form.register('distrito_id')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione um distrito</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.nome}
                </option>
              ))}
            </select>
            {form.formState.errors.distrito_id && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.distrito_id.message}
              </p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
    />
  );
};

export default NeighborhoodAddForm;
