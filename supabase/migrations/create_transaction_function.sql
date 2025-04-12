
-- Create a PostgreSQL function that handles the transaction
CREATE OR REPLACE FUNCTION public.create_painel_upload_with_data(
  p_usuario_email TEXT,
  p_nome_arquivo TEXT,
  p_dados JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_upload_id UUID;
  v_unique_filename TEXT;
  v_count INT;
BEGIN
  -- Check if filename already exists
  SELECT COUNT(*) INTO v_count 
  FROM painel_zeladoria_uploads 
  WHERE nome_arquivo = p_nome_arquivo;
  
  -- Make filename unique if it already exists
  IF v_count > 0 THEN
    v_unique_filename := p_nome_arquivo || '_' || to_char(now(), 'YYYY_MM_DD_HH24_MI_SS');
  ELSE
    v_unique_filename := p_nome_arquivo;
  END IF;

  -- Insert upload record and get the ID
  INSERT INTO painel_zeladoria_uploads (usuario_email, nome_arquivo)
  VALUES (p_usuario_email, v_unique_filename)
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
  
  -- Return the upload ID and filename information
  RETURN jsonb_build_object(
    'id', v_upload_id,
    'nome_arquivo', v_unique_filename,
    'original_filename', p_nome_arquivo,
    'record_count', jsonb_array_length(p_dados)
  );
EXCEPTION WHEN OTHERS THEN
  -- Attempt to rollback by deleting the upload record if it was created
  IF v_upload_id IS NOT NULL THEN
    DELETE FROM painel_zeladoria_uploads WHERE id = v_upload_id;
  END IF;
  
  -- Re-raise the exception
  RAISE EXCEPTION '%', SQLERRM;
END;
$$;

-- Create a function to clean up all data
CREATE OR REPLACE FUNCTION public.clean_zeladoria_data()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all data from tables
  -- Using CASCADE will ensure the foreign key constraints are respected
  DELETE FROM painel_zeladoria_uploads;
  DELETE FROM sgz_uploads;
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error cleaning data: %', SQLERRM;
  RETURN FALSE;
END;
$$;
