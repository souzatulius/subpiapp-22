
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/types/demand';

interface ValidateNotaFormParams {
  titulo: string;
  texto: string;
  selectedDemanda: Demand | null;
}

/**
 * Validates the nota form fields
 */
export const validateNotaForm = ({
  titulo,
  texto,
  selectedDemanda
}: ValidateNotaFormParams): boolean => {
  // Validação
  if (!titulo.trim()) {
    toast({
      title: "Título obrigatório",
      description: "Por favor, informe um título para a nota oficial.",
      variant: "destructive"
    });
    return false;
  }

  if (!texto.trim()) {
    toast({
      title: "Conteúdo obrigatório",
      description: "Por favor, informe o conteúdo da nota oficial.",
      variant: "destructive"
    });
    return false;
  }

  if (!selectedDemanda) {
    toast({
      title: "Demanda inválida",
      description: "Selecione uma demanda válida.",
      variant: "destructive"
    });
    return false;
  }

  return true;
};
