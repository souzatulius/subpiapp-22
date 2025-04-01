
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
  // If there's already a manually entered title, don't override it
  if (formData.titulo && formData.titulo.trim() !== '') {
    return formData.titulo;
  }
  
  let suggestedTitle = '';
  
  // Try to use service first (more specific)
  const selectedService = servicos.find(s => s.id === formData.servico_id);
  if (selectedService) {
    suggestedTitle = selectedService.descricao;
  } else {
    // Fall back to problem if no service is selected
    const selectedProblem = problemas.find(p => p.id === formData.problema_id);
    if (selectedProblem) {
      suggestedTitle = selectedProblem.descricao;
    }
  }
  
  // Add location information
  const selectedBairro = filteredBairros.find(b => b.id === formData.bairro_id);
  
  if (selectedBairro) {
    suggestedTitle += ` em ${selectedBairro.nome}`;
  }
  
  if (formData.endereco) {
    const shortAddress = formData.endereco.length > 30 
      ? formData.endereco.substring(0, 30) + '...' 
      : formData.endereco;
    suggestedTitle += ` - ${shortAddress}`;
  }
  
  return suggestedTitle.trim();
};
