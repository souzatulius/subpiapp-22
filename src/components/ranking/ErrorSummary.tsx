
import React from 'react';
import { ValidationError } from '@/hooks/ranking/types/uploadTypes';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorSummaryProps {
  errors: ValidationError[];
  maxErrors?: number;
}

const ErrorSummary: React.FC<ErrorSummaryProps> = ({ 
  errors, 
  maxErrors = 10 
}) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  // Group errors by type for a summary
  const errorsByType: Record<string, number> = {};
  errors.forEach(error => {
    const type = `${error.column}: ${error.message}`;
    errorsByType[type] = (errorsByType[type] || 0) + 1;
  });

  // Sort by frequency
  const sortedErrorTypes = Object.entries(errorsByType)
    .sort((a, b) => b[1] - a[1]);

  const displayErrors = errors.slice(0, maxErrors);
  const hasMoreErrors = errors.length > maxErrors;

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <div className="flex items-start space-x-2">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-amber-800">
            {errors.length} {errors.length === 1 ? 'erro' : 'erros'} de validação encontrado{errors.length !== 1 ? 's' : ''}
          </h3>
          
          {/* Error type summary */}
          <div className="mt-2 space-y-1">
            <p className="text-sm text-amber-700 font-medium">Resumo por tipo de erro:</p>
            <ul className="text-xs text-amber-700 space-y-1 pl-1">
              {sortedErrorTypes.map(([type, count]) => (
                <li key={type}>• {type}: {count} {count === 1 ? 'ocorrência' : 'ocorrências'}</li>
              ))}
            </ul>
          </div>
          
          {/* Detailed error list */}
          <div className="mt-3">
            <p className="text-sm text-amber-700 font-medium">
              {displayErrors.length > 0 ? 'Exemplos de erros:' : 'Nenhum exemplo disponível'}
            </p>
            <ul className="text-xs text-amber-700 space-y-1 mt-1 pl-1">
              {displayErrors.map((error, index) => (
                <li key={index}>
                  • Linha {error.row}: {error.column} - {error.message}
                  {error.value ? ` (valor: "${error.value}")` : ''}
                </li>
              ))}
              {hasMoreErrors && (
                <li className="text-amber-600 font-medium">
                  ... e mais {errors.length - maxErrors} erro(s)
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ErrorSummary;
