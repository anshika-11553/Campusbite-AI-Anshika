import React from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { PageContainer } from './PageContainer';
import { UserRole } from '@/types/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  title: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, title }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar role={role} title={title} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
};
