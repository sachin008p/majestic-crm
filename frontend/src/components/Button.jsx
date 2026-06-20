import React from 'react';
import classNames from 'classnames';

/**
 * Reusable Button component
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' (default: 'primary')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - disabled: boolean
 * - onClick: function
 * - children: ReactNode
 */
export default function Button({ variant = 'primary', size = 'md', disabled = false, onClick, children, ...rest }) {
  const base = 'font-medium rounded-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 disabled:bg-primary-300',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 disabled:bg-secondary-300',
    danger: 'bg-danger text-white hover:bg-danger-600 disabled:bg-danger-300',
  };
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type="button"
      className={classNames(base, variants[variant], sizes[size], { 'opacity-50 cursor-not-allowed': disabled })}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
