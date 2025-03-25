
-- Add coordenacao_id column to areas_coordenacao if not exists
ALTER TABLE public.areas_coordenacao 
ADD COLUMN IF NOT EXISTS coordenacao_id UUID REFERENCES areas_coordenacao(id);

-- Update the function to get unique coordenações to use the new coordenacao_id column
CREATE OR REPLACE FUNCTION public.get_unique_coordenacoes()
RETURNS TABLE (
  coordenacao_id TEXT,
  coordenacao TEXT
) 
LANGUAGE SQL
AS $$
  SELECT DISTINCT ON (coordenacao) 
    id::text as coordenacao_id, 
    coordenacao
  FROM areas_coordenacao
  WHERE coordenacao IS NOT NULL
  ORDER BY coordenacao, id;
$$;
