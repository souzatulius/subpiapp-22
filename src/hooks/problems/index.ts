
import { useProblemsData } from './useProblemsData';
import { useProblemOperations } from './useProblemOperations';

// Create compatibility hook for ease of use
export const useProblems = () => {
  const problemsData = useProblemsData();
  const problemOperations = useProblemOperations(problemsData.refetch);
  
  return {
    ...problemsData,
    ...problemOperations
  };
};

export { 
  useProblemsData,
  useProblemOperations 
};

export type { Problem, Area } from './types';
export { problemSchema } from './types';
