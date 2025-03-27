
import React from 'react';
import { FileText } from 'lucide-react';

interface ServicoSectionProps {
  selectedDemanda: any;
}

const ServicoSection: React.FC<ServicoSectionProps> = ({ selectedDemanda }) => {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <h3 className="font-semibold text-subpi-blue flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5" /> 
        Serviço
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedDemanda.tema && (
          <div className="space-y-1">
            <span className="text-sm text-gray-500">Tema:</span>
            <p className="font-medium text-gray-900">
              {selectedDemanda.tema.descricao || 'Não definido'}
            </p>
          </div>
        )}
        
        {selectedDemanda.servico && (
          <div className="space-y-1">
            <span className="text-sm text-gray-500">Serviço:</span>
            <p className="font-medium text-gray-900">
              {selectedDemanda.servico.descricao || 'Não definido'}
            </p>
          </div>
        )}
        
        {selectedDemanda.bairro && (
          <div className="space-y-1">
            <span className="text-sm text-gray-500">Bairro:</span>
            <p className="font-medium text-gray-900">
              {selectedDemanda.bairro.nome || 'Não informado'}
            </p>
          </div>
        )}
        
        {selectedDemanda.distrito && (
          <div className="space-y-1">
            <span className="text-sm text-gray-500">Distrito:</span>
            <p className="font-medium text-gray-900">
              {selectedDemanda.distrito?.nome || 'Não informado'}
            </p>
          </div>
        )}
        
        {selectedDemanda.protocolo && (
          <div className="space-y-1">
            <span className="text-sm text-gray-500">Protocolo:</span>
            <p className="font-medium text-gray-900">
              {selectedDemanda.protocolo || 'Não informado'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicoSection;
