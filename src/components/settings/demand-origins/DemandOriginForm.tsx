
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import DataEntryForm from '../DataEntryForm';
import { z } from 'zod';
import IconSelector from '../IconSelector';

// Schema for demand origin validation
export const demandOriginSchema = z.object({
  descricao: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  icone: z.string().optional(),
});

interface DemandOriginFormProps {
  onSubmit: (data: { descricao: string, icone: string }) => Promise<void>;
  onCancel: () => void;
  defaultValue?: string;
  defaultIcon?: string;
  isSubmitting: boolean;
  submitText?: string;
}

const DemandOriginForm: React.FC<DemandOriginFormProps> = ({
  onSubmit,
  onCancel,
  defaultValue = '',
  defaultIcon = '',
  isSubmitting,
  submitText = 'Salvar'
}) => {
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(defaultIcon);

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setIsIconSelectorOpen(false);
  };

  return (
    <DataEntryForm
      schema={demandOriginSchema}
      onSubmit={(data) => onSubmit({ ...data, icone: selectedIcon })}
      onCancel={onCancel}
      defaultValues={{
        descricao: defaultValue,
        icone: defaultIcon,
      }}
      renderFields={(form) => (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              autoFocus
              className="rounded-lg"
              {...form.register('descricao')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Ícone</Label>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center border">
                {selectedIcon && (
                  <img 
                    src={`/icons/${selectedIcon}.svg`}
                    alt="Ícone selecionado"
                    className="w-6 h-6"
                    onError={(e) => {
                      // Se não for uma imagem válida, tenta renderizar como ícone Lucide
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsIconSelectorOpen(true)}
              >
                Selecionar ícone
              </Button>
            </div>
            <input 
              type="hidden" 
              {...form.register('icone')}
              value={selectedIcon}
            />
          </div>
          
          {isIconSelectorOpen && (
            <IconSelector 
              isOpen={isIconSelectorOpen}
              onClose={() => setIsIconSelectorOpen(false)}
              onSelect={handleIconSelect}
            />
          )}
        </div>
      )}
      isSubmitting={isSubmitting}
      submitText={submitText}
    />
  );
};

export default DemandOriginForm;
