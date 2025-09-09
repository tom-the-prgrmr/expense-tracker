import { useState, useEffect, useRef } from 'react';

interface DropdownPosition {
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  maxHeight?: string;
}

/**
 * Custom hook that calculates optimal dropdown position based on available screen space
 * @param isOpen - Whether the dropdown is currently open
 * @returns position and ref for the dropdown
 */
export const useDropdownPosition = (isOpen: boolean) => {
  const [position, setPosition] = useState<DropdownPosition>({ position: 'bottom-left' });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !buttonRef.current || !dropdownRef.current) return;

    const calculatePosition = () => {
      const button = buttonRef.current!;
      
      const buttonRect = button.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Dropdown dimensions (approximate)
      const dropdownWidth = 224; // w-56 = 14rem = 224px
      const dropdownHeight = 300; // Approximate height
      
      // Calculate available space
      const spaceRight = viewportWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;
      const spaceBottom = viewportHeight - buttonRect.bottom;
      const spaceTop = buttonRect.top;
      
      const newPosition: DropdownPosition = { position: 'bottom-left' };
      
      // Determine horizontal position
      if (spaceRight >= dropdownWidth) {
        // Enough space on the right, use left alignment
        newPosition.position = spaceBottom >= dropdownHeight ? 'bottom-left' : 'top-left';
      } else if (spaceLeft >= dropdownWidth) {
        // Not enough space on right, but enough on left
        newPosition.position = spaceBottom >= dropdownHeight ? 'bottom-right' : 'top-right';
      } else {
        // Not enough space on either side, use left alignment and adjust width
        newPosition.position = spaceBottom >= dropdownHeight ? 'bottom-left' : 'top-left';
        // We'll handle width adjustment in the component
      }
      
      // Calculate max height if needed
      const availableHeight = newPosition.position.startsWith('bottom') 
        ? spaceBottom - 8 // 8px for margin
        : spaceTop - 8;
      
      if (availableHeight < dropdownHeight) {
        newPosition.maxHeight = `${Math.max(200, availableHeight)}px`;
      }
      
      setPosition(newPosition);
    };

    // Calculate position immediately
    calculatePosition();
    
    // Recalculate on window resize
    const handleResize = () => calculatePosition();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  return { position, buttonRef, dropdownRef };
};
