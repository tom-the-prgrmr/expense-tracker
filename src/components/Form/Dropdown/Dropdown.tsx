import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: DropdownOption[];
  placeholder?: string;
  error?: string | boolean;
  helperText?: string;
  containerClassName?: string;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  (
    {
      id,
      label,
      options,
      placeholder,
      error,
      helperText,
      className = '',
      containerClassName = '',
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={id}
            className='block mb-1.5 text-sm font-medium text-secondary'
          >
            {label}
            {required ? <span className='text-accent-red ml-1'>*</span> : null}
          </label>
        )}
        <div className={`relative`}>
          <select
            id={id}
            ref={ref}
            disabled={disabled}
            className={
              `w-full appearance-none px-3.5 py-2.5 rounded-xl outline-none transition-colors ` +
              `bg-[var(--theme-surface-secondary,#334155)] text-[var(--theme-text,#ffffff)] ` +
              `border ${
                hasError
                  ? 'border-accent-red'
                  : 'border-[var(--theme-border,#475569)]'
              } ` +
              `${
                disabled
                  ? 'opacity-60 cursor-not-allowed'
                  : 'focus:border-[var(--theme-primary,#3b82f6)]'
              } ` +
              `${className}`
            }
            {...props}
          >
            {placeholder ? (
              <option value='' disabled hidden>
                {placeholder}
              </option>
            ) : null}
            {options.map((opt) => (
              <option
                key={String(opt.value)}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted'>
            ▾
          </span>
        </div>
        {(helperText || hasError) && (
          <p
            className={`mt-1 text-xs ${
              hasError ? 'text-accent-red' : 'text-muted'
            }`}
          >
            {hasError && typeof error === 'string' ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
