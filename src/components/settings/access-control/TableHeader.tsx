
import React from 'react';
import { Permission } from './types';

interface TableHeaderProps {
  permissions: Permission[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ permissions }) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Coordenação/Supervisão
        </th>
        {permissions.map(permission => (
          <th 
            key={permission.id} 
            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            title={permission.description}
          >
            {permission.name}
          </th>
        ))}
        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Ações
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
