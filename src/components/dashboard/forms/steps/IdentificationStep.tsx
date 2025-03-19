
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Briefcase, Book, Users, Mail, Heart, Home, Code, Lightbulb, LayoutDashboard } from 'lucide-react';

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
}

const IdentificationStep: React.FC<IdentificationStepProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  handleServiceSelect,
  areasCoord,
  filteredServicesBySearch,
  serviceSearch,
  servicos
}) => {
  // Function to get the appropriate icon based on area description
  const getAreaIcon = (descricao: string) => {
    const iconMap: {
      [key: string]: React.ReactNode;
    } = {
      "Administrativa": <Briefcase className="h-6 w-6" />,
      "Educação": <Book className="h-6 w-6" />,
      "Saúde": <Heart className="h-6 w-6" />,
      "Comunicação": <Mail className="h-6 w-6" />,
      "Habitação": <Home className="h-6 w-6" />,
      "Tecnologia": <Code className="h-6 w-6" />,
      "Inovação": <Lightbulb className="h-6 w-6" />,
      "Social": <Users className="h-6 w-6" />
    };
    return iconMap[descricao] || <LayoutDashboard className="h-6 w-6" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="titulo">Título da Demanda</Label>
        <Input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} />
      </div>
      
      <div>
        <Label className="block mb-2">Área de Coordenação</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {areasCoord.map(area => (
            <Button 
              key={area.id} 
              type="button" 
              variant={formData.area_coordenacao_id === area.id ? "default" : "outline"} 
              className={`h-auto py-3 flex flex-col items-center justify-center gap-2 ${formData.area_coordenacao_id === area.id ? "ring-2 ring-[#003570]" : ""}`} 
              onClick={() => handleSelectChange('area_coordenacao_id', area.id)}
            >
              {getAreaIcon(area.descricao)}
              <span className="text-sm font-semibold">{area.descricao}</span>
            </Button>
          ))}
        </div>
      </div>
      
      {formData.area_coordenacao_id && (
        <div className="animate-fadeIn">
          <Label htmlFor="servico_id">Serviço</Label>
          <div className="relative">
            <Input 
              type="text" 
              name="serviceSearch" 
              value={serviceSearch} 
              onChange={handleChange} 
              className="w-full rounded-lg" 
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
          
          {formData.servico_id && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm">
              Serviço selecionado: {servicos.find(s => s.id === formData.servico_id)?.descricao}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IdentificationStep;
