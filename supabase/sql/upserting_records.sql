
-- SQL Migration for Data Retention Strategy
-- This migration adds constraints and functions to ensure we keep existing OS,
-- add new OS, and update status only for OS with changes

-- 1. First, add a unique constraint on sgz_id for sgz_ordens_servico
-- This ensures we can use upsert operations to update existing records
ALTER TABLE public.sgz_ordens_servico 
ADD CONSTRAINT sgz_ordens_servico_sgz_id_key UNIQUE (sgz_id);

-- 2. Add a unique constraint on numero_os for painel_zeladoria_dados
-- This ensures we can use upsert operations to update existing records
ALTER TABLE public.painel_zeladoria_dados 
ADD CONSTRAINT painel_zeladoria_dados_numero_os_key UNIQUE (numero_os);

-- 3. Create a function to process SGZ data with the upsert strategy
CREATE OR REPLACE FUNCTION public.process_sgz_data_with_history(
  p_data jsonb,
  p_upload_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_inserted_count INT := 0;
  v_updated_count INT := 0;
  v_status_changes INT := 0;
  v_record jsonb;
  v_result jsonb;
  v_old_status TEXT;
BEGIN
  -- Process each record in the data array
  FOR v_record IN SELECT * FROM jsonb_array_elements(p_data)
  LOOP
    -- Check if record already exists
    SELECT sgz_status INTO v_old_status
    FROM public.sgz_ordens_servico
    WHERE sgz_id = (v_record->>'sgz_id');
    
    -- If record exists, update it with ON CONFLICT
    INSERT INTO public.sgz_ordens_servico (
      sgz_id,
      sgz_tipo_servico,
      sgz_status,
      sgz_distrito,
      sgz_empresa,
      sgz_modificado_em,
      sgz_criado_em,
      sgz_dias_ate_status_atual,
      servico_responsavel,
      planilha_referencia
    ) VALUES (
      (v_record->>'sgz_id'),
      (v_record->>'sgz_tipo_servico'),
      (v_record->>'sgz_status'),
      (v_record->>'sgz_distrito'),
      (v_record->>'sgz_empresa'),
      (v_record->>'sgz_modificado_em')::timestamp with time zone,
      (v_record->>'sgz_criado_em')::timestamp with time zone,
      (v_record->>'sgz_dias_ate_status_atual')::integer,
      (v_record->>'servico_responsavel'),
      p_upload_id
    )
    ON CONFLICT (sgz_id) 
    DO UPDATE SET
      sgz_status = EXCLUDED.sgz_status,
      sgz_modificado_em = EXCLUDED.sgz_modificado_em,
      sgz_dias_ate_status_atual = EXCLUDED.sgz_dias_ate_status_atual,
      planilha_referencia = EXCLUDED.planilha_referencia
    RETURNING (xmax = 0) INTO v_result;
    
    -- Count inserts vs updates
    IF v_result THEN
      v_inserted_count := v_inserted_count + 1;
    ELSE
      v_updated_count := v_updated_count + 1;
      
      -- If status changed, record the status change in history
      IF v_old_status IS DISTINCT FROM (v_record->>'sgz_status') THEN
        INSERT INTO public.sgz_status_historico(
          ordem_servico,
          status_antigo,
          status_novo,
          data_mudanca,
          planilha_origem
        ) VALUES (
          (v_record->>'sgz_id'),
          v_old_status,
          (v_record->>'sgz_status'),
          COALESCE((v_record->>'sgz_modificado_em')::timestamp with time zone, NOW()),
          p_upload_id
        );
        
        v_status_changes := v_status_changes + 1;
      END IF;
    END IF;
  END LOOP;
  
  -- Return the counts
  RETURN jsonb_build_object(
    'inserted', v_inserted_count,
    'updated', v_updated_count,
    'status_changes', v_status_changes
  );
END;
$$;

-- 4. Create a function to process Painel data with the upsert strategy
CREATE OR REPLACE FUNCTION public.process_painel_data_with_history(
  p_data jsonb,
  p_upload_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_inserted_count INT := 0;
  v_updated_count INT := 0;
  v_status_changes INT := 0;
  v_record jsonb;
  v_result jsonb;
  v_old_status TEXT;
BEGIN
  -- Process each record in the data array
  FOR v_record IN SELECT * FROM jsonb_array_elements(p_data)
  LOOP
    -- Check if record already exists
    SELECT status INTO v_old_status
    FROM public.painel_zeladoria_dados
    WHERE numero_os = (v_record->>'numero_os');
    
    -- If record exists, update it with ON CONFLICT
    INSERT INTO public.painel_zeladoria_dados (
      numero_os,
      tipo_servico,
      status,
      distrito,
      data_abertura,
      data_fechamento,
      responsavel_real,
      responsavel_classificado,
      upload_id
    ) VALUES (
      (v_record->>'numero_os'),
      (v_record->>'tipo_servico'),
      (v_record->>'status_atual'),
      (v_record->>'distrito'),
      (v_record->>'data_abertura')::timestamp with time zone,
      (v_record->>'data_fechamento')::timestamp with time zone,
      (v_record->>'responsavel'),
      COALESCE(
        public.classify_service_responsibility((v_record->>'tipo_servico')),
        'subprefeitura'
      ),
      p_upload_id
    )
    ON CONFLICT (numero_os) 
    DO UPDATE SET
      status = EXCLUDED.status,
      data_fechamento = EXCLUDED.data_fechamento,
      upload_id = EXCLUDED.upload_id
    RETURNING (xmax = 0) INTO v_result;
    
    -- Count inserts vs updates
    IF v_result THEN
      v_inserted_count := v_inserted_count + 1;
    ELSE
      v_updated_count := v_updated_count + 1;
      
      -- If status changed, record the status change in history
      IF v_old_status IS DISTINCT FROM (v_record->>'status_atual') THEN
        INSERT INTO public.painel_zeladoria_comparacoes(
          id_os,
          status_painel,
          status_sgz,
          motivo,
          upload_id
        ) VALUES (
          (v_record->>'numero_os'),
          (v_record->>'status_atual'),
          v_old_status,
          'Atualização de status',
          p_upload_id
        );
        
        v_status_changes := v_status_changes + 1;
      END IF;
    END IF;
  END LOOP;
  
  -- Return the counts
  RETURN jsonb_build_object(
    'inserted', v_inserted_count,
    'updated', v_updated_count,
    'status_changes', v_status_changes
  );
END;
$$;

-- 5. Add trigger function to track SGZ status changes
CREATE OR REPLACE FUNCTION public.track_sgz_status_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.sgz_status IS DISTINCT FROM NEW.sgz_status THEN
    INSERT INTO public.sgz_status_historico(
      ordem_servico,
      status_antigo,
      status_novo,
      data_mudanca,
      planilha_origem
    ) VALUES (
      NEW.sgz_id,
      OLD.sgz_status,
      NEW.sgz_status,
      COALESCE(NEW.sgz_modificado_em, NOW()),
      NEW.planilha_referencia
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 6. Add trigger function to track Painel status changes
CREATE OR REPLACE FUNCTION public.track_painel_status_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.painel_zeladoria_comparacoes(
      id_os,
      status_painel,
      status_sgz,
      motivo,
      upload_id
    ) VALUES (
      NEW.numero_os,
      NEW.status,
      NULL,
      'Atualização de status',
      NEW.upload_id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 7. Add the triggers to the tables
CREATE TRIGGER sgz_status_change_trigger
BEFORE UPDATE ON public.sgz_ordens_servico
FOR EACH ROW
EXECUTE FUNCTION public.track_sgz_status_changes();

CREATE TRIGGER painel_status_change_trigger
BEFORE UPDATE ON public.painel_zeladoria_dados
FOR EACH ROW
EXECUTE FUNCTION public.track_painel_status_changes();

-- 8. Modify the create_painel_upload_with_data function to use the new process_painel_data_with_history function
CREATE OR REPLACE FUNCTION public.create_painel_upload_with_data(p_usuario_email text, p_nome_arquivo text, p_dados jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  v_upload_id UUID;
  v_unique_filename TEXT;
  v_count INT;
  v_result jsonb;
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
  
  -- Process data with history using our new function
  v_result := process_painel_data_with_history(p_dados, v_upload_id);
  
  -- Return the upload ID, filename information, and processing result
  RETURN jsonb_build_object(
    'id', v_upload_id,
    'nome_arquivo', v_unique_filename,
    'original_filename', p_nome_arquivo,
    'record_count', jsonb_array_length(p_dados),
    'inserted', v_result->>'inserted',
    'updated', v_result->>'updated',
    'status_changes', v_result->>'status_changes'
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
