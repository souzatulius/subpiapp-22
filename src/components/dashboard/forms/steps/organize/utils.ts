
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
  if (formData.titulo && formData.titulo.trim() !== '') {
    return formData.titulo;
  }
  
  let suggestedTitle = '';
  
  const selectedProblem = problemas.find(p => p.id === formData.problema_id);
  const selectedService = servicos.find(s => s.id === formData.servico_id);
  const selectedBairro = filteredBairros.find(b => b.id === formData.bairro_id);
  
  if (selectedProblem) {
    suggestedTitle += selectedProblem.descricao;
  }
  
  if (selectedService) {
    suggestedTitle += ` - ${selectedService.descricao}`;
  }
  
  if (selectedBairro) {
    suggestedTitle += ` - ${selectedBairro.nome}`;
  }
  
  if (formData.endereco) {
    const shortAddress = formData.endereco.length > 30 
      ? formData.endereco.substring(0, 30) + '...' 
      : formData.endereco;
    suggestedTitle += ` (${shortAddress})`;
  }
  
  return suggestedTitle.trim();
};
