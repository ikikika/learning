import styles from './Button.module.scss';
import type { ButtonProps } from './types';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const className = [
    styles.button,
    variant === 'secondary' ? styles.secondary : '',
    variant === 'ghost' ? styles.ghost : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
