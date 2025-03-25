
-- Create a function to get unique coordenações
CREATE OR REPLACE FUNCTION public.get_unique_coordenacoes()
RETURNS TABLE (
  coordenacao_id TEXT,
  coordenacao TEXT
) 
LANGUAGE SQL
AS $$
  SELECT DISTINCT ON (coordenacao_id) 
    coordenacao_id, 
    coordenacao
  FROM areas_coordenacao
  WHERE coordenacao_id IS NOT NULL AND coordenacao IS NOT NULL
  ORDER BY coordenacao_id, coordenacao;
$$;
