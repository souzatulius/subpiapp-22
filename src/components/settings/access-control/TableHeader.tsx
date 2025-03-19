
import React from 'react';
import { Permission } from './types';

interface TableHeaderProps {
  permissions: Permission[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ permissions }) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Usuário
        </th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Contato
        </th>
        {permissions.map((permission) => (
          <th key={permission.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            {permission.descricao} (Nível: {permission.nivel_acesso})
          </th>
        ))}
        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Ações
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
