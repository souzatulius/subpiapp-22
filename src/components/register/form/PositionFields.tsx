
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
  const [hasSupervisions, setHasSupervisions] = useState(false);
  const [isCoordinationRole, setIsCoordinationRole] = useState(false);
  const [isTeamRole, setIsTeamRole] = useState(false);
  const [isManagerRole, setIsManagerRole] = useState(false);

  // Check if the selected role is Coordination, Team or Manager
  useEffect(() => {
    if (role) {
      // Get the role description
      const selectedRole = roles.find(r => r.id === role);
      if (selectedRole) {
        const roleDescription = selectedRole.value.toLowerCase();
        setIsCoordinationRole(roleDescription.includes('coordenação') || roleDescription.includes('coordenacao'));
        setIsTeamRole(roleDescription.includes('equipe') || roleDescription.includes('técnico') || roleDescription.includes('tecnico'));
        setIsManagerRole(roleDescription.includes('gestor') || roleDescription.includes('gestores'));
      }
    }
  }, [role, roles]);

  // Filter areas based on selected coordenação
  useEffect(() => {
    const filterAreas = async () => {
      if (coordenacao && coordenacao !== 'select-coordenacao') {
        try {
          setFetchingAreas(true);
          
          // Fetch technical supervisions for this coordination
          const { data, error } = await supabase
            .from('supervisoes_tecnicas')
            .select('id, descricao, sigla')
            .eq('coordenacao_id', coordenacao);
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            const formattedAreas = data.map(area => ({
              id: area.id,
              value: area.descricao,
              sigla: area.sigla
            }));
            console.log(`Found ${formattedAreas.length} supervisions for coordination ${coordenacao}`);
            setFilteredAreas(formattedAreas);
            setHasSupervisions(true);
          } else {
            setFilteredAreas([]);
            setHasSupervisions(false);
          }
        } catch (error) {
          console.error('Error filtering areas:', error);
          setFilteredAreas([]);
          setHasSupervisions(false);
        } finally {
          setFetchingAreas(false);
        }
      } else {
        // If no coordenação is selected, show no areas
        setFilteredAreas([]);
        setHasSupervisions(false);
      }
    };
    
    filterAreas();
  }, [coordenacao]);

  // If user selects a coordination or manager role, clear the area selection
  useEffect(() => {
    if ((isCoordinationRole || isManagerRole) && area) {
      handleChange('area', '');
    }
  }, [isCoordinationRole, isManagerRole, area, handleChange]);

  // Function to get the display text for coordination (sigla or full name)
  const getCoordinationDisplayText = (coord: SelectOption) => {
    // Check if the value contains a sigla in parentheses
    if (coord.sigla && coord.sigla.trim() !== '') {
      return coord.sigla; // Return just the sigla if available
    }
    
    // Check if the value contains a sigla in parentheses (legacy format)
    const match = coord.value.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return match[1]; // Return just the sigla if available
    }
    
    return coord.value; // Return the full name if no sigla
  };

  // Function to get the display text for supervision (sigla or full name)
  const getAreaDisplayText = (area: SelectOption) => {
    if (area.sigla && area.sigla.trim() !== '') {
      return area.sigla;
    }
    return area.value;
  };

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
              className={`${errors.role ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-[#003570] focus:border-transparent transition-all duration-200 data-[state=open]:border-gray-300 border-gray-300`}
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {roles.length === 0 ? (
                <SelectItem value="no-options-available" disabled>
                  Nenhum cargo disponível
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="select-cargo" disabled>Selecione um cargo</SelectItem>
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
              className={`${errors.coordenacao ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-[#003570] focus:border-transparent transition-all duration-200 data-[state=open]:border-gray-300 border-gray-300`}
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {coordenacoes.length === 0 ? (
                <SelectItem value="no-coordenacoes-available" disabled>
                  Nenhuma coordenação disponível
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="select-coordenacao" disabled>Selecione uma coordenação</SelectItem>
                  {coordenacoes.map(coord => (
                    <SelectItem key={coord.id} value={coord.id}>
                      {getCoordinationDisplayText(coord)}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        )}
        {errors.coordenacao && <p className="mt-1 text-sm text-[#f57b35]">Coordenação é obrigatória</p>}
      </div>
      
      {/* Only show the supervision field if:
          1. Not a coordination role AND
          2. Not a manager role AND
          3. The selected coordination has supervisions AND
          4. It's a team role OR (any role and there are supervisions) */}
      {!isCoordinationRole && !isManagerRole && hasSupervisions && (isTeamRole || hasSupervisions) && (
        <div className="animate-fadeIn">
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
                className={`${errors.area ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-[#003570] focus:border-transparent transition-all duration-200 data-[state=open]:border-gray-300 border-gray-300`}
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {!coordenacao || coordenacao === 'select-coordenacao' ? (
                  <SelectItem value="no-coordenacao-selected" disabled>
                    Selecione uma coordenação primeiro
                  </SelectItem>
                ) : filteredAreas.length === 0 ? (
                  <SelectItem value="no-supervisions-available" disabled>
                    Nenhuma supervisão técnica disponível para esta coordenação
                  </SelectItem>
                ) : (
                  <>
                    <SelectItem value="select-area" disabled>Selecione uma supervisão técnica</SelectItem>
                    {filteredAreas.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        {getAreaDisplayText(area)}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          )}
          {errors.area && isTeamRole && hasSupervisions && <p className="mt-1 text-sm text-[#f57b35]">Supervisão Técnica é obrigatória</p>}
        </div>
      )}
    </div>
  );
};

export default PositionFields;
