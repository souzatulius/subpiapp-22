
import React from 'react';
import DataEntryForm from '../../DataEntryForm';
import { neighborhoodSchema } from '../NeighborhoodForm';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

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
            <Select
              onValueChange={(value) => form.setValue('distrito_id', value)}
              defaultValue={form.getValues('distrito_id')}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecione um distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-district">Selecione um distrito</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
