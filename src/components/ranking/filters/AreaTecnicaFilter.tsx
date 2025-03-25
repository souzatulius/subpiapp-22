
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SGZAreaTecnica } from '@/types/sgz';

interface AreaTecnicaFilterProps {
  value: 'Todos' | SGZAreaTecnica;
  onChange: (value: 'Todos' | SGZAreaTecnica) => void;
}

const AreaTecnicaFilter: React.FC<AreaTecnicaFilterProps> = ({
  value,
  onChange
}) => {
  const [areas, setAreas] = useState<{id: string, nome_area: SGZAreaTecnica, descricao?: string}[]>([]);

  // Fetch SGZ technical areas from the dedicated table
  useEffect(() => {
    const fetchAreas = async () => {
      const { data, error } = await supabase
        .from('sgz_areas_tecnicas')
        .select('id, nome_area, descricao');
      
      if (error) {
        console.error('Error fetching SGZ areas:', error);
      } else if (data) {
        setAreas(data as {id: string, nome_area: SGZAreaTecnica, descricao?: string}[]);
      }
    };

    fetchAreas();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Área Técnica</label>
      <Select
        value={value}
        onValueChange={onChange as (value: string) => void}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione a área técnica" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todas</SelectItem>
          {areas.map(area => (
            <SelectItem key={area.id} value={area.nome_area}>
              {area.nome_area} {area.descricao ? `- ${area.descricao}` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AreaTecnicaFilter;
