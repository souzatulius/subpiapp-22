
import { useState, useEffect } from 'react';

const RECENT_SEARCHES_KEY = 'dashboard_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load saved searches on component mount
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches(prevSearches => {
      const trimmedQuery = query.trim();
      // Remove the query if it already exists (to avoid duplicates)
      const filteredSearches = prevSearches.filter(s => s.toLowerCase() !== trimmedQuery.toLowerCase());
      
      // Add the new query at the beginning of the array
      const updatedSearches = [trimmedQuery, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);
      
      // Save to localStorage
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
      } catch (error) {
        console.error('Failed to save recent search:', error);
      }
      
      return updatedSearches;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  };

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches
  };
};
