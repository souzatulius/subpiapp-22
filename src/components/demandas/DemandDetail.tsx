
import React from 'react';
import { Demand } from '@/types/demand';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, FilePlus } from 'lucide-react';

interface DemandDetailProps {
  demand: Demand | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateNote?: (demandId: string) => void;
  onViewNote?: (notaId: string) => void;
}

const DemandDetail: React.FC<DemandDetailProps> = ({ 
  demand, 
  isOpen, 
  onClose,
  onCreateNote,
  onViewNote
}) => {
  if (!demand) return null;

  const hasNota = demand.notas && demand.notas.length > 0;
  const firstNota = hasNota ? demand.notas[0] : null;
  const canCreateNote = demand.status === 'respondida' || demand.status === 'em_andamento';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{demand.titulo}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-100">
              Status: {demand.status}
            </Badge>
            <Badge variant="outline" className="bg-gray-100">
              Prioridade: {demand.prioridade}
            </Badge>
            {demand.prazo_resposta && (
              <Badge variant="outline" className="bg-gray-100">
                Prazo: {format(new Date(demand.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR })}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demand.area_coordenacao && (
              <div>
                <h3 className="font-medium text-gray-700">Coordenação:</h3>
                <p>{demand.area_coordenacao.descricao}</p>
              </div>
            )}
            
            {demand.autor && (
              <div>
                <h3 className="font-medium text-gray-700">Autor:</h3>
                <p>{demand.autor.nome_completo}</p>
              </div>
            )}
            
            {demand.origem && (
              <div>
                <h3 className="font-medium text-gray-700">Origem:</h3>
                <p>{demand.origem.descricao}</p>
              </div>
            )}
            
            {demand.tipo_midia && (
              <div>
                <h3 className="font-medium text-gray-700">Tipo de Mídia:</h3>
                <p>{demand.tipo_midia.descricao}</p>
              </div>
            )}
            
            {demand.bairro && (
              <div>
                <h3 className="font-medium text-gray-700">Bairro:</h3>
                <p>{demand.bairro.nome}</p>
              </div>
            )}
            
            {demand.endereco && (
              <div>
                <h3 className="font-medium text-gray-700">Endereço:</h3>
                <p>{demand.endereco}</p>
              </div>
            )}
          </div>
          
          {demand.detalhes_solicitacao && (
            <div>
              <h3 className="font-medium text-gray-700">Detalhes:</h3>
              <p className="whitespace-pre-wrap">{demand.detalhes_solicitacao}</p>
            </div>
          )}
          
          {demand.perguntas && Object.keys(demand.perguntas).length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700">Perguntas:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(demand.perguntas).map(([key, pergunta], index) => (
                  <li key={index}>{pergunta as string}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Note section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Nota Oficial:</h3>
            
            {hasNota ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <FileText className="h-3 w-3 mr-1" /> Nota criada
                </Badge>
                
                {onViewNote && firstNota && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewNote(firstNota.id)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <FileText className="h-4 w-4 mr-1" /> Ver Nota
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Nenhuma nota criada</span>
                
                {canCreateNote && onCreateNote && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onCreateNote(demand.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <FilePlus className="h-4 w-4 mr-1" /> Criar Nota
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemandDetail;
