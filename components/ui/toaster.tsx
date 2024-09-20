'use client';
import { Toaster as Toast } from 'sonner';
import { useTheme } from 'next-themes';
export default function Toaster() {
  const { theme } = useTheme();
  if (typeof theme !== 'string') return null;
  return <Toast richColors theme={theme as 'light' | 'dark' | 'system'} />;
}
