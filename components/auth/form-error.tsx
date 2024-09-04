import { AlertCircle } from 'lucide-react';

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/25 text-xs font-medium text-secondary-foreground flex items-center gap-2 p-3 my-4 rounded-md">
      <AlertCircle className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};
