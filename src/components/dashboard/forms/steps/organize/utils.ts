
import { DemandFormData } from '@/hooks/demandForm';

export const generateTitleSuggestion = (
  formData: DemandFormData,
  problemas: any[],
  servicos: any[],
  bairros: any[]
): string => {
  if (!formData) return '';

  // Find the problem and service from their IDs
  const selectedProblem = problemas.find(p => p.id === formData.problema_id);
  const selectedService = servicos.find(s => s.id === formData.servico_id);
  const selectedBairro = bairros.find(b => b.id === formData.bairro_id);

  // Array to hold the parts of the title
  const titleParts: string[] = [];

  // Add problem description if available
  if (selectedProblem?.descricao) {
    titleParts.push(selectedProblem.descricao);
  }

  // Add service description if available
  if (selectedService?.descricao) {
    titleParts.push(`- ${selectedService.descricao}`);
  }

  // Add location information if available
  if (formData.endereco) {
    const addressPart = formData.endereco.split(',')[0]; // Get the first part of the address before any comma
    titleParts.push(`- ${addressPart}`);
  }

  // Add bairro if available
  if (selectedBairro?.nome) {
    titleParts.push(`- ${selectedBairro.nome}`);
  }

  // Join the parts with spaces
  return titleParts.join(' ').trim();
};
