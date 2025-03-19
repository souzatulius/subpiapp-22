
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingState: React.FC = () => (
  <div className="flex flex-col space-y-4">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">✓</div>
    <h3 className="text-lg font-medium text-gray-900">Nenhuma nota pendente</h3>
    <p className="mt-2 text-sm text-gray-500">
      Não há notas oficiais pendentes para aprovação.
    </p>
  </div>
);

export const NoAccessState: React.FC = () => (
  <div className="text-center py-12">
    <div className="mx-auto h-12 w-12 text-yellow-400 mb-4">⚠️</div>
    <h3 className="text-lg font-medium text-gray-900">Acesso restrito</h3>
    <p className="mt-2 text-sm text-gray-500">
      Você não tem permissão para aprovar notas oficiais.
    </p>
  </div>
);
