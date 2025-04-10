
import { toast } from '@/components/ui/use-toast';
import { Demand } from '@/components/dashboard/forms/criar-nota/types';

interface ValidateNotaFormProps {
  titulo: string;
  texto: string;
  selectedDemanda: Demand | null;
}

export const validateNotaForm = ({
  titulo,
  texto,
  selectedDemanda
}: ValidateNotaFormProps): boolean => {
  // Validate title
  if (!titulo.trim()) {
    toast({
      title: "Título obrigatório",
      description: "Por favor, informe um título para a nota oficial.",
      variant: "destructive"
    });
    return false;
  }

  // Validate content
  if (!texto.trim()) {
    toast({
      title: "Conteúdo obrigatório",
      description: "Por favor, informe o conteúdo da nota oficial.",
      variant: "destructive"
    });
    return false;
  }

  // Validate demand selection
  if (!selectedDemanda || !selectedDemanda.id) {
    toast({
      title: "Demanda inválida",
      description: "É necessário selecionar uma demanda válida para criar a nota.",
      variant: "destructive"
    });
    return false;
  }

  return true;
};
