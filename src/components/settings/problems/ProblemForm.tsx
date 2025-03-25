
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { problemSchema, Area } from '@/hooks/problems/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProblemFormProps {
  onSubmit: (data: { descricao: string; area_coordenacao_id: string }) => Promise<void>;
  onCancel: () => void;
  defaultValues?: {
    descricao: string;
    area_coordenacao_id: string;
  };
  areas: Area[];
  isSubmitting: boolean;
  submitText?: string;
}

const ProblemForm: React.FC<ProblemFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    descricao: '',
    area_coordenacao_id: '',
  },
  areas,
  isSubmitting,
  submitText = 'Salvar'
}) => {
  return (
    <DataEntryForm
      schema={problemSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      defaultValues={defaultValues}
      renderFields={({ register, formState, setValue, watch }) => (
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
          
          <div className="grid gap-2">
            <Label htmlFor="area_coordenacao_id">Área de Coordenação</Label>
            <Select 
              onValueChange={(value) => setValue("area_coordenacao_id", value)}
              defaultValue={defaultValues.area_coordenacao_id}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecione uma área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formState.errors.area_coordenacao_id && (
              <p className="text-sm text-red-500">{formState.errors.area_coordenacao_id.message}</p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
      submitText={submitText}
    />
  );
};

export default ProblemForm;
