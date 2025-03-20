
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const LoadingState: React.FC = () => (
  <div className="flex flex-col space-y-4">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
      <CheckCircle className="h-6 w-6 text-green-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900">Nenhuma nota pendente</h3>
    <p className="mt-2 text-sm text-gray-500">
      Não há notas oficiais pendentes para aprovação no momento.
    </p>
    <p className="mt-1 text-sm text-gray-500">
      As notas aparecerão aqui quando criadas pelos usuários.
    </p>
  </div>
);

export const NoAccessState: React.FC = () => (
  <div className="text-center py-12">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
      <AlertTriangle className="h-6 w-6 text-yellow-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900">Acesso restrito</h3>
    <p className="mt-2 text-sm text-gray-500">
      Você não tem permissão para aprovar notas oficiais.
    </p>
    <p className="mt-1 text-sm text-gray-500">
      Entre em contato com um administrador para solicitar acesso.
    </p>
  </div>
);

export const SearchEmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
      <Clock className="h-6 w-6 text-gray-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900">Nenhuma nota encontrada</h3>
    <p className="mt-2 text-sm text-gray-500">
      Nenhuma nota corresponde aos critérios de busca informados.
    </p>
    <p className="mt-1 text-sm text-gray-500">
      Tente usar termos mais gerais ou verifique a ortografia.
    </p>
  </div>
);
