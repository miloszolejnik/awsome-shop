'use server';

import DashboardNav from '@/components/ui/navigation/dashboard-nav';
import { auth } from '@/server/auth';
import { BarChart, Package, PenSquare, Settings, Truck } from 'lucide-react';
export default async function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const userLinks = [
    {
      lable: 'Orders',
      path: '/dashboard/orders',
      icon: <Truck size={16} />,
    },
    {
      lable: 'Settings',
      path: '/dashboard/settings',
      icon: <Settings size={16} />,
    },
  ] as const;

  const adminLinks =
    session?.user?.role === 'admin'
      ? [
          {
            lable: 'Analytics',
            path: '/dashboard/analytics',
            icon: <BarChart size={16} />,
          },
          {
            lable: 'Products',
            path: '/dashboard/products',
            icon: <PenSquare size={16} />,
          },
          {
            lable: 'AddProduct',
            path: '/dashboard/add-product',
            icon: <Package size={16} />,
          },
        ]
      : [];

  const allLinks = [...userLinks, ...adminLinks];

  return (
    <div>
      <DashboardNav allLinks={allLinks} />
      {children}
    </div>
  );
}
