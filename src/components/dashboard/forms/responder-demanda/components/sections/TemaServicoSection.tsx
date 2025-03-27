
import React from 'react';
import { Card } from '@/components/ui/card';
import ServicoSelector from '../ServicoSelector';

interface TemaServicoSectionProps {
  currentProblem: any;
  selectedDemanda: any;
  selectedServicoId: string;
  dontKnowService: boolean;
  servicos: any[];
  servicosLoading: boolean;
  onServicoChange: (id: string) => void;
  onServiceToggle: () => void;
}

const TemaServicoSection: React.FC<TemaServicoSectionProps> = ({
  currentProblem,
  selectedDemanda,
  selectedServicoId,
  dontKnowService,
  servicos,
  servicosLoading,
  onServicoChange,
  onServiceToggle
}) => {
  return (
    <div className="py-6 border-b">
      <h3 className="text-lg font-semibold text-subpi-blue mb-4">Tema e Serviço</h3>
      
      <Card className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tema:</h4>
            <div className="p-3 border rounded-md bg-white">
              {currentProblem ? (
                <span className="font-medium">{currentProblem.descricao}</span>
              ) : (
                <span className="text-gray-500">Tema não definido</span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Serviço:</h4>
            {selectedDemanda.servico?.descricao ? (
              <div className="p-3 border rounded-md bg-white">
                <span className="font-medium">{selectedDemanda.servico.descricao}</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="dontKnowService"
                      checked={dontKnowService}
                      onChange={onServiceToggle}
                      className="rounded border-gray-300 text-subpi-blue focus:ring-subpi-blue"
                    />
                    <label htmlFor="dontKnowService" className="text-sm text-gray-700">
                      Não sei informar o serviço
                    </label>
                  </div>
                </div>
                
                {!dontKnowService && (
                  <ServicoSelector
                    selectedServicoId={selectedServicoId}
                    servicos={servicos}
                    servicosLoading={servicosLoading}
                    onServicoChange={onServicoChange}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TemaServicoSection;
