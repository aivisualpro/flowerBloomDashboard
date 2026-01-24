'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FeatherIcon from 'feather-icons-react';
import { API_BASE_URL } from '@/config';

export default function SignIn1() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) {
      setErr('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // harmless; keeps future flexibility
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || 'Login failed');
      }

      // Save to localStorage with key 'admin'
      // Expected shape from your backend: { success, message, token, data: user }
      localStorage.setItem('admin', JSON.stringify({
        token: data?.token || '',
        user: data?.data || null
      }));

      // (Optional) set default auth header for future fetch/axios if you use axios.
      // axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      router.push('/'); // change to '/dashboard' if needed
    } catch (e) {
      setErr(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[100px]" />
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-8 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    CRUNCHY COOKIES
                </h1>
                <p className="text-neutral-400">Welcome back, admin</p>
            </div>

            {err && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
                    {err}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-cyan-400 transition-colors">
                            <FeatherIcon icon="mail" size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-neutral-600"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-cyan-400 transition-colors">
                            <FeatherIcon icon="lock" size={18} />
                        </div>
                        <input
                            type={showPwd ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-neutral-600"
                        />
                         <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                        >
                            <FeatherIcon icon={showPwd ? 'eye-off' : 'eye'} size={18} />
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-medium py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                     {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
