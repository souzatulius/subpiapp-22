
import React, { useState } from 'react';
import { Search, FileText, Clock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Demanda = {
  id: string;
  titulo: string;
  status: string;
  horario_publicacao: string;
  prazo_resposta: string;
  areas_coordenacao: {
    descricao: string;
  };
  autor: {
    nome_completo: string;
  };
};

interface DemandasListProps {
  demandas: Demanda[];
  onSelectDemanda: (demandaId: string) => void;
}

const DemandasList: React.FC<DemandasListProps> = ({ demandas, onSelectDemanda }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDemandas = demandas.filter(demanda => 
    demanda.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.areas_coordenacao?.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demanda.autor?.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (demandas.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Nenhuma demanda com resposta encontrada</h3>
        <p className="mt-1 text-gray-500">
          Demandas aparecerão aqui quando tiverem respostas cadastradas.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Buscar demandas por título, área ou autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDemandas.map((demanda) => (
          <Card 
            key={demanda.id} 
            className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            onClick={() => onSelectDemanda(demanda.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-medium text-gray-900 truncate">{demanda.titulo}</h3>
                  <p className="text-sm text-gray-500 truncate">{demanda.areas_coordenacao?.descricao}</p>
                  
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {format(new Date(demanda.horario_publicacao), 'dd MMM yyyy', { locale: ptBR })}
                    </span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      Prazo: {format(new Date(demanda.prazo_resposta), 'dd MMM yyyy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DemandasList;
