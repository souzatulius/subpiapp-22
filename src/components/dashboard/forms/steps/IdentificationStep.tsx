
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Droplet, Trash2, Trees, AlertTriangle, MessageSquare, 
  Briefcase, Book, Users, Mail, Heart, Home, Code, Lightbulb, X, ChevronDown, Search 
} from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface IdentificationStepProps {
  formData: {
    titulo: string;
    problema_id: string;
    servico_id: string;
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
  showTitleField = true
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Function to get the appropriate icon based on area description
  const getAreaIcon = (descricao: string) => {
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
  };

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  const selectedService = servicos.find(s => s.id === formData.servico_id);
  const selectedTema = problemas.find(p => p.id === formData.problema_id);

  return (
    <div className="space-y-4">
      {showTitleField && (
        <div>
          <Label htmlFor="titulo" className={`block ${hasError('titulo') ? 'text-orange-500 font-semibold' : ''}`}>
            Título da Demanda {hasError('titulo') && <span className="text-orange-500">*</span>}
          </Label>
          {/* Título da Demanda - estilo similar ao SmartSearchCard */}
          <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm flex items-center px-4 transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-subpi-blue focus-within:ring-offset-1">
            <Input 
              id="titulo" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              className={`border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ${hasError('titulo') ? 'placeholder-orange-300' : ''}`} 
              placeholder="Digite o título da demanda..."
            />
          </div>
          {hasError('titulo') && <p className="text-orange-500 text-sm mt-1">{getErrorMessage('titulo')}</p>}
        </div>
      )}
      
      <div>
        <Label className={`block mb-2 ${hasError('problema_id') ? 'text-orange-500 font-semibold' : ''}`}>
          Tema {hasError('problema_id') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="flex flex-wrap gap-3">
          {problemas.map(tema => (
            <Button 
              key={tema.id} 
              type="button" 
              variant={formData.problema_id === tema.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
                formData.problema_id === tema.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('problema_id') ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleSelectChange('problema_id', tema.id)}
            >
              {tema.areas_coordenacao && getAreaIcon(tema.areas_coordenacao.descricao)}
              <span className="text-sm font-semibold">{tema.descricao}</span>
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
    </div>
  );
};

export default IdentificationStep;
