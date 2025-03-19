
import React from 'react';
import { Loader2, RefreshCw, Send } from 'lucide-react';
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
  demandaInfo?: any;
  perguntasRespostas?: any[];
  gerarSugestao?: () => Promise<void>;
  isGerandoSugestao?: boolean;
}

const CriarNotaForm: React.FC<CriarNotaFormProps> = ({
  titulo,
  setTitulo,
  texto,
  setTexto,
  onSubmit,
  isPending,
  notaExistente,
  gerarSugestao,
  isGerandoSugestao = false
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
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                  Título da Nota
                </label>
                {gerarSugestao && (
                  <Button
                    onClick={gerarSugestao}
                    variant="outline"
                    size="sm"
                    className="text-[#003570] border-[#003570] hover:bg-[#EEF2F8]"
                    disabled={isGerandoSugestao}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isGerandoSugestao ? 'animate-spin' : ''}`} />
                    {isGerandoSugestao ? "Gerando..." : "Regenerar Sugestão"}
                  </Button>
                )}
              </div>
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
