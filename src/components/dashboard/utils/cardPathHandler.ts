
/**
 * Utility function to correct card paths based on title
 */
export const getCorrectPath = (title: string, path: string): string => {
  // Fix common path issues based on card title
  if (title === "Nova Demanda" && path.includes("cadastrar-demanda")) {
    return "/dashboard/comunicacao/cadastrar";
  } else if (title === "Aprovar Nota" && path.includes("aprovar-nota-oficial")) {
    return "/dashboard/comunicacao/aprovar-nota";
  } else if (title === "Responder Demandas" && path.includes("responder-demandas")) {
    return "/dashboard/comunicacao/responder";
  } else if (title === "Números da Comunicação" && !path.includes("relatorios")) {
    return "/dashboard/comunicacao/relatorios";
  } else if (title === "Consultar Notas" && !path.includes("consultar-notas")) {
    return "/dashboard/comunicacao/consultar-notas";
  } else if (title === "Consultar Demandas" && !path.includes("consultar-demandas")) {
    return "/dashboard/comunicacao/consultar-demandas";
  }
  
  return path;
};
