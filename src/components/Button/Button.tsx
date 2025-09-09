import { type ButtonHTMLAttributes, type FC, type ReactNode, memo } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2 rounded-xl',
  lg: 'text-base px-5 py-3 rounded-2xl',
};

const Button: FC<ButtonProps> = memo(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  className = '',
  leadingIcon,
  trailingIcon,
  ...rest
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none border';

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--theme-primary)',
      color: '#ffffff',
      borderColor: 'var(--theme-primary)'
    },
    secondary: {
      backgroundColor: 'var(--theme-surface-secondary)',
      color: 'var(--theme-text)',
      borderColor: 'var(--theme-border)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--theme-text)',
      borderColor: 'transparent'
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      borderColor: '#ef4444'
    }
  };

  const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: { filter: 'brightness(1.05)' },
    secondary: { backgroundColor: 'var(--theme-border)' },
    ghost: { backgroundColor: 'var(--theme-surface-secondary)' },
    danger: { filter: 'brightness(1.05)' }
  };

  return (
    <button
      {...rest}
      disabled={disabled}
      className={[
        base,
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md active:scale-[0.99]'
      ].join(' ').concat(className ? ` ${className}` : '')}
      style={variantStyles[variant]}
      onMouseEnter={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        const styles = hoverStyles[variant];
        Object.assign(el.style, styles);
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        const el = e.currentTarget;
        Object.assign(el.style, variantStyles[variant]);
      }}
    >
      {leadingIcon ? <span className="inline-flex items-center text-current">{leadingIcon}</span> : null}
      <span className="truncate">{children}</span>
      {trailingIcon ? <span className="inline-flex items-center text-current">{trailingIcon}</span> : null}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;


