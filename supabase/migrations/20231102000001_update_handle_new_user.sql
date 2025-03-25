
-- Update the handle_new_user function to support coordenacao_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.usuarios (
    id, 
    nome_completo, 
    email, 
    aniversario, 
    whatsapp, 
    cargo_id, 
    supervisao_tecnica_id,
    coordenacao_id
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(new.email, new.raw_user_meta_data->>'email'),
    NULLIF(new.raw_user_meta_data->>'birthday', '')::date,
    NULLIF(new.raw_user_meta_data->>'whatsapp', ''),
    NULLIF(new.raw_user_meta_data->>'role_id', ''),
    NULLIF(new.raw_user_meta_data->>'supervision_id', ''),
    NULLIF(new.raw_user_meta_data->>'coordenacao_id', '')
  );
  RETURN new;
END;
$function$;
