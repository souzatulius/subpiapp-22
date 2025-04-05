
import { useProblemsData } from './useProblemsData';
import { useProblemOperations } from './useProblemOperations';

export const useProblems = () => {
  const problemsData = useProblemsData();
  const problemOperations = useProblemOperations();

  return {
    ...problemsData,
    ...problemOperations,
  };
};

export * from './useProblemOperations';
export * from './useProblemsData';
export { type Problem, type Area, problemSchema } from './types';
