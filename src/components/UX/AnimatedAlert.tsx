import { Alert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface AnimatedAlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

export const AnimatedAlert = ({ children, variant = 'default', className }: AnimatedAlertProps) => {
  return (
    <Alert variant={variant} className={cn('transition-all duration-300 ease-in-out', className)}>
      {children}
    </Alert>
  );
};
