import { forwardRef, type InputHTMLAttributes } from 'react';

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  containerClassName?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      label,
      helperText,
      error,
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
        <input
          id={id}
          ref={ref}
          disabled={disabled}
          className={
            `w-full px-3.5 py-2.5 rounded-xl outline-none transition-colors ` +
            // Background & text for light and dark
            `bg-white text-gray-900 ` +
            `dark:bg-[var(--theme-surface-secondary,#334155)] dark:text-[var(--theme-text,#ffffff)] ` +
            // Placeholder colors
            `placeholder:text-gray-400 ` +
            `dark:placeholder:text-[var(--theme-text-muted,#94a3b8)] ` +
            // Borders for light and dark + error state
            `border ${
              hasError
                ? 'border-accent-red'
                : 'border-gray-300 dark:border-[var(--theme-border,#475569)]'
            } ` +
            // Disabled & focus
            `${
              disabled
                ? 'opacity-60 cursor-not-allowed'
                : 'focus:border-[var(--theme-primary,#3b82f6)]'
            } ` +
            `${className}`
          }
          {...props}
        />
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

TextInput.displayName = 'TextInput';

export default TextInput;
