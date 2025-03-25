
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { areaSchema } from '@/hooks/useCoordinationAreas';

interface CoordinationAreaFormProps {
  onSubmit: (data: { descricao: string, sigla?: string, coordenacao?: string }) => Promise<void>;
  onCancel: () => void;
  defaultValues?: {
    descricao: string;
    sigla?: string;
    coordenacao?: string;
  };
  isSubmitting: boolean;
  submitText?: string;
}

const CoordinationAreaForm: React.FC<CoordinationAreaFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    descricao: '',
    sigla: '',
    coordenacao: ''
  },
  isSubmitting,
  submitText = 'Salvar'
}) => {
  return (
    <DataEntryForm
      schema={areaSchema}
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
              placeholder="Nome da área de coordenação"
            />
            {formState.errors.descricao && (
              <p className="text-sm text-red-500">{formState.errors.descricao.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="sigla">Sigla</Label>
            <Input
              id="sigla"
              {...register("sigla")}
              className="rounded-lg"
              placeholder="Sigla da área (ex: STLP)"
            />
            {formState.errors.sigla && (
              <p className="text-sm text-red-500">{formState.errors.sigla.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="coordenacao">Coordenação</Label>
            <Input
              id="coordenacao"
              {...register("coordenacao")}
              className="rounded-lg"
              placeholder="Nome do coordenador ou equipe"
            />
            {formState.errors.coordenacao && (
              <p className="text-sm text-red-500">{formState.errors.coordenacao.message}</p>
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
