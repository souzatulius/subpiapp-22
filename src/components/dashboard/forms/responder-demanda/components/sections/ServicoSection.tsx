
import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Search, X, Tag } from 'lucide-react';
import ServicoSelector from '../../ServicoSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServices } from '@/hooks/useServices';
import { supabase } from '@/integrations/supabase/client';

interface ServicoSectionProps {
  selectedDemanda: any;
  onServiceChange?: (serviceId: string) => void;
}

const ServicoSection: React.FC<ServicoSectionProps> = ({
  selectedDemanda,
  onServiceChange
}) => {
  const [isEditing, setIsEditing] = useState(!selectedDemanda?.servico?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch services based on the tema/problema of the demand
  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedDemanda?.problema_id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('servicos')
          .select('*')
          .eq('problema_id', selectedDemanda.problema_id)
          .order('descricao', { ascending: true });
        
        if (error) throw error;
        setServices(data || []);
        setFilteredServices(data || []);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedDemanda?.problema_id]);

  // Filter services based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredServices(services);
      return;
    }
    
    const filtered = services.filter(service => 
      service.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const handleRemoveService = () => {
    setIsEditing(true);
  };

  const handleServiceSelect = (serviceId: string) => {
    if (onServiceChange) {
      onServiceChange(serviceId);
    }
    setIsEditing(false);
    setSearchTerm('');
  };

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
        
        <div className="space-y-1">
          <span className="text-sm text-gray-500">Serviço:</span>
          {!isEditing && selectedDemanda.servico ? (
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                <span>{selectedDemanda.servico.descricao}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 rounded-full"
                  onClick={handleRemoveService}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar serviço..."
                  className="pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
              </div>
              
              {searchTerm.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredServices.length > 0 ? (
                    filteredServices.map(service => (
                      <Button
                        key={service.id}
                        variant="ghost"
                        className="w-full justify-start text-left px-3 py-2 text-sm hover:bg-blue-50"
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        {service.descricao}
                      </Button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">Nenhum serviço encontrado</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {selectedDemanda.bairros && (
          <div className="space-y-1">
            <span className="text-sm text-gray-500">Bairro:</span>
            <p className="font-medium text-gray-900">
              {selectedDemanda.bairros.nome || 'Não informado'}
            </p>
          </div>
        )}
        
        {selectedDemanda.distrito && (
          <div className="space-y-1">
            <span className="text-sm text-gray-500">Distrito:</span>
            <p className="font-medium text-gray-900">
              {selectedDemanda.distrito.nome || 'Não informado'}
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
