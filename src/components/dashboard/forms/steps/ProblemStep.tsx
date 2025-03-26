
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ValidationError } from '@/lib/formValidationUtils';
import { 
  AlertTriangle, 
  Map, 
  MapPin, 
  Trash2, 
  Droplets, 
  Building2, 
  Trees, 
  Lightbulb, 
  HardHat, 
  Shield 
} from 'lucide-react';

interface ProblemStepProps {
  formData: {
    problema_id: string;
    servico_id: string;
    nao_sabe_servico?: boolean;
  };
  problemas: any[];
  servicos: any[];
  filteredServicos: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  handleServiceSearch?: (value: string) => void;
  errors?: ValidationError[];
}

const ProblemStep: React.FC<ProblemStepProps> = ({
  formData,
  problemas,
  servicos,
  filteredServicos,
  handleChange,
  handleSelectChange,
  handleServiceSearch,
  errors = []
}) => {
  const hasError = (field: string) => errors.some(err => err.field === field);
  const getErrorMessage = (field: string) => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : '';
  };

  // Get problem icon based on description
  const getProblemIcon = (problema: any) => {
    const iconMap: Record<string, React.ReactNode> = {
      "Buraco": <HardHat className="h-8 w-8" />,
      "Iluminação": <Lightbulb className="h-8 w-8" />,
      "Árvore": <Trees className="h-8 w-8" />,
      "Esgoto": <Droplets className="h-8 w-8" />,
      "Calçada": <Building2 className="h-8 w-8" />,
      "Lixo": <Trash2 className="h-8 w-8" />,
      "Sinalização": <MapPin className="h-8 w-8" />,
      "Segurança": <Shield className="h-8 w-8" />,
      "Outros": <AlertTriangle className="h-8 w-8" />
    };
    
    // Default icon or from database
    if (problema.icone) {
      // Here we could return a custom icon if it's stored in the database
      return <img src={problema.icone} alt={problema.descricao} className="h-8 w-8" />;
    }
    
    // Try to match by keywords in the description
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (problema.descricao.toLowerCase().includes(keyword.toLowerCase())) {
        return icon;
      }
    }
    
    return <Map className="h-8 w-8" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <Label 
          htmlFor="problema_id" 
          className={`block mb-2 ${hasError('problema_id') ? 'text-orange-500 font-semibold' : ''}`}
        >
          Tema/Problema {hasError('problema_id') && <span className="text-orange-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {problemas.map(problema => (
            <Button 
              key={problema.id} 
              type="button" 
              variant={formData.problema_id === problema.id ? "default" : "outline"} 
              className={`h-auto py-3 px-2 flex flex-col items-center justify-center gap-2 ${
                formData.problema_id === problema.id ? "ring-2 ring-[#003570]" : ""
              } ${
                hasError('problema_id') ? 'border-orange-500' : ''
              }`} 
              onClick={() => handleSelectChange('problema_id', problema.id)}
            >
              {getProblemIcon(problema)}
              <span className="text-sm font-semibold text-center">{problema.descricao}</span>
            </Button>
          ))}
        </div>
        {hasError('problema_id') && (
          <p className="text-orange-500 text-sm mt-1">{getErrorMessage('problema_id')}</p>
        )}
      </div>
      
      {formData.problema_id && (
        <div className="animate-fadeIn space-y-4">
          <div>
            <Label htmlFor="serviceSearch" className="block mb-2">
              Pesquisar Serviço
            </Label>
            <Input 
              id="serviceSearch" 
              name="serviceSearch" 
              placeholder="Digite o nome do serviço..." 
              onChange={(e) => handleServiceSearch && handleServiceSearch(e.target.value)} 
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="nao-sabe-servico" 
              checked={formData.nao_sabe_servico} 
              onCheckedChange={(checked) => handleSelectChange('nao_sabe_servico', Boolean(checked))}
            />
            <Label htmlFor="nao-sabe-servico" className="text-sm cursor-pointer">
              Não sei qual serviço selecionar
            </Label>
          </div>
          
          {!formData.nao_sabe_servico && (
            <div>
              <Label 
                htmlFor="servico_id" 
                className={`block mb-2 ${hasError('servico_id') ? 'text-orange-500 font-semibold' : ''}`}
              >
                Serviço {hasError('servico_id') && <span className="text-orange-500">*</span>}
              </Label>
              <div className="space-y-2">
                {filteredServicos.length > 0 ? (
                  filteredServicos.map(servico => (
                    <Button 
                      key={servico.id} 
                      type="button" 
                      variant={formData.servico_id === servico.id ? "default" : "outline"} 
                      className={`w-full justify-start py-3 px-4 ${
                        formData.servico_id === servico.id ? "ring-2 ring-[#003570]" : ""
                      } ${
                        hasError('servico_id') ? 'border-orange-500' : ''
                      }`} 
                      onClick={() => handleSelectChange('servico_id', servico.id)}
                    >
                      <span>{servico.descricao}</span>
                    </Button>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    {servicos.length === 0 
                      ? "Não há serviços disponíveis para o tema selecionado." 
                      : "Nenhum serviço encontrado para sua pesquisa."}
                  </div>
                )}
              </div>
              {hasError('servico_id') && (
                <p className="text-orange-500 text-sm mt-1">{getErrorMessage('servico_id')}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemStep;
