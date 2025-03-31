
// Update the fetchDemandas function to properly get count
const fetchDemandas = async () => {
  try {
    setIsLoading(true);
    
    let query = supabase
      .from('demandas')
      .select(`
        id, 
        titulo, 
        status, 
        criado_em,
        requerente:requerente_id (nome)
      `);
    
    // Apply filters based on role
    if (isComunicacao) {
      // For communication team, show all pending demands
      query = query
        .eq('status', 'pendente_resposta')
        .order('criado_em', { ascending: false });
    } else {
      // For other areas, show only demands for their coordination
      query = query
        .eq('coordenacao_id', coordenacaoId)
        .eq('status', 'pendente_resposta')
        .order('criado_em', { ascending: false });
    }
    
    // Get data
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching demandas:', error);
      return;
    }
    
    // Set the count from the results length
    setTotalDemandas(data?.length || 0);
    
    // Set limited data for display
    setDemandas(data?.slice(0, 5) || []);
  } catch (err) {
    console.error('Failed to fetch demandas:', err);
  } finally {
    setIsLoading(false);
  }
};
