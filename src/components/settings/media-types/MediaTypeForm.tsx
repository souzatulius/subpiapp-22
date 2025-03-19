
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { mediaTypeSchema } from '@/hooks/useMediaTypes';

interface MediaTypeFormProps {
  onSubmit: (data: { descricao: string }) => Promise<void>;
  onCancel: () => void;
  defaultValue?: string;
  isSubmitting: boolean;
  submitText?: string;
}

const MediaTypeForm: React.FC<MediaTypeFormProps> = ({
  onSubmit,
  onCancel,
  defaultValue = '',
  isSubmitting,
  submitText = 'Salvar'
}) => {
  return (
    <DataEntryForm
      schema={mediaTypeSchema}
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
              placeholder="Nome do tipo de mídia"
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

export default MediaTypeForm;
