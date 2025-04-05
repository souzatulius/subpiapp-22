
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuickDemandFormProps {
  title?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}

export const QuickDemandForm: React.FC<QuickDemandFormProps> = ({
  title = '',
  onChange,
  onSubmit
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-between">
      <div className="flex-grow flex items-center">
        <Input
          placeholder="Digite o título da nova demanda"
          value={title}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mt-2">
        <Button type="submit" size="sm" className="w-full" variant="default">
          Criar Demanda Rápida
        </Button>
      </div>
    </form>
  );
};
