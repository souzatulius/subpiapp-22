
import { useProblemsData } from './useProblemsData';
import { useProblemOperations } from './useProblemOperations';
import { Problem, Area, problemSchema } from './types';

export function useProblems() {
  const { problems, areas, loading, fetchProblems } = useProblemsData();
  const { isSubmitting, addProblem, updateProblem, deleteProblem } = useProblemOperations(fetchProblems);

  return {
    problems,
    areas,
    loading,
    isSubmitting,
    addProblem,
    updateProblem,
    deleteProblem
  };
}

export { problemSchema };
export type { Problem, Area };
