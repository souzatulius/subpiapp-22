import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  timeoutMs?: number;
}

export function useOpenAIWithRetry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callWithRetry = useCallback(
    async <T>(
      functionName: string,
      payload: any,
      options: RetryOptions = {}
    ): Promise<T | null> => {
      const {
        maxRetries = 3,
        baseDelay = 1000,
        timeoutMs = 30000,
      } = options;

      setIsLoading(true);
      setError(null);

      let attempts = 0;
      let lastError: any = null;

      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      try {
        while (attempts < maxRetries) {
          try {
            attempts++;
            
            const { data, error } = await supabase.functions.invoke(functionName, {
              body: payload,
              // Note: signal property isn't supported in FunctionInvokeOptions
            });

            // Clear the timeout since the request completed
            clearTimeout(timeoutId);

            if (error) {
              throw new Error(`Function error: ${error.message}`);
            }

            setIsLoading(false);
            return data as T;
          } catch (err: any) {
            lastError = err;
            
            // If aborted due to timeout
            if (err.name === 'AbortError') {
              throw new Error(`Request timed out after ${timeoutMs}ms`);
            }
            
            // If we've run out of retries, throw the error
            if (attempts >= maxRetries) {
              throw err;
            }
            
            // Otherwise, wait for a delay and retry
            const delay = baseDelay * Math.pow(2, attempts - 1);
            console.log(`Attempt ${attempts} failed. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        setError(err.message || 'An unknown error occurred');
        setIsLoading(false);
        console.error('Error calling OpenAI:', err);
        toast.error(`API Error: ${err.message || 'Failed to process request'}`);
        return null;
      }

      return null;
    },
    []
  );

  return {
    callWithRetry,
    isLoading,
    error,
  };
}
