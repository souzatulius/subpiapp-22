
export const generateTitleSuggestion = (
  formData: {
    problema_id: string;
    servico_id: string;
    bairro_id: string;
    endereco: string;
    titulo: string;
  },
  problemas: any[],
  servicos: any[],
  filteredBairros: any[]
): string => {
  if (!formData.problema_id && !formData.servico_id && !formData.bairro_id && !formData.endereco) {
    return formData.titulo || '';
  }
  
  let suggestedTitle = '';
  
  const selectedProblem = problemas.find(p => p.id === formData.problema_id);
  const selectedService = servicos.find(s => s.id === formData.servico_id);
  const selectedBairro = filteredBairros.find(b => b.id === formData.bairro_id);
  
  // Start with the problem description if available
  if (selectedProblem) {
    suggestedTitle += selectedProblem.descricao;
  }
  
  // Add service if available
  if (selectedService) {
    suggestedTitle += suggestedTitle ? ` - ${selectedService.descricao}` : selectedService.descricao;
  }
  
  // Add location information (neighborhood and/or address)
  let locationPart = '';
  
  if (selectedBairro) {
    locationPart += selectedBairro.nome;
  }
  
  if (formData.endereco && formData.endereco.trim() !== '') {
    const shortAddress = formData.endereco.length > 30 
      ? formData.endereco.substring(0, 30) + '...' 
      : formData.endereco;
    
    if (locationPart) {
      locationPart += ` (${shortAddress})`;
    } else {
      locationPart = shortAddress;
    }
  }
  
  // Add location part to title if available
  if (locationPart) {
    suggestedTitle += suggestedTitle ? ` - ${locationPart}` : locationPart;
  }
  
  return suggestedTitle.trim();
};
