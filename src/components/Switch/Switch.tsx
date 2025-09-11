import { type FC } from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch: FC<SwitchProps> = ({ checked, onChange, disabled }) => {
  return (
    <button
      type='button'
      aria-pressed={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 border focus:outline-none ${
        checked
          ? 'bg-[var(--theme-primary,#3b82f6)] border-transparent'
          : 'bg-gray-200 dark:bg-[var(--theme-border,#475569)] border-transparent'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
};

export default Switch;
