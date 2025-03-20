
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard,
  Droplet, 
  Trash2, 
  Trees, 
  AlertTriangle, 
  MessageSquare, 
  Briefcase, 
  Book, 
  Users, 
  Mail, 
  Heart, 
  Home, 
  Code, 
  Lightbulb
} from 'lucide-react';
import { ValidationError } from '@/lib/formValidationUtils';

interface IdentificationStepProps {
  formData: {
    titulo: string;
    area_coordenacao_id: string;
    servico_id: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleServiceSelect: (serviceId: string) => void;
  areasCoord: any[];
  filteredServicesBySearch: any[];
  serviceSearch: string;
  servicos: any[];
  errors?: ValidationError[];
}

const IdentificationStep: React.FC<IdentificationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  areasCoord,
  filteredServicesBySearch,
  serviceSearch,
  servicos,
  errors = []
}) => {
  // Function to get the appropriate icon based on area description
  const getAreaIcon = (descricao: string) => {
    const iconMap: {
      [key: string]: React.ReactNode;
    } = {
      "Manutenção Viária": <LayoutDashboard className="h-6 w-6" />, // Changed from Road to LayoutDashboard
      "Drenagem": <Droplet className="h-6 w-6" />,
      "Limpeza Pública": <Trash2 className="h-6 w-6" />,
      "Áreas Verdes": <Trees className="h-6 w-6" />, // Changed from Tree to Trees
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

  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  return (
    <div className="space-y-4">
      <div>
        <Label 
          htmlFor="titulo" 
          className={`block ${hasError('titulo') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Título da Demanda {hasError('titulo') && <span className="text-orange-500">*</span>}
        </Label>
        <Input 
          id="titulo" 
          name="titulo" 
          value={formData.titulo} 
          onChange={handleChange} 
          className={`${hasError('titulo') ? 'border-orange-500 ring-orange-500' : ''}`}
        />
        {hasError('titulo') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('titulo')}</p>
        )}
      </div>
      
      <div>
        <Label 
          className={`block mb-2 ${hasError('area_coordenacao_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Área de Coordenação {hasError('area_coordenacao_id') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {areasCoord.map(area => (
            <Button 
              key={area.id} 
              type="button" 
              variant={formData.area_coordenacao_id === area.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${
                formData.area_coordenacao_id === area.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('area_coordenacao_id') ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleSelectChange('area_coordenacao_id', area.id)}
            >
              {getAreaIcon(area.descricao)}
              <span className="text-sm font-semibold">{area.descricao}</span>
            </Button>
          ))}
        </div>
        {hasError('area_coordenacao_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('area_coordenacao_id')}</p>
        )}
      </div>
      
      {formData.area_coordenacao_id && (
        <div className="animate-fadeIn">
          <Label 
            htmlFor="servico_id" 
            className={`block ${hasError('servico_id') ? 'text-orange-500 font-semibold' : ''}`}
          >
            Serviço {hasError('servico_id') && <span className="text-orange-500">*</span>}
          </Label>
          <div className="relative">
            <Input 
              type="text" 
              name="serviceSearch" 
              value={serviceSearch} 
              onChange={handleChange} 
              className={`w-full rounded-lg ${hasError('servico_id') ? 'border-orange-500 ring-orange-500' : ''}`} 
              placeholder="Pesquisar serviço"
            />
            
            {serviceSearch && filteredServicesBySearch.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredServicesBySearch.map(service => (
                  <div 
                    key={service.id} 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    {service.descricao}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {formData.servico_id ? (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm">
              Serviço selecionado: {servicos.find(s => s.id === formData.servico_id)?.descricao}
            </div>
          ) : hasError('servico_id') && (
            <p className="text-orange-500 text-sm mt-1">{getErrorMessage('servico_id')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default IdentificationStep;
