
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Make sure 'Todos' is included
  const allCompanies = ['Todos', ...companies.filter(c => c !== 'Todos')];
  
  // Filter companies based on search term
  const filteredCompanies = allCompanies.filter(company => 
    searchTerm === '' || company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Empresas</label>
      
      <div className="flex items-center space-x-2 mb-2 relative">
        <Input
          placeholder="Buscar empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
        <Search className="h-4 w-4 absolute left-2.5 text-gray-400" />
      </div>
      
      <ScrollArea className="h-48 border rounded-md p-2">
        <div className="space-y-2">
          {filteredCompanies.map((company) => (
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
