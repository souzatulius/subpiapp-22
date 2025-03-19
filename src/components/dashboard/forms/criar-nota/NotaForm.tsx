
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotaFormProps {
  titulo: string;
  setTitulo: (titulo: string) => void;
  texto: string;
  setTexto: (texto: string) => void;
  handleBackToSelection: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const NotaForm: React.FC<NotaFormProps> = ({
  titulo,
  setTitulo,
  texto,
  setTexto,
  handleBackToSelection,
  handleSubmit,
  isSubmitting
}) => {
  return (
    <>
      <Button 
        variant="ghost" 
        onClick={handleBackToSelection}
        className="mb-2 -ml-2 text-gray-600"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar para seleção
      </Button>
      
      <div className="mt-6">
        <Label htmlFor="titulo">Título da Nota Oficial</Label>
        <Input 
          id="titulo" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          placeholder="Informe um título claro e objetivo"
        />
      </div>
      
      <div className="mt-4">
        <Label htmlFor="texto">Texto da Nota Oficial</Label>
        <Textarea 
          id="texto" 
          value={texto} 
          onChange={(e) => setTexto(e.target.value)} 
          placeholder="Digite o conteúdo da nota oficial..."
          rows={10}
        />
      </div>
      
      <div className="flex justify-end pt-4 mt-4">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#003570] hover:bg-[#002855]"
        >
          {isSubmitting ? "Enviando..." : "Enviar para Aprovação"}
        </Button>
      </div>
    </>
  );
};

export default NotaForm;
