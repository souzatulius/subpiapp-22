
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataEntryForm from '../DataEntryForm';
import { mediaTypeSchema, MediaType } from '@/hooks/useMediaTypes';
import MediaTypeButton from './MediaTypeButton';
import { useMediaTypes } from '@/hooks/useMediaTypes';
import { Button } from '@/components/ui/button';
import { Search, Image } from 'lucide-react';
import IconSelector from '../IconSelector';

interface MediaTypeFormProps {
  onSubmit: (data: { descricao: string; icone?: string }) => Promise<void>;
  onCancel: () => void;
  defaultValue?: string;
  defaultIcon?: string;
  isSubmitting: boolean;
  submitText?: string;
}

const MediaTypeForm: React.FC<MediaTypeFormProps> = ({
  onSubmit,
  onCancel,
  defaultValue = '',
  defaultIcon = '',
  isSubmitting,
  submitText = 'Salvar'
}) => {
  const { mediaTypes } = useMediaTypes();
  const [selectedType, setSelectedType] = useState<string | null>(defaultValue);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(defaultIcon);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(defaultValue !== '' && !mediaTypes.some(type => type.descricao === defaultValue));
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Filter media types based on search term
  const filteredMediaTypes = mediaTypes.filter(type => 
    type.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTypeSelect = (descricao: string) => {
    setSelectedType(descricao);
    setShowCustomInput(false);
  };

  const handleCustomInput = () => {
    setShowCustomInput(true);
    setSelectedType('');
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setShowIconSelector(false);
  };

  const handleSubmit = (data: any) => {
    return onSubmit({
      ...data,
      icone: selectedIcon || undefined
    });
  };

  return (
    <DataEntryForm
      schema={mediaTypeSchema}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      defaultValues={{
        descricao: defaultValue,
      }}
      renderFields={(form) => (
        <div className="space-y-4">
          {showCustomInput ? (
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="descricao"
                placeholder="Nome do tipo de mídia"
                autoFocus
                className="rounded-lg"
                {...form.register('descricao')}
              />
              
              <div className="mt-4">
                <Label htmlFor="icon">Ícone</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-10 h-10 border rounded-md flex items-center justify-center bg-gray-50">
                    {selectedIcon ? (
                      <img src={selectedIcon} alt="Selected icon" className="w-6 h-6" />
                    ) : (
                      <Image className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowIconSelector(true)}
                  >
                    Selecionar ícone
                  </Button>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCustomInput(false)}
                className="mt-2 rounded-lg"
              >
                Voltar para seleção
              </Button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar tipos de mídia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4 max-h-[300px] overflow-y-auto">
                {filteredMediaTypes.map((type) => (
                  <MediaTypeButton
                    key={type.id}
                    mediaType={type}
                    isSelected={selectedType === type.descricao}
                    onClick={() => handleTypeSelect(type.descricao)}
                  />
                ))}
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCustomInput}
                className="mt-4 w-full rounded-lg"
              >
                Novo tipo de mídia
              </Button>
              
              {selectedType && (
                <Input
                  type="hidden"
                  {...form.register('descricao')}
                  value={selectedType}
                />
              )}
            </>
          )}
          
          {showIconSelector && (
            <IconSelector
              onSelect={handleIconSelect}
              onClose={() => setShowIconSelector(false)} 
            />
          )}
        </div>
      )}
      isSubmitting={isSubmitting}
      submitText={submitText}
    />
  );
};

export default MediaTypeForm;
