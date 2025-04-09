
import { supabase } from '@/integrations/supabase/client';

// This file contains functions to create stored procedures in Supabase
// You would run these once to set up the DB functions

export const createDatabaseFunctions = async () => {
  try {
    // Create function for aggregating demandas by coordenação and day
    const { error: demandaFuncError } = await supabase.rpc('create_demandas_por_coordenacao_function');
    
    if (demandaFuncError) {
      console.error('Error creating demandas_por_coordenacao_e_dia function:', demandaFuncError);
      
      // Try direct SQL execution
      await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE OR REPLACE FUNCTION demandas_por_coordenacao_e_dia(
            start_date DATE,
            end_date DATE
          )
          RETURNS TABLE (
            dia TEXT,
            dia_formatado TEXT,
            data DATE,
            coordenacao_id UUID,
            coordenacao_nome TEXT,
            quantidade BIGINT
          )
          LANGUAGE SQL
          AS $$
            SELECT
              TO_CHAR(DATE_TRUNC('day', d.criado_em), 'YYYY-MM-DD') as dia,
              TO_CHAR(DATE_TRUNC('day', d.criado_em), 'Day') as dia_formatado,
              DATE_TRUNC('day', d.criado_em)::DATE as data,
              d.coordenacao_id,
              c.descricao as coordenacao_nome,
              COUNT(d.id) as quantidade
            FROM
              demandas d
              LEFT JOIN coordenacoes c ON d.coordenacao_id = c.id
            WHERE
              d.criado_em >= start_date AND d.criado_em <= (end_date + INTERVAL '1 day')
            GROUP BY
              dia, dia_formatado, data, d.coordenacao_id, c.descricao
            ORDER BY
              data ASC, coordenacao_nome ASC;
          $$;
        `
      });
    }
    
    // Create function for aggregating notas by day
    const { error: notasFuncError } = await supabase.rpc('create_notas_por_dia_function');
    
    if (notasFuncError) {
      console.error('Error creating notas_por_dia function:', notasFuncError);
      
      // Try direct SQL execution
      await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE OR REPLACE FUNCTION notas_por_dia(
            start_date DATE,
            end_date DATE
          )
          RETURNS TABLE (
            dia TEXT,
            dia_formatado TEXT,
            data DATE,
            quantidade BIGINT
          )
          LANGUAGE SQL
          AS $$
            SELECT
              TO_CHAR(DATE_TRUNC('day', n.criado_em), 'YYYY-MM-DD') as dia,
              TO_CHAR(DATE_TRUNC('day', n.criado_em), 'Day') as dia_formatado,
              DATE_TRUNC('day', n.criado_em)::DATE as data,
              COUNT(n.id) as quantidade
            FROM
              notas_oficiais n
            WHERE
              n.criado_em >= start_date AND n.criado_em <= (end_date + INTERVAL '1 day')
            GROUP BY
              dia, dia_formatado, data
            ORDER BY
              data ASC;
          $$;
        `
      });
    }
    
    console.log('Database functions created or updated successfully.');
  } catch (error) {
    console.error('Error creating database functions:', error);
  }
};

// Note: You would call createDatabaseFunctions() once during app initialization
// or as part of an admin setup process
