import React from 'react';

export interface AlertProps {
  variant?: 'default' | 'success' | 'error' | 'warning';
  title?: string;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  children
}) => {
  const variantClasses = {
    default: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    error: 'bg-red-50 text-red-900 border-red-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${variantClasses[variant]}`}>
      {title && <h5 className="font-medium mb-2">{title}</h5>}
      <div>{children}</div>
    </div>
  );
};

export default Alert;