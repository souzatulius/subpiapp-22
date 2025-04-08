// Helper functions to transform raw data into chart-friendly formats

export const transformDistrictsToPieData = (districts: any[] = []) => {
  if (!districts || districts.length === 0) {
    return [
      { name: 'Butantã', value: 35 },
      { name: 'Pinheiros', value: 25 },
      { name: 'Lapa', value: 20 },
      { name: 'Santo Amaro', value: 15 },
      { name: 'Sé', value: 5 }
    ];
  }
  return districts;
};

export const transformOriginsToBarData = (origins: any[] = []) => {
  if (!origins || origins.length === 0) {
    return [
      { name: 'Portal', value: 45 },
      { name: 'WhatsApp', value: 30 },
      { name: 'Aplicativo', value: 15 },
      { name: 'Presencial', value: 10 }
    ];
  }
  return origins;
};

export const transformProblemasToBarData = (problemas: any[] = []) => {
  if (!problemas || problemas.length === 0) {
    return [
      { name: 'Poda', value: 45 },  // Renamed from "Poda de Árvores" to "Poda"
      { name: 'Bueiros', value: 30 },
      { name: 'Remoção de Galhos', value: 25 },
      { name: 'Lixo', value: 15 },
      { name: 'Parques e Praças', value: 10 }
    ];
  }

  // Return a new array with the renamed problemas
  return problemas.map(problema => ({
    ...problema,
    name: problema.name === 'Poda de Árvores' ? 'Poda' : problema.name
  }));
};

export const transformCoordinationsToBarData = (coordinations: any[] = []) => {
  if (!coordinations || coordinations.length === 0) {
    return [
      { name: 'CPO', fullName: 'Coordenadoria de Planejamento e Obras', Demandas: 92 },
      { name: 'CPDU', fullName: 'Coordenadoria de Projetos e Desenvolvimento Urbano', Demandas: 87 },
      { name: 'GOV', fullName: 'Governo Local', Demandas: 82 },
      { name: 'JUR', fullName: 'Jurídico', Demandas: 75 },
      { name: 'FIN', fullName: 'Finanças', Demandas: 68 },
    ];
  }
  
  // Transform coordination data to show full name or sigla based on availability
  return coordinations.map(coord => {
    // If the coordination has a sigla in its data, use it, otherwise use the first 3 letters of the description
    const displayName = coord.sigla || (coord.name && coord.name.length > 3 ? coord.name.substring(0, 3).toUpperCase() : coord.name);
    
    return {
      name: displayName,
      fullName: coord.fullName || coord.descricao || coord.name,
      Demandas: coord.Demandas || coord.value || Math.floor(Math.random() * 100) + 50
    };
  });
};

export const transformResponseTimesToLineData = (responseTimes: any[] = []) => {
  if (!responseTimes || responseTimes.length === 0) {
    return [
      { name: 'Jan', Demandas: 48, Aprovacao: 72 },
      { name: 'Fev', Demandas: 42, Aprovacao: 65 },
      { name: 'Mar', Demandas: 36, Aprovacao: 58 },
      { name: 'Abr', Demandas: 30, Aprovacao: 52 },
      { name: 'Mai', Demandas: 24, Aprovacao: 45 }
    ];
  }
  return responseTimes;
};

export const transformMediaTypesToBarData = (mediaTypes: any[] = []) => {
  if (!mediaTypes || mediaTypes.length === 0) {
    return [
      { name: 'Jan', value: 12 },
      { name: 'Fev', value: 18 },
      { name: 'Mar', value: 15 },
      { name: 'Abr', value: 20 },
      { name: 'Mai', value: 22 }
    ];
  }
  return mediaTypes;
};

export const transformStatusToPieData = (status: any[] = []) => {
  if (!status || status.length === 0) {
    return [
      { name: 'Aprovado', value: 45 },
      { name: 'Pendente', value: 30 },
      { name: 'Rejeitado', value: 15 },
      { name: 'Em análise', value: 10 }
    ];
  }
  return status;
};

export const transformApprovalsToPieData = (approvals: any[] = []) => {
  if (!approvals || approvals.length === 0) {
    return [
      { name: 'Aprovado', value: 75 },
      { name: 'Rejeitado', value: 25 }
    ];
  }
  return approvals;
};

export const transformResponsiblesToBarData = (responsibles: any[] = []) => {
  if (!responsibles || responsibles.length === 0) {
    return [
      { name: 'Coord. A', value: 35 },
      { name: 'Coord. B', value: 25 },
      { name: 'Coord. C', value: 20 },
      { name: 'Coord. D', value: 15 },
      { name: 'Coord. E', value: 5 }
    ];
  }
  return responsibles;
};

export const transformNeighborhoodsToBarData = (neighborhoods: any[] = []) => {
  if (!neighborhoods || neighborhoods.length === 0) {
    return [
      { name: 'Bairro A', value: 35 },
      { name: 'Bairro B', value: 25 },
      { name: 'Bairro C', value: 20 },
      { name: 'Bairro D', value: 15 },
      { name: 'Bairro E', value: 5 }
    ];
  }
  return neighborhoods;
};
