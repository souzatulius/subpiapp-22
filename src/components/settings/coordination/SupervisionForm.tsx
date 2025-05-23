
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { areaSchema } from '@/hooks/coordination-areas/types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Coordination } from '@/hooks/settings/useCoordination';

interface SupervisionFormProps {
  onSubmit: (data: { descricao: string, sigla?: string, coordenacao_id?: string }) => Promise<void>;
  onCancel: () => void;
  defaultValues?: {
    descricao: string;
    sigla?: string;
    coordenacao_id?: string;
  };
  isSubmitting: boolean;
  submitText?: string;
  coordinations?: Coordination[];
}

const SupervisionForm: React.FC<SupervisionFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    descricao: '',
    sigla: '',
    coordenacao_id: ''
  },
  isSubmitting,
  submitText = 'Salvar',
  coordinations = []
}) => {
  // Function to get the display text for coordination (sigla or full name)
  const getCoordinationDisplayText = (coord: Coordination) => {
    if (coord.sigla && coord.sigla.trim() !== '') {
      return coord.sigla;
    }
    return coord.descricao;
  };
  
  return (
    <DataEntryForm
      schema={areaSchema}
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
              placeholder="Nome da supervisão técnica"
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
              placeholder="Sigla da supervisão (ex: STLP)"
            />
            {formState.errors.sigla && (
              <p className="text-sm text-red-500">{formState.errors.sigla.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="coordenacao_id">Coordenação</Label>
            <Select
              defaultValue={defaultValues.coordenacao_id || 'none'}
              onValueChange={(value) => {
                // Convert 'none' to empty string for the form submission
                setValue("coordenacao_id", value === 'none' ? '' : value);
              }}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecione uma coordenação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {coordinations.map((coordination) => (
                  <SelectItem key={coordination.id} value={coordination.id}>
                    {getCoordinationDisplayText(coordination)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formState.errors.coordenacao_id && (
              <p className="text-sm text-red-500">{formState.errors.coordenacao_id.message}</p>
            )}
          </div>
        </div>
      )}
      isSubmitting={isSubmitting}
      submitText={submitText}
    />
  );
};

export default SupervisionForm;
