import React from 'react';
import { Alert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface AnimatedAlertProps {
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const AnimatedAlert: React.FC<AnimatedAlertProps> = ({ 
  type,
  title, 
  message,
  onClose
}) => {
  return (
    <Alert 
      variant={type === 'error' ? 'destructive' : 'default'}
      className={cn('transition-all duration-300 ease-in-out')}
      onClose={onClose}
    >
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm">{message}</p>
    </Alert>
  );
};