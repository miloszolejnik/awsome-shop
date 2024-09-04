import { CheckCircle } from 'lucide-react';

export const FormSucces = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-teal-400 text-secondary-foreground p-3 rounded-md">
      <CheckCircle className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};
