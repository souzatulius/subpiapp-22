
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A hook that parses the URL query parameters
 * @returns URLSearchParams object
 */
export const useQueryParams = (): URLSearchParams => {
  const { search } = useLocation();
  
  return useMemo(() => new URLSearchParams(search), [search]);
};
