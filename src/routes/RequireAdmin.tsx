'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import axios from 'axios';
import { useDashboardStore } from '@/store/useDashboardStore';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const init = useDashboardStore(state => state.init);
  const isInitialized = useDashboardStore(state => state.isInitialized);

  useEffect(() => {
    let _token = '';
    try {
        const admin = JSON.parse(localStorage.getItem('admin') || 'null');
        if (admin?.token) {
            _token = admin.token;
            axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
            setAuthorized(true);
        } else {
            router.push('/login');
        }
    } catch {
        router.push('/login');
    } finally {
        if (_token) {
           init().then(() => setChecking(false)).catch(() => setChecking(false));
        } else {
           setChecking(false);
        }
    }
  }, [router, init]);

  if (checking || !authorized || !isInitialized) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-neutral-500 animate-pulse">Loading Application Context...</p>
        </div>
      ); 
  }

  return <>{children}</>;
}

