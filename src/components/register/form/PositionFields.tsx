
import React from 'react';
import { SelectOption } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface PositionFieldsProps {
  role: string;
  area: string;
  roles: SelectOption[];
  areas: SelectOption[];
  loadingOptions: boolean;
  errors: Record<string, boolean>;
  handleChange: (name: string, value: string) => void;
}

const PositionFields: React.FC<PositionFieldsProps> = ({
  role,
  area,
  roles,
  areas,
  loadingOptions,
  errors,
  handleChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.value}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
        {errors.role && <p className="mt-1 text-sm text-[#f57b35]">Cargo é obrigatório</p>}
      </div>
      
      <div>
        <label htmlFor="area" className="block text-sm font-medium text-[#111827] mb-1">
          Área de Coordenação
        </label>
        {loadingOptions ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-xl flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-gray-500">Carregando...</span>
          </div>
        ) : (
          <Select 
            value={area} 
            onValueChange={(value) => handleChange('area', value)}
            disabled={loadingOptions}
          >
            <SelectTrigger 
              className={`${errors.area ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:ring-[#003570] focus:border-transparent transition-all duration-200`}
            >
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {areas.length === 0 ? (
                <SelectItem value="no-options" disabled>
                  Nenhuma área disponível
                </SelectItem>
              ) : (
                areas.map(area => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.value}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
        {errors.area && <p className="mt-1 text-sm text-[#f57b35]">Área é obrigatória</p>}
      </div>
    </div>
  );
};

export default PositionFields;
