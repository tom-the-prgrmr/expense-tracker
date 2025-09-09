import { type FC, useState, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useDropdownPosition } from '@/hooks/useDropdownPosition';
import { type ThemeColor, themeColors } from '@/config/themes';

const ThemeSwitcher: FC = () => {
  const { theme, setThemeMode, setThemeColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { position, buttonRef, dropdownRef: positionRef } = useDropdownPosition(isOpen);
  const clickOutsideRef = useOnClickOutside<HTMLDivElement>(() => setIsOpen(false), [buttonRef]);
  
  // Combined ref for dropdown
  const dropdownRef = useCallback((node: HTMLDivElement | null) => {
    positionRef.current = node;
    clickOutsideRef.current = node;
  }, [positionRef, clickOutsideRef]);

  const toggleThemeMode = () => {
    setThemeMode(theme.mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border"
        style={{
          backgroundColor: 'var(--theme-surface-secondary)',
          borderColor: 'var(--theme-border)',
          color: 'var(--theme-text)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--theme-border)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--theme-surface-secondary)';
        }}
        aria-label="Change theme"
      >
        <span className="text-lg">
          {theme.mode === 'dark' ? '🌙' : '☀️'}
        </span>
        <span className="text-sm font-medium text-primary hidden sm:block">
          {theme.mode === 'dark' ? 'Dark' : 'Light'}
        </span>
        <svg
          className={`w-4 h-4 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`absolute backdrop-blur-md border rounded-xl shadow-lg w-56 ${
            position.position === 'bottom-left' ? 'top-full left-0 mt-2' :
            position.position === 'bottom-right' ? 'top-full right-0 mt-2' :
            position.position === 'top-left' ? 'bottom-full left-0 mb-2' :
            'bottom-full right-0 mb-2'
          }`}
          style={{ 
            zIndex: 9999,
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
            maxHeight: position.maxHeight,
            overflowY: position.maxHeight ? 'auto' : 'visible'
          }}
        >
            <div className="p-3">
              {/* Theme Mode Toggle */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Theme Mode
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleThemeMode}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: theme.mode === 'dark' ? 'var(--theme-primary)' : 'var(--theme-surface-secondary)',
                      color: theme.mode === 'dark' ? 'white' : 'var(--theme-text)'
                    }}
                  >
                    <span className="text-lg">🌙</span>
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  <button
                    onClick={toggleThemeMode}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: theme.mode === 'light' ? 'var(--theme-primary)' : 'var(--theme-surface-secondary)',
                      color: theme.mode === 'light' ? 'white' : 'var(--theme-text)'
                    }}
                  >
                    <span className="text-lg">☀️</span>
                    <span className="text-sm font-medium">Light</span>
                  </button>
                </div>
              </div>

              {/* Accent Colors */}
              <div>
                <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Accent Color
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themeColors).map(([key, themeColor]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setThemeColor(key as ThemeColor);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: theme.color === key ? 'var(--theme-primary)' : 'var(--theme-surface-secondary)',
                        color: theme.color === key ? 'white' : 'var(--theme-text)'
                      }}
                      onMouseEnter={(e) => {
                        if (theme.color !== key) {
                          e.currentTarget.style.backgroundColor = 'var(--theme-border)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (theme.color !== key) {
                          e.currentTarget.style.backgroundColor = 'var(--theme-surface-secondary)';
                        }
                      }}
                    >
                      <span className="text-sm">{themeColor.icon}</span>
                      <span className="text-xs font-medium">
                        {themeColor.name}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ 
                          backgroundColor: themeColor.light.primary,
                          borderColor: 'var(--theme-border)'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
