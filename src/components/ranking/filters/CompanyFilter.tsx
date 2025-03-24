
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CompanyFilterProps {
  companies: string[];
  selectedCompanies: string[];
  onCompanyChange: (company: string) => void;
}

const CompanyFilter: React.FC<CompanyFilterProps> = ({
  companies,
  selectedCompanies,
  onCompanyChange
}) => {
  if (companies.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Empresas</label>
      <div className="max-h-20 overflow-y-auto">
        <div className="flex flex-wrap gap-1">
          <Badge
            variant={selectedCompanies.includes('Todos') ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedCompanies.includes('Todos') ? 'bg-orange-500 hover:bg-orange-600' : ''
            }`}
            onClick={() => onCompanyChange('Todos')}
          >
            Todas
          </Badge>
          {companies.map((company) => (
            <Badge
              key={company}
              variant={selectedCompanies.includes(company) ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedCompanies.includes(company) ? 'bg-orange-500 hover:bg-orange-600' : ''
              }`}
              onClick={() => onCompanyChange(company)}
            >
              {company}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyFilter;
