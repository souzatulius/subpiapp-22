
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { OS156FilterOptions, OrderStatus, District } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActiveFilterBadgesProps {
  filters: OS156FilterOptions;
  onAreaTecnicaChange: (value: 'Todos' | 'STM' | 'STLP') => void;
  onStatusChange: (statuses: OrderStatus[]) => void;
  onDistrictChange: (districts: District[]) => void;
  onCompanyChange: (companies: string[]) => void;
  onDateChange: (field: 'dataInicio' | 'dataFim', date?: Date) => void;
}

const ActiveFilterBadges: React.FC<ActiveFilterBadgesProps> = ({
  filters,
  onAreaTecnicaChange,
  onStatusChange,
  onDistrictChange,
  onCompanyChange,
  onDateChange
}) => {
  const { statuses, districts, empresa, areaTecnica, dataInicio, dataFim } = filters;
  
  // Handle removing a status
  const handleRemoveStatus = (status: OrderStatus) => {
    const newStatuses = statuses.filter(s => s !== status);
    if (newStatuses.length === 0) {
      onStatusChange(['Todos' as OrderStatus]);
    } else {
      onStatusChange(newStatuses);
    }
  };
  
  // Handle removing a district
  const handleRemoveDistrict = (district: District) => {
    const newDistricts = districts.filter(d => d !== district);
    if (newDistricts.length === 0) {
      onDistrictChange(['Todos' as District]);
    } else {
      onDistrictChange(newDistricts);
    }
  };
  
  // Handle removing a company
  const handleRemoveCompany = (company: string) => {
    const newCompanies = empresa.filter(c => c !== company);
    if (newCompanies.length === 0) {
      onCompanyChange(['Todos']);
    } else {
      onCompanyChange(newCompanies);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {/* Area Tecnica badge */}
      {areaTecnica !== 'Todos' && (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          Área Técnica: {areaTecnica}
          <X 
            className="ml-1 h-3 w-3 cursor-pointer" 
            onClick={() => onAreaTecnicaChange('Todos')}
          />
        </Badge>
      )}
      
      {/* Status badges */}
      {(!statuses.includes('Todos' as OrderStatus)) && statuses.map(status => (
        <Badge key={status} variant="outline" className="bg-orange-100 text-orange-800">
          Status: {status}
          <X 
            className="ml-1 h-3 w-3 cursor-pointer" 
            onClick={() => handleRemoveStatus(status)}
          />
        </Badge>
      ))}
      
      {/* District badges */}
      {(!districts.includes('Todos' as District)) && districts.map(district => (
        <Badge key={district} variant="outline" className="bg-green-100 text-green-800">
          Distrito: {district}
          <X 
            className="ml-1 h-3 w-3 cursor-pointer" 
            onClick={() => handleRemoveDistrict(district)}
          />
        </Badge>
      ))}
      
      {/* Company badges */}
      {(!empresa.includes('Todos')) && empresa.map(company => (
        <Badge key={company} variant="outline" className="bg-purple-100 text-purple-800">
          Empresa: {company}
          <X 
            className="ml-1 h-3 w-3 cursor-pointer" 
            onClick={() => handleRemoveCompany(company)}
          />
        </Badge>
      ))}
      
      {/* Date badges */}
      {dataInicio && (
        <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
          De: {format(dataInicio, 'dd/MM/yyyy', { locale: ptBR })}
          <X 
            className="ml-1 h-3 w-3 cursor-pointer" 
            onClick={() => onDateChange('dataInicio', undefined)}
          />
        </Badge>
      )}
      
      {dataFim && (
        <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
          Até: {format(dataFim, 'dd/MM/yyyy', { locale: ptBR })}
          <X 
            className="ml-1 h-3 w-3 cursor-pointer" 
            onClick={() => onDateChange('dataFim', undefined)}
          />
        </Badge>
      )}
    </div>
  );
};

export default ActiveFilterBadges;
