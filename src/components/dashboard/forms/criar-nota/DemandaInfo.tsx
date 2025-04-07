
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Demand, ResponseQA } from './types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface DemandaInfoProps {
  selectedDemanda: Demand;
  formattedResponses: ResponseQA[];
  handleBackToSelection?: () => void;
}

const DemandaInfo: React.FC<DemandaInfoProps> = ({
  selectedDemanda,
  formattedResponses,
  handleBackToSelection
}) => {
  const [comentarios, setComentarios] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch comments for the selected demand
    const fetchComentarios = async () => {
      if (selectedDemanda?.id) {
        try {
          const { data, error } = await supabase
            .from('respostas_demandas')
            .select('comentarios')
            .eq('demanda_id', selectedDemanda.id)
            .maybeSingle();
          
          if (error) throw error;
          setComentarios(data?.comentarios || null);
        } catch (error) {
          console.error('Erro ao buscar comentários:', error);
        }
      }
    };
    
    fetchComentarios();
  }, [selectedDemanda]);

  return (
    <div>
      {handleBackToSelection && (
        <Button
          variant="ghost"
          onClick={handleBackToSelection}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar para seleção
        </Button>
      )}
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">{selectedDemanda.titulo}</h3>
        
        <div className="text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">Área: </span>
            {selectedDemanda.supervisao_tecnica?.descricao || selectedDemanda.area_coordenacao?.descricao || 'Não informada'}
          </div>
          <div>
            <span className="font-medium">Prazo: </span>
            {selectedDemanda.prazo_resposta 
              ? format(new Date(selectedDemanda.prazo_resposta), 'dd/MM/yyyy', { locale: ptBR }) 
              : 'Não informado'}
          </div>
          <div>
            <span className="font-medium">Status: </span>
            {selectedDemanda.status}
          </div>
        </div>
        
        {/* Respostas */}
        {formattedResponses.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Respostas:</h4>
            <div className="space-y-4">
              {formattedResponses.map((qa, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <div className="font-medium">{qa.question}</div>
                  <div className="mt-1 text-gray-700">{qa.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Comentários */}
        {comentarios && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Comentários:</h4>
            <div className="bg-white p-3 rounded border">
              <div className="text-gray-700 whitespace-pre-wrap">{comentarios}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandaInfo;
