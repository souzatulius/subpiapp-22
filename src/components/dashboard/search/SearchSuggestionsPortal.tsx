
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';

interface SearchSuggestion {
  title: string;
  route: string;
}

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
  const portalRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Create portal container if it doesn't exist
    if (!document.getElementById('search-suggestions-portal')) {
      const portalContainer = document.createElement('div');
      portalContainer.id = 'search-suggestions-portal';
      portalContainer.style.position = 'absolute'; // Changed from 'fixed' to 'absolute'
      portalContainer.style.zIndex = '9999';
      document.body.appendChild(portalContainer);
    }
    
    portalRef.current = document.getElementById('search-suggestions-portal') as HTMLDivElement;
    
    return () => {
      // Cleanup function - remove portal container when component unmounts
      const container = document.getElementById('search-suggestions-portal');
      if (container && container.childElementCount === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !anchorRef.current || !portalRef.current) return;
    
    const updatePosition = () => {
      if (!anchorRef.current || !portalRef.current) return;
      
      const rect = anchorRef.current.getBoundingClientRect();
      
      // Position the portal based on the anchor's position
      portalRef.current.style.top = `${window.scrollY + rect.bottom}px`;
      portalRef.current.style.left = `${rect.left}px`;
      portalRef.current.style.width = `${rect.width}px`;
      // Remove the height and pointer-events style that was blocking interaction
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, anchorRef]);

  if (!isOpen || !portalRef.current) return null;
  
  return createPortal(
    <div className="mt-1 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden max-h-64 overflow-y-auto">
      <ul className="py-1">
        {suggestions.map((suggestion, i) => (
          <li
            key={i}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-base font-medium"
            onMouseDown={() => onSelect(suggestion)}
          >
            <div className="flex-grow">
              <div className="font-medium text-gray-700">{suggestion.title}</div>
            </div>
            <div className="text-gray-400">
              <Search className="h-5 w-5" />
            </div>
          </li>
        ))}
      </ul>
    </div>,
    portalRef.current
  );
};

export default SearchSuggestionsPortal;
