
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

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
  // Make sure 'Todos' is included
  const allCompanies = ['Todos', ...companies.filter(c => c !== 'Todos')];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Empresas</label>
      <ScrollArea className="h-48 border rounded-md p-2">
        <div className="space-y-2">
          {allCompanies.map((company) => (
            <div key={company} className="flex items-center space-x-2">
              <Checkbox 
                id={`company-${company}`}
                checked={selectedCompanies.includes(company)}
                onCheckedChange={() => onCompanyChange(company)}
              />
              <label 
                htmlFor={`company-${company}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {company}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CompanyFilter;
