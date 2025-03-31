
import React from 'react';
import { DemandaComDetalhes } from '../types';
import { Card } from '@/components/ui/card';
import DemandaDetailsSection from './DemandaDetailsSection';

interface DetalheDemandaProps {
  demanda: DemandaComDetalhes;
}

const DetalheDemanda: React.FC<DetalheDemandaProps> = ({ demanda }) => {
  if (!demanda) return null;

  return (
    <Card className="space-y-6 p-4 border border-gray-200 rounded-md bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Título</h3>
          <p className="bg-gray-50 p-4 rounded-md border">{demanda.titulo}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Prioridade</h3>
          <div className="bg-gray-50 p-4 rounded-md border">
            <span 
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                demanda.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                demanda.prioridade === 'media' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              }`}
            >
              {demanda.prioridade.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <DemandaDetailsSection detalhes={demanda.detalhes_solicitacao} />

      {demanda.perguntas && (
        <div>
          <h3 className="text-sm font-medium mb-2">Perguntas</h3>
          <div className="bg-gray-50 p-4 rounded-md border">
            <ul className="list-disc list-inside space-y-2">
              {Array.isArray(demanda.perguntas) ? (
                demanda.perguntas.map((pergunta, idx) => (
                  <li key={idx} className="text-sm">{pergunta}</li>
                ))
              ) : Object.entries(demanda.perguntas || {}).map(([key, value]) => (
                <li key={key} className="text-sm">{value}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {demanda.autor && (
        <div>
          <h3 className="text-sm font-medium mb-2">Solicitante</h3>
          <div className="bg-gray-50 p-4 rounded-md border">
            <p className="text-sm">{demanda.autor.nome_completo}</p>
            {demanda.nome_solicitante && <p className="text-sm mt-1">Nome: {demanda.nome_solicitante}</p>}
            {demanda.email_solicitante && <p className="text-sm mt-1">Email: {demanda.email_solicitante}</p>}
            {demanda.telefone_solicitante && <p className="text-sm mt-1">Telefone: {demanda.telefone_solicitante}</p>}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DetalheDemanda;
