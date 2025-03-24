
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Droplet, Trash2, Trees, AlertTriangle, MessageSquare, Briefcase, Book, Heart, Home, Code, Lightbulb, Users, Mail, X, ChevronDown, Search } from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

interface IdentificationStepProps {
  formData: {
    titulo: string;
    problema_id: string;
    servico_id: string;
    detalhes_solicitacao: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleServiceSelect: (serviceId: string) => void;
  problemas: any[];
  filteredServicesBySearch: any[];
  serviceSearch: string;
  servicos: any[];
  errors?: ValidationError[];
  showTitleField?: boolean;
}

const IdentificationStep: React.FC<IdentificationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  problemas,
  filteredServicesBySearch,
  serviceSearch,
  servicos,
  errors = [],
  showTitleField = false
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showDetailsField, setShowDetailsField] = useState(false);

  // Show details field when service is selected
  useEffect(() => {
    if (formData.servico_id) {
      setShowDetailsField(true);
    }
  }, [formData.servico_id]);

  // Function to get the appropriate icon based on problema description
  const getProblemaIcon = (descricao: string) => {
    const iconMap: {
      [key: string]: React.ReactNode;
    } = {
      "Manutenção Viária": <LayoutDashboard className="h-6 w-6" />,
      "Drenagem": <Droplet className="h-6 w-6" />,
      "Limpeza Pública": <Trash2 className="h-6 w-6" />,
      "Áreas Verdes": <Trees className="h-6 w-6" />,
      "Fiscalização": <AlertTriangle className="h-6 w-6" />,
      "Comunicação": <MessageSquare className="h-6 w-6" />,
      "Administrativa": <Briefcase className="h-6 w-6" />,
      "Educação": <Book className="h-6 w-6" />,
      "Saúde": <Heart className="h-6 w-6" />,
      "Habitação": <Home className="h-6 w-6" />,
      "Tecnologia": <Code className="h-6 w-6" />,
      "Inovação": <Lightbulb className="h-6 w-6" />,
      "Social": <Users className="h-6 w-6" />
    };
    return iconMap[descricao] || <LayoutDashboard className="h-6 w-6" />;
  };

  const handleServiceRemove = () => {
    handleSelectChange('servico_id', '');
    setShowDetailsField(false);
  };

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const selectedService = servicos.find(s => s.id === formData.servico_id);

  return <div className="space-y-4">
      <div>
        <Label className={`block mb-2 ${hasError('problema_id') ? 'text-orange-500 font-semibold' : ''}`}>
          Problema {hasError('problema_id') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="flex flex-wrap gap-3">
          {problemas.map(problema => (
            <Button 
              key={problema.id} 
              type="button" 
              variant={formData.problema_id === problema.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
                formData.problema_id === problema.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('problema_id') ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleSelectChange('problema_id', problema.id)}
            >
              {getProblemaIcon(problema.descricao)}
              <span className="text-sm font-semibold">{problema.descricao}</span>
            </Button>
          ))}
        </div>
        {hasError('problema_id') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('problema_id')}</p>}
      </div>
      
      {formData.problema_id && (
        <div className="animate-fadeIn">
          <Label htmlFor="servico_id" className={`block mb-2 ${hasError('servico_id') ? 'text-orange-500 font-semibold' : ''}`}>
            Serviço {hasError('servico_id') && <span className="text-orange-500">*</span>}
          </Label>
          
          {formData.servico_id ? (
            <div className="flex items-center">
              <Badge className="px-3 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center">
                {selectedService?.descricao}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-2 text-blue-700 hover:text-blue-900 hover:bg-transparent"
                  onClick={handleServiceRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          ) : (
            <div className="relative">
              {/* Campo de busca de serviço - estilo similar ao SmartSearchCard */}
              <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm flex items-center transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-subpi-blue focus-within:ring-offset-1">
                <Search className="h-5 w-5 text-gray-400 ml-4 mr-2 flex-shrink-0" />
                <Input 
                  type="text" 
                  name="serviceSearch" 
                  value={serviceSearch} 
                  onChange={handleChange} 
                  className={`flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ${hasError('servico_id') ? 'placeholder-orange-300' : ''}`} 
                  placeholder="Pesquisar serviço" 
                />
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-full px-4 border-l border-gray-200"
                    >
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[calc(100%-2rem)] p-0 max-w-none bg-white rounded-xl shadow-lg border border-gray-200" align="center">
                    <div className="max-h-60 overflow-y-auto">
                      {filteredServicesBySearch.length > 0 ? (
                        filteredServicesBySearch.map(service => (
                          <Button 
                            key={service.id} 
                            variant="ghost" 
                            className="w-full justify-start px-4 py-3 text-left hover:bg-blue-50 rounded-none"
                            onClick={() => {
                              handleServiceSelect(service.id);
                              setIsPopoverOpen(false);
                            }}
                          >
                            {service.descricao}
                          </Button>
                        ))
                      ) : (
                        <p className="p-4 text-sm text-gray-500">Nenhum serviço encontrado</p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              {serviceSearch && filteredServicesBySearch.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {filteredServicesBySearch.map(service => (
                    <div 
                      key={service.id} 
                      onClick={() => handleServiceSelect(service.id)} 
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 text-base text-subpi-gray-text transition-colors"
                    >
                      {service.descricao}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {hasError('servico_id') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('servico_id')}</p>}
        </div>
      )}

      {showDetailsField && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="detalhes_solicitacao" 
            className={`block mb-2 ${hasError('detalhes_solicitacao') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Detalhes da Solicitação {hasError('detalhes_solicitacao') && <span className="text-orange-500">*</span>}
          </Label>
          <Textarea
            id="detalhes_solicitacao"
            name="detalhes_solicitacao"
            value={formData.detalhes_solicitacao}
            onChange={handleChange}
            rows={5}
            className={hasError('detalhes_solicitacao') ? 'border-orange-500' : ''}
            placeholder="Descreva os detalhes da solicitação..."
          />
          {hasError('detalhes_solicitacao') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('detalhes_solicitacao')}</p>
          )}
        </div>
      )}
    </div>;
};

export default IdentificationStep;
