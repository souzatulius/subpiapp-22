
import React from 'react';
import { AlertCircle, Search, Loader2, LockIcon } from 'lucide-react';

export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-10 space-y-4">
    <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
    <p className="text-gray-500">Carregando notas...</p>
  </div>
);

export const EmptyState = ({ message = "Nenhuma nota encontrada." }) => (
  <div className="flex flex-col items-center justify-center py-10 space-y-4">
    <AlertCircle className="h-10 w-10 text-gray-400" />
    <p className="text-gray-500">{message}</p>
  </div>
);

export const NoAccessState = () => (
  <div className="flex flex-col items-center justify-center py-10 space-y-4">
    <LockIcon className="h-10 w-10 text-gray-400" />
    <p className="text-gray-500">Você não tem permissão para acessar esta área.</p>
  </div>
);

export const SearchEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8 space-y-3">
    <Search className="h-8 w-8 text-gray-400" />
    <p className="text-gray-500">Nenhuma nota encontrada com os termos informados.</p>
  </div>
);
