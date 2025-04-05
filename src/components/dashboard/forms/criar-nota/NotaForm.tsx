
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Demand, ResponseQA } from '@/components/dashboard/forms/criar-nota/types';

interface NotaFormProps {
  titulo: string;
  setTitulo: (value: string) => void;
  texto: string;
  setTexto: (value: string) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  selectedDemanda: Demand | null;
  formattedResponses: ResponseQA[];
}

const NotaForm: React.FC<NotaFormProps> = ({
  titulo,
  setTitulo,
  texto,
  setTexto,
  handleSubmit,
  isSubmitting,
  selectedDemanda,
  formattedResponses
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título da Nota</Label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full rounded-md"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="texto">Conteúdo da Nota</Label>
        <Textarea
          id="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={10}
          className="w-full resize-y min-h-[200px] rounded-md"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Criar Nota Oficial'}
        </Button>
      </div>
    </form>
  );
};

export default NotaForm;
