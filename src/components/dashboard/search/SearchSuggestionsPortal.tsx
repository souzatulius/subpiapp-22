
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
      portalContainer.style.position = 'fixed';
      portalContainer.style.zIndex = '9999';
      portalContainer.style.pointerEvents = 'none';
      document.body.appendChild(portalContainer);
    }
    
    portalRef.current = document.getElementById('search-suggestions-portal') as HTMLDivElement;
    
    return () => {
      // Cleanup function (optional)
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !anchorRef.current || !portalRef.current) return;
    
    const updatePosition = () => {
      if (!anchorRef.current || !portalRef.current) return;
      
      const rect = anchorRef.current.getBoundingClientRect();
      portalRef.current.style.top = '0';
      portalRef.current.style.left = '0';
      portalRef.current.style.width = '100%';
      portalRef.current.style.height = '100%';
      portalRef.current.style.pointerEvents = isOpen ? 'auto' : 'none';
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
    <div 
      className="pointer-events-auto"
      style={{
        position: 'absolute',
        top: anchorRef.current?.getBoundingClientRect().bottom + 'px',
        left: anchorRef.current?.getBoundingClientRect().left + 'px',
        width: anchorRef.current?.getBoundingClientRect().width + 'px',
      }}
    >
      <div className="mt-1 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <ul className="py-1 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, i) => (
            <li
              key={i}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-xl font-medium"
              onMouseDown={() => onSelect(suggestion)}
            >
              <div className="flex-grow">
                <div className="font-medium text-gray-700">{suggestion.title}</div>
              </div>
              <div className="text-gray-400">
                <Search className="h-6 w-6" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    portalRef.current
  );
};

export default SearchSuggestionsPortal;
