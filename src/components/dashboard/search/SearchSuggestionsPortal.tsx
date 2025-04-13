
import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SearchSuggestion } from './SearchInput';

interface SearchSuggestionsPortalProps {
  suggestions: SearchSuggestion[];
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onSelect: (suggestion: SearchSuggestion) => void;
}

const SearchSuggestionsPortal: React.FC<SearchSuggestionsPortalProps> = ({
  suggestions,
  isOpen,
  anchorRef,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create portal container if it doesn't exist
  useEffect(() => {
    if (!document.getElementById('search-suggestions-portal')) {
      const portalContainer = document.createElement('div');
      portalContainer.id = 'search-suggestions-portal';
      document.body.appendChild(portalContainer);
    }
    
    return () => {
      const portalContainer = document.getElementById('search-suggestions-portal');
      if (portalContainer && portalContainer.childNodes.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, []);
  
  // Position the suggestions based on the anchor element
  useEffect(() => {
    if (isOpen && anchorRef.current && containerRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Position below the search input
      containerRef.current.style.position = 'fixed';
      containerRef.current.style.top = `${anchorRect.bottom + window.scrollY}px`;
      containerRef.current.style.left = `${anchorRect.left + window.scrollX}px`;
      containerRef.current.style.width = `${anchorRect.width}px`;
      containerRef.current.style.zIndex = '100';
    }
  }, [isOpen, anchorRef, suggestions]);
  
  if (!isOpen || suggestions.length === 0) {
    return null;
  }
  
  const portal = document.getElementById('search-suggestions-portal');
  
  if (!portal) return null;
  
  return createPortal(
    <div 
      ref={containerRef}
      className="bg-white mt-1 rounded-lg border border-gray-200 shadow-lg overflow-hidden"
    >
      <ul className="py-2">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => onSelect(suggestion)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <div className="text-sm font-medium text-gray-800">{suggestion.title}</div>
          </li>
        ))}
      </ul>
    </div>,
    portal
  );
};

export default SearchSuggestionsPortal;
