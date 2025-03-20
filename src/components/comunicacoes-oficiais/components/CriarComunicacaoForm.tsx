
import React from 'react';
import { Loader2, RefreshCw, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ComunicacaoOficial, Demand } from '../types';

interface CriarComunicacaoFormProps {
  titulo: string;
  setTitulo: (value: string) => void;
  texto: string;
  setTexto: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  comunicacaoExistente: ComunicacaoOficial | null;
  isCheckingComunicacao: boolean;
  demanda: Demand | null;
  gerarSugestao?: () => Promise<void>;
  isGerandoSugestao: boolean;
}

const CriarComunicacaoForm: React.FC<CriarComunicacaoFormProps> = ({
  titulo,
  setTitulo,
  texto,
  setTexto,
  onSubmit,
  isPending,
  comunicacaoExistente,
  isCheckingComunicacao,
  gerarSugestao,
  isGerandoSugestao
}) => {
  if (isCheckingComunicacao) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span>Verificando comunicação existente...</span>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Criar Comunicação Oficial</h3>
        
        {comunicacaoExistente ? (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-700">
              Já existe uma comunicação oficial criada para esta demanda com o status "{comunicacaoExistente.status}".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                  Título da Comunicação
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
                placeholder="Insira um título para a comunicação oficial"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
                Texto da Comunicação
              </label>
              <Textarea
                id="texto"
                placeholder="Escreva o conteúdo da comunicação oficial"
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
                    Salvar Comunicação Oficial
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

export default CriarComunicacaoForm;
