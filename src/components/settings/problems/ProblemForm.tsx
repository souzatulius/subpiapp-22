
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SupervisaoTecnica } from '@/types/common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Image } from 'lucide-react';
import IconSelector from '../IconSelector';

interface ProblemFormProps {
  onSubmit: (data: { descricao: string; supervisao_tecnica_id: string; icone?: string }) => Promise<void>;
  onCancel: () => void;
  areas: SupervisaoTecnica[];
  isSubmitting: boolean;
}

const ProblemForm: React.FC<ProblemFormProps> = ({ onSubmit, onCancel, areas, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      descricao: '',
      supervisao_tecnica_id: ''
    }
  });
  
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const selectedArea = watch('supervisao_tecnica_id');

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
        <Label htmlFor="supervisao_tecnica_id">Supervisão Técnica</Label>
        <Select
          onValueChange={(value) => setValue('supervisao_tecnica_id', value)}
          value={selectedArea}
        >
          <SelectTrigger id="supervisao_tecnica_id" className={errors.supervisao_tecnica_id ? 'border-red-500' : ''}>
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
        {errors.supervisao_tecnica_id && (
          <p className="text-sm text-red-500">{errors.supervisao_tecnica_id.message}</p>
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
