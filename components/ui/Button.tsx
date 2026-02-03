import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'text' | 'outlined';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'filled', 
  icon, 
  className = '', 
  disabled,
  ...props 
}) => {
  
  const baseStyles = "h-12 px-6 rounded-pill font-medium text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]";
  
  const variants = {
    filled: `bg-m3-primary text-white hover:shadow-m3-1 hover:bg-opacity-90 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none`,
    tonal: `bg-m3-secondary-container text-gray-900 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400`,
    text: `bg-transparent text-m3-primary hover:bg-m3-primary/10 disabled:text-gray-300`,
    outlined: `bg-transparent border border-m3-outline text-m3-primary hover:bg-m3-primary/5 disabled:border-gray-200 disabled:text-gray-300`
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};