
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Calendar, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Demanda, Resposta, PerguntaResposta } from '../types';

interface DemandaInfoCardProps {
  demanda: Demanda;
  perguntasRespostas?: PerguntaResposta[];
  respostas?: Resposta[];
}

const DemandaInfoCard: React.FC<DemandaInfoCardProps> = ({ 
  demanda, 
  perguntasRespostas = [], 
  respostas = [] 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Autor</p>
              <p>{demanda.autor?.nome_completo || 'Não especificado'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Criação</p>
              <p>{format(new Date(demanda.horario_publicacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Prazo</p>
              <p>{format(new Date(demanda.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR })}</p>
            </div>
          </div>
          
          {demanda.arquivo_url && (
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Arquivo</p>
                <a 
                  href={demanda.arquivo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Visualizar arquivo
                </a>
              </div>
            </div>
          )}
        </div>
        
        {demanda.detalhes_solicitacao && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Detalhes da Solicitação</h3>
            <p className="whitespace-pre-line text-gray-700">{demanda.detalhes_solicitacao}</p>
          </div>
        )}
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Perguntas e Respostas</h3>
          
          {perguntasRespostas.length > 0 ? (
            <div className="space-y-4">
              {perguntasRespostas.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">{item.pergunta}</h4>
                  <Separator className="my-2" />
                  <p className="text-gray-700">{item.resposta}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Não há perguntas cadastradas para esta demanda.</p>
          )}
        </div>
        
        {respostas && respostas.length > 0 && respostas[0].usuario && (
          <div className="mt-4 text-sm text-gray-500 flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span>Respondido por: {respostas[0].usuario.nome_completo}</span>
            <span className="mx-2">•</span>
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {format(new Date(respostas[0].criado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DemandaInfoCard;
