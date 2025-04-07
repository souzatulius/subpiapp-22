
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.usuarios (
    id, 
    nome_completo, 
    email, 
    aniversario, 
    whatsapp, 
    cargo_id, 
    coordenacao_id,
    supervisao_tecnica_id,
    status
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nome_completo', new.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(new.email, new.raw_user_meta_data->>'email'),
    NULLIF(new.raw_user_meta_data->>'aniversario', NULLIF(new.raw_user_meta_data->>'birthday', ''))::date,
    NULLIF(new.raw_user_meta_data->>'whatsapp', ''),
    NULLIF(new.raw_user_meta_data->>'cargo_id', NULLIF(new.raw_user_meta_data->>'role_id', '')),
    NULLIF(new.raw_user_meta_data->>'coordenacao_id', ''),
    NULLIF(new.raw_user_meta_data->>'supervisao_tecnica_id', NULLIF(new.raw_user_meta_data->>'area_id', '')),
    'pendente'
  );
  RETURN new;
END;
$$;
