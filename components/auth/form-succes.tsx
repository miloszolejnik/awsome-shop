import { CheckCircle } from 'lucide-react';

export const FormSucces = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-teal-400/25 text-xs font-medium text-secondary-foreground p-3 my-4 rounded-md flex items-center gap-2">
      <CheckCircle className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};
