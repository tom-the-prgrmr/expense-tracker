import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Custom hook that detects clicks outside of a referenced element
 * @param callback - Function to call when clicking outside
 * @param excludeRefs - Optional array of refs to exclude from outside click detection
 * @returns ref - React ref to attach to the element you want to detect clicks outside of
 */
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  callback: () => void,
  excludeRefs?: RefObject<HTMLElement | null>[]
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is inside the main element
      if (ref.current && !ref.current.contains(target)) {
        // Check if click is inside any excluded elements
        const isInsideExcluded = excludeRefs?.some(excludeRef => 
          excludeRef.current && excludeRef.current.contains(target)
        );
        
        if (!isInsideExcluded) {
          callback();
        }
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, excludeRefs]);

  return ref;
};
