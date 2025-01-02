import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AnimatedAlertProps {
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const AnimatedAlert: React.FC<AnimatedAlertProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle2 className="text-green-500" />,
    error: <XCircle className="text-red-500" />,
    info: <Info className="text-blue-500" />,
    warning: <AlertCircle className="text-yellow-500" />
  };

  const variants = {
    success: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50',
    info: 'border-blue-500 bg-blue-50',
    warning: 'border-yellow-500 bg-yellow-50'
  };

  return (
    <Alert className={`transition-all duration-300 ${variants[type]}`}>
      <div className="flex items-center gap-2">
        {icons[type]}
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
      </div>
    </Alert>
  );
};