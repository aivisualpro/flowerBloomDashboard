'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";

export default function RequireAdmin({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
        const admin = JSON.parse(localStorage.getItem('admin') || 'null');
        if (admin?.token) {
            setAuthorized(true);
        } else {
            router.push('/login');
        }
    } catch {
        router.push('/login');
    } finally {
        setChecking(false);
    }
  }, [router]);

  if (checking || !authorized) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-neutral-500 animate-pulse">Authenticating...</p>
        </div>
      ); 
  }

  return <>{children}</>;
}

