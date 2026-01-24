'use client';

import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import RequireAdmin from '../../routes/RequireAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <RequireAdmin>
      <SidebarProvider>
        <div className="flex h-screen bg-neutral-50 w-full overflow-hidden">
          <AppSidebar />
          <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            {/* Header */}


            {/* Page Content */}
            <div className="p-6 md:p-8 flex-1 overflow-auto max-w-[1600px] mx-auto w-full">
                {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </RequireAdmin>
  );
}

