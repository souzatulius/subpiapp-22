
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Image } from 'lucide-react';
import IconSelector from '../IconSelector';
import { Area } from '@/hooks/coordination-areas/types';

interface ProblemFormProps {
  onSubmit: (data: { descricao: string; coordenacao_id: string; icone?: string }) => Promise<void>;
  onCancel: () => void;
  areas: Area[];
  isSubmitting: boolean;
}

const ProblemForm: React.FC<ProblemFormProps> = ({ onSubmit, onCancel, areas, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      descricao: '',
      coordenacao_id: ''
    }
  });
  
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const selectedArea = watch('coordenacao_id');

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      icone: selectedIcon
    });
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setShowIconSelector(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          id="descricao"
          placeholder="Digite a descrição do problema"
          {...register('descricao', { required: 'Descrição é obrigatória' })}
          className={errors.descricao ? 'border-red-500' : ''}
        />
        {errors.descricao && (
          <p className="text-sm text-red-500">{errors.descricao.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coordenacao_id">Coordenação</Label>
        <Select
          onValueChange={(value) => setValue('coordenacao_id', value)}
          value={selectedArea}
        >
          <SelectTrigger id="coordenacao_id" className={errors.coordenacao_id ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione uma coordenação" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.coordenacao_id && (
          <p className="text-sm text-red-500">{errors.coordenacao_id.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="icon">Ícone</Label>
        <div className="flex items-center gap-2">
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
            {selectedIcon ? 'Alterar ícone' : 'Selecionar ícone'}
          </Button>
          {selectedIcon && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setSelectedIcon(null)}
              className="text-red-500"
            >
              Remover
            </Button>
          )}
        </div>
      </div>

      {showIconSelector && (
        <IconSelector
          onSelect={handleIconSelect}
          onClose={() => setShowIconSelector(false)} 
        />
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};

export default ProblemForm;
