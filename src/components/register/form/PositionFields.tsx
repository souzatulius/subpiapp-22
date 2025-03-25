
import React, { useState, useEffect } from 'react';
import { SelectOption } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PositionFieldsProps {
  role: string;
  area: string;
  coordenacao: string;
  roles: SelectOption[];
  areas: SelectOption[];
  coordenacoes: SelectOption[];
  loadingOptions: boolean;
  errors: Record<string, boolean>;
  handleChange: (name: string, value: string) => void;
}

const PositionFields: React.FC<PositionFieldsProps> = ({
  role,
  area,
  coordenacao,
  roles,
  areas,
  coordenacoes,
  loadingOptions,
  errors,
  handleChange
}) => {
  const [filteredAreas, setFilteredAreas] = useState<SelectOption[]>([]);
  const [fetchingAreas, setFetchingAreas] = useState(false);

  // Filter areas based on selected coordenação
  useEffect(() => {
    const filterAreas = async () => {
      if (coordenacao && coordenacao !== 'select-coordenacao') {
        try {
          setFetchingAreas(true);
          
          // Fetch technical supervisions for this coordination
          const { data, error } = await supabase
            .from('areas_coordenacao')
            .select('id, descricao')
            .eq('is_supervision', true)
            .eq('coordenacao_id', coordenacao);
            
          if (error) throw error;
          
          if (data) {
            const formattedAreas = data.map(area => ({
              id: area.id,
              value: area.descricao
            }));
            console.log(`Found ${formattedAreas.length} supervisions for coordination ${coordenacao}`);
            setFilteredAreas(formattedAreas);
          } else {
            setFilteredAreas([]);
          }
        } catch (error) {
          console.error('Error filtering areas:', error);
          setFilteredAreas([]);
        } finally {
          setFetchingAreas(false);
        }
      } else {
        // If no coordenação is selected, show no areas
        setFilteredAreas([]);
      }
    };
    
    filterAreas();
  }, [coordenacao]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-[#111827] mb-1">
          Cargo
        </label>
        {loadingOptions ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-xl flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-gray-500">Carregando...</span>
          </div>
        ) : (
          <Select 
            value={role} 
            onValueChange={(value) => handleChange('role', value)}
            disabled={loadingOptions}
          >
            <SelectTrigger 
              className={`${errors.role ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-[#003570] focus:border-transparent transition-all duration-200`}
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {roles.length === 0 ? (
                <SelectItem value="no-options" disabled>
                  Nenhum cargo disponível
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="select-cargo">Selecione um cargo</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.value}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        )}
        {errors.role && <p className="mt-1 text-sm text-[#f57b35]">Cargo é obrigatório</p>}
      </div>
      
      <div>
        <label htmlFor="coordenacao" className="block text-sm font-medium text-[#111827] mb-1">
          Coordenação
        </label>
        {loadingOptions ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-xl flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-gray-500">Carregando...</span>
          </div>
        ) : (
          <Select 
            value={coordenacao} 
            onValueChange={(value) => {
              handleChange('coordenacao', value);
              // Clear area when coordenação changes
              handleChange('area', '');
            }}
            disabled={loadingOptions}
          >
            <SelectTrigger 
              className={`${errors.coordenacao ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-[#003570] focus:border-transparent transition-all duration-200`}
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {coordenacoes.length === 0 ? (
                <SelectItem value="no-options" disabled>
                  Nenhuma coordenação disponível
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="select-coordenacao">Selecione uma coordenação</SelectItem>
                  {coordenacoes.map(coord => (
                    <SelectItem key={coord.id} value={coord.id}>
                      {coord.value}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        )}
        {errors.coordenacao && <p className="mt-1 text-sm text-[#f57b35]">Coordenação é obrigatória</p>}
      </div>
      
      <div>
        <label htmlFor="area" className="block text-sm font-medium text-[#111827] mb-1">
          Supervisão Técnica
        </label>
        {loadingOptions || fetchingAreas ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-xl flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-gray-500">Carregando...</span>
          </div>
        ) : (
          <Select 
            value={area} 
            onValueChange={(value) => handleChange('area', value)}
            disabled={loadingOptions || !coordenacao || coordenacao === 'select-coordenacao' || filteredAreas.length === 0}
          >
            <SelectTrigger 
              className={`${errors.area ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-[#003570] focus:border-transparent transition-all duration-200`}
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {!coordenacao || coordenacao === 'select-coordenacao' ? (
                <SelectItem value="no-coordenacao" disabled>
                  Selecione uma coordenação primeiro
                </SelectItem>
              ) : filteredAreas.length === 0 ? (
                <SelectItem value="no-supervisions" disabled>
                  Nenhuma supervisão técnica disponível para esta coordenação
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="select-area">Selecione uma supervisão técnica</SelectItem>
                  {filteredAreas.map(area => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.value}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        )}
        {errors.area && <p className="mt-1 text-sm text-[#f57b35]">Supervisão Técnica é obrigatória</p>}
      </div>
    </div>
  );
};

export default PositionFields;
