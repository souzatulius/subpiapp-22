
import React from 'react';
import DataEntryForm from '../../DataEntryForm';
import { neighborhoodSchema } from '../NeighborhoodForm';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
            <Label htmlFor="nome">
              Nome
            </Label>
            <Input
              id="nome"
              {...form.register('nome')}
              className="rounded-lg"
            />
            {form.formState.errors.nome && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.nome.message}
              </p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="distrito_id">
              Distrito
            </Label>
            <select
              id="distrito_id"
              {...form.register('distrito_id')}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" className="bg-gray-100">Selecione um distrito</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id} className="bg-gray-100">
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
