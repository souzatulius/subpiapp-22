
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 max-w-md">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Ocorreu um erro</h2>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar este conteúdo corretamente.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-amber-300 bg-white hover:bg-amber-50"
            >
              Atualizar página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
