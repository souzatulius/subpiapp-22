
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Briefcase, Book, Users, Mail, Heart, Home, Code, Lightbulb, LayoutDashboard, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    return iconMap[descricao] || <LayoutDashboard className="h-15 w-15 px-15" />;
  };

  // Function to handle removing the selected service
  const handleRemoveService = () => {
    handleSelectChange('servico_id', '');
  };

  const selectedService = formData.servico_id ? servicos.find(s => s.id === formData.servico_id) : null;

  return <div className="space-y-4">
      <div>
        <Label htmlFor="titulo" className="font-bold">Título da Dmanda</Label>
        <Input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} className="rounded-2xl" />
      </div>
      
      <div>
        <Label className="block mb-2">Área de Coordenação</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {areasCoord.map(area => <Button key={area.id} type="button" variant={formData.area_coordenacao_id === area.id ? "default" : "outline"} onClick={() => handleSelectChange('area_coordenacao_id', area.id)} className="px-0 text-center py-[23px] my-[10px] text-gray-800 bg-stone-300 hover:bg-stone-200 rounded-2xl">
              {getAreaIcon(area.descricao)}
              <span className="text-xl font-bold">{area.descricao}</span>
            </Button>)}
        </div>
      </div>
      
      {formData.area_coordenacao_id && <div className="animate-fadeIn">
          <Label htmlFor="servico_id">Serviço</Label>
          
          {!formData.servico_id ? (
            <div className="relative">
              <Input type="text" name="serviceSearch" value={serviceSearch} onChange={handleChange} className="w-full rounded-lg" />
              
              {serviceSearch && filteredServicesBySearch.length > 0 && <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredServicesBySearch.map(service => <div key={service.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleServiceSelect(service.id)}>
                      {service.descricao}
                    </div>)}
                </div>}
            </div>
          ) : (
            <div className="mt-2">
              <Badge 
                variant="outline" 
                className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-50 flex items-center gap-2 max-w-fit"
              >
                {selectedService?.descricao}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 rounded-full p-0 hover:bg-blue-100"
                  onClick={handleRemoveService}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          )}
        </div>}
    </div>;
};

export default IdentificationStep;
