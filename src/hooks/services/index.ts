
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Service } from './types';

// Export from './useServices'
export { useServices } from './useServices';
export type { Service, Area } from './types';
export { serviceSchema } from './types';

// Additional utility function if needed
export const fetchServicesByProblema = async (problemaId: string): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('problema_id', problemaId);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching services by problema:', error);
    toast({
      title: 'Erro ao carregar serviços',
      description: error.message || 'Não foi possível carregar os serviços relacionados a este problema.',
      variant: 'destructive'
    });
    return [];
  }
};

// Function to add a new service
export const addService = async (serviceData: { descricao: string; problema_id: string }) => {
  try {
    // Include supervisao_tecnica_id as null to satisfy database requirements
    const dataToInsert = {
      descricao: serviceData.descricao,
      problema_id: serviceData.problema_id,
      supervisao_tecnica_id: null
    };
    
    const { data, error } = await supabase
      .from('servicos')
      .insert(dataToInsert)
      .select();
    
    if (error) throw error;
    return data?.[0];
  } catch (error: any) {
    console.error('Error adding service:', error);
    toast({
      title: 'Erro ao adicionar serviço',
      description: error.message || 'Não foi possível adicionar o serviço.',
      variant: 'destructive'
    });
    throw error;
  }
};
