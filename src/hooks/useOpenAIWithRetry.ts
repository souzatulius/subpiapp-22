
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface OpenAIOptions {
  maxRetries?: number;
  timeout?: number;
  onProgress?: (progress: number) => void;
}

export interface OpenAIResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  retry: () => Promise<T | null>;
}

export function useOpenAIWithRetry<T>(options: OpenAIOptions = {}): {
  callOpenAI: (endpoint: string, payload: any) => Promise<T | null>;
  isLoading: boolean;
  error: string | null;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { maxRetries = 3, timeout = 60000, onProgress } = options;

  const callOpenAI = useCallback(async (endpoint: string, payload: any): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    let retries = 0;
    let lastError: Error | null = null;
    
    // Progress simulation logic (will be replaced with real progress indicators from edge functions)
    let progressInterval: NodeJS.Timeout | null = null;
    if (onProgress) {
      let progress = 0;
      progressInterval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress > 95) progress = 95;
        onProgress(Math.min(progress, 95));
      }, 500);
    }

    try {
      while (retries <= maxRetries) {
        try {
          // Create an AbortController for timeout
          const controller = new AbortController();
          const signal = controller.signal;
          
          // Set timeout
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          
          const { data: responseData, error: supabaseError } = await supabase.functions.invoke(endpoint, {
            body: payload,
            signal
          });
          
          // Clear timeout
          clearTimeout(timeoutId);
          
          // If there's a Supabase error, throw it
          if (supabaseError) {
            throw new Error(`Supabase error: ${supabaseError.message}`);
          }
          
          // Clear progress interval
          if (progressInterval) {
            clearInterval(progressInterval);
            if (onProgress) onProgress(100); // Indicate completion
          }
          
          setIsLoading(false);
          return responseData as T;
        } catch (err: any) {
          lastError = err;
          
          // If this was an abort error (timeout)
          if (err.name === 'AbortError') {
            setError('A operação excedeu o tempo limite. Tente novamente.');
            break; // Don't retry on timeout
          }
          
          // Check if we should retry
          retries++;
          if (retries <= maxRetries) {
            // Exponential backoff: 1s, 2s, 4s, etc.
            const delay = 1000 * Math.pow(2, retries - 1);
            console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            break;
          }
        }
      }
      
      // If we get here and retries are exhausted, it's an error
      throw lastError || new Error('Erro desconhecido ao chamar OpenAI');
    } catch (err: any) {
      // Clear progress interval
      if (progressInterval) {
        clearInterval(progressInterval);
        if (onProgress) onProgress(0); // Reset progress on error
      }
      
      console.error('Error calling OpenAI:', err);
      setError(err.message || 'Erro ao processar sua solicitação');
      toast.error(`Erro na análise de IA: ${err.message || 'Erro desconhecido'}`);
      setIsLoading(false);
      return null;
    }
  }, [maxRetries, timeout, onProgress]);

  return {
    callOpenAI,
    isLoading,
    error
  };
}
