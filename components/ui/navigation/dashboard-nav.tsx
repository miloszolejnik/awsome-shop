'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardNav({
  allLinks,
}: {
  allLinks: { lable: string; path: string; icon: React.ReactNode }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="py-2 overflow-auto">
      <ul className="flex gap-6 text-xs font-semibold">
        <AnimatePresence>
          {allLinks.map((link) => (
            <motion.li whileTap={{ scale: 0.95 }} key={link.lable}>
              <Link
                href={link.path}
                className={cn(
                  'flex gap-1 flex-col items-center relative',
                  pathname === link.path && 'text-primary'
                )}
              >
                {link.icon}
                <span>{link.lable}</span>
                {pathname === link.path ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: 'spring', stiffness: 35 }}
                    className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
