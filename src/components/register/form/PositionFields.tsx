
import React from 'react';
import { SelectOption } from '../types';

interface PositionFieldsProps {
  role: string;
  area: string;
  roles: SelectOption[];
  areas: SelectOption[];
  loadingOptions: boolean;
  errors: Record<string, boolean>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
        <select 
          id="role" 
          name="role" 
          value={role} 
          onChange={handleChange} 
          className={`w-full px-4 py-2 border ${errors.role ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} 
          disabled={loadingOptions}
        >
          <option value="">Selecione</option>
          {roles.map(role => <option key={role.id} value={role.value}>{role.value}</option>)}
        </select>
        {errors.role && <p className="mt-1 text-sm text-[#f57b35]">Cargo é obrigatório</p>}
      </div>
      
      <div>
        <label htmlFor="area" className="block text-sm font-medium text-[#111827] mb-1">
          Área de Coordenação
        </label>
        <select 
          id="area" 
          name="area" 
          value={area} 
          onChange={handleChange} 
          className={`w-full px-4 py-2 border ${errors.area ? 'border-[#f57b35]' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003570] focus:border-transparent transition-all duration-200`} 
          disabled={loadingOptions}
        >
          <option value="">Selecione</option>
          {areas.map(area => <option key={area.id} value={area.value}>{area.value}</option>)}
        </select>
        {errors.area && <p className="mt-1 text-sm text-[#f57b35]">Área é obrigatória</p>}
      </div>
    </div>
  );
};

export default PositionFields;
