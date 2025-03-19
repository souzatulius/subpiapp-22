
import React from 'react';
import { Loader2, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { NotaExistente } from '../types';

interface CriarNotaFormProps {
  titulo: string;
  setTitulo: (value: string) => void;
  texto: string;
  setTexto: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  notaExistente: NotaExistente | null;
}

const CriarNotaForm: React.FC<CriarNotaFormProps> = ({
  titulo,
  setTitulo,
  texto,
  setTexto,
  onSubmit,
  isPending,
  notaExistente
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Criar Nota Oficial</h3>
        
        {notaExistente ? (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-700">
              Já existe uma nota oficial criada para esta demanda com o status "{notaExistente.status}".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                Título da Nota
              </label>
              <Input
                id="titulo"
                placeholder="Insira um título para a nota oficial"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
                Texto da Nota
              </label>
              <Textarea
                id="texto"
                placeholder="Escreva o conteúdo da nota oficial"
                rows={8}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={onSubmit}
                disabled={isPending}
                className="bg-[#003570] hover:bg-[#002855]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Salvar Nota Oficial
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CriarNotaForm;
