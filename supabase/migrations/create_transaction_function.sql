
-- Create a PostgreSQL function that handles the transaction
CREATE OR REPLACE FUNCTION public.create_painel_upload_with_data(
  p_usuario_email TEXT,
  p_nome_arquivo TEXT,
  p_dados JSONB
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_upload_id UUID;
BEGIN
  -- Insert upload record and get the ID
  INSERT INTO painel_zeladoria_uploads (usuario_email, nome_arquivo)
  VALUES (p_usuario_email, p_nome_arquivo)
  RETURNING id INTO v_upload_id;
  
  -- Insert data records with reference to the upload
  WITH data_json AS (
    SELECT jsonb_array_elements(p_dados) AS data
  )
  INSERT INTO painel_zeladoria_dados (
    id_os,
    tipo_servico,
    status,
    distrito,
    departamento,
    data_abertura,
    data_fechamento,
    responsavel_real,
    upload_id,
    responsavel_classificado
  )
  SELECT
    (data->>'id_os')::TEXT,
    (data->>'tipo_servico')::TEXT,
    (data->>'status')::TEXT,
    (data->>'distrito')::TEXT,
    (data->>'departamento')::TEXT,
    (data->>'data_abertura')::TIMESTAMP WITH TIME ZONE,
    (data->>'data_fechamento')::TIMESTAMP WITH TIME ZONE,
    (data->>'responsavel_real')::TEXT,
    v_upload_id,
    COALESCE(
      public.classify_service_responsibility((data->>'tipo_servico')::TEXT),
      'subprefeitura'
    )
  FROM data_json;
  
  -- Return the upload ID
  RETURN v_upload_id;
EXCEPTION WHEN OTHERS THEN
  -- Attempt to rollback by deleting the upload record if it was created
  IF v_upload_id IS NOT NULL THEN
    DELETE FROM painel_zeladoria_uploads WHERE id = v_upload_id;
  END IF;
  
  -- Re-raise the exception
  RAISE EXCEPTION '%', SQLERRM;
END;
$$;
