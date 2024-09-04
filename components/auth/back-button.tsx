'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const BackButton = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <div className="flex w-full">
      <Button
        asChild
        variant={'link'}
        className="flex w-full gap-2 justify-center align-middle items-center"
      >
        <Link
          className="flex gap-2 justify-center align-middle items-center"
          aria-label={label}
          href={href}
        >
          <ArrowLeft size={16} />
          <span>{label}</span>
        </Link>
      </Button>
    </div>
  );
};
