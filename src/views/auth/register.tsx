'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[100px]" />
            <div className="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-8 space-y-8 text-center">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    CREATE ACCOUNT
                </h1>
                <p className="text-neutral-400 font-medium">Join the Crunchy management team</p>
            </div>

            <form className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-cyan-400 transition-colors">
                            <User className="h-5 w-5" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Full Name"
                            required
                            className="bg-neutral-950 border-neutral-800 text-neutral-100 rounded-xl py-6 pl-10 focus-visible:ring-cyan-500/50 transition-all placeholder:text-neutral-600"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-cyan-400 transition-colors">
                            <Mail className="h-5 w-5" />
                        </div>
                        <Input
                            type="email"
                            placeholder="Email address"
                            required
                            className="bg-neutral-950 border-neutral-800 text-neutral-100 rounded-xl py-6 pl-10 focus-visible:ring-cyan-500/50 transition-all placeholder:text-neutral-600"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-cyan-400 transition-colors">
                            <Lock className="h-5 w-5" />
                        </div>
                        <Input
                            type="password"
                            placeholder="Password"
                            required
                            className="bg-neutral-950 border-neutral-800 text-neutral-100 rounded-xl py-6 pl-10 focus-visible:ring-cyan-500/50 transition-all placeholder:text-neutral-600"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold py-6 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] group"
                >
                    Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </form>

            <div className="pt-4">
                <p className="text-neutral-500 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
