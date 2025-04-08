
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if the user already exists in the usuarios table
  IF EXISTS (SELECT 1 FROM public.usuarios WHERE id = new.id) THEN
    -- Update the existing user record
    UPDATE public.usuarios
    SET 
      nome_completo = COALESCE(new.raw_user_meta_data->>'nome_completo', new.raw_user_meta_data->>'name', 'Usuário'),
      email = COALESCE(new.email, new.raw_user_meta_data->>'email'),
      aniversario = CASE 
        -- Handle ISO format (YYYY-MM-DD)
        WHEN new.raw_user_meta_data->>'aniversario' ~ '^\d{4}-\d{2}-\d{2}$' THEN 
          (new.raw_user_meta_data->>'aniversario')::date
        -- Handle properly formatted dates or return null
        ELSE NULL
      END,
      whatsapp = NULLIF(new.raw_user_meta_data->>'whatsapp', ''),
      cargo_id = (new.raw_user_meta_data->>'cargo_id')::uuid,
      supervisao_tecnica_id = (new.raw_user_meta_data->>'supervisao_tecnica_id')::uuid,
      coordenacao_id = (new.raw_user_meta_data->>'coordenacao_id')::uuid,
      status = COALESCE(new.raw_user_meta_data->>'status', 'pendente')
    WHERE id = new.id;
  ELSE
    -- Insert a new user record
    INSERT INTO public.usuarios (
      id, 
      nome_completo, 
      email, 
      aniversario, 
      whatsapp, 
      cargo_id, 
      supervisao_tecnica_id,
      coordenacao_id,
      status
    )
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'nome_completo', new.raw_user_meta_data->>'name', 'Usuário'),
      COALESCE(new.email, new.raw_user_meta_data->>'email'),
      CASE 
        -- Handle ISO format (YYYY-MM-DD)
        WHEN new.raw_user_meta_data->>'aniversario' ~ '^\d{4}-\d{2}-\d{2}$' THEN 
          (new.raw_user_meta_data->>'aniversario')::date
        -- Handle properly formatted dates or return null
        ELSE NULL
      END,
      NULLIF(new.raw_user_meta_data->>'whatsapp', ''),
      (new.raw_user_meta_data->>'cargo_id')::uuid,
      (new.raw_user_meta_data->>'supervisao_tecnica_id')::uuid,
      (new.raw_user_meta_data->>'coordenacao_id')::uuid,
      COALESCE(new.raw_user_meta_data->>'status', 'pendente')
    );
  END IF;
  RETURN new;
END;
$$;
