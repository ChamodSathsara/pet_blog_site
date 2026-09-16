'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const router = useRouter(); const search = useSearchParams();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  return <form className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm" onSubmit={async(e)=>{e.preventDefault();setLoading(true);setError('');const result=await signIn('credentials',{email,password,redirect:false});setLoading(false);if(result?.error)setError('Invalid email or password.');else{router.push(search.get('callbackUrl') || '/admin');router.refresh();}}}>
    <h1 className="font-serif text-3xl font-semibold">Admin login</h1><p className="mt-2 text-muted-foreground">Sign in to manage Housewise Journal.</p>
    <label className="mt-6 block text-sm font-medium">Email</label><Input className="mt-2 h-11" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} />
    <label className="mt-4 block text-sm font-medium">Password</label><Input className="mt-2 h-11" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} />
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<Button className="mt-6 w-full" size="lg" disabled={loading}>{loading?'Signing in…':'Sign in'}</Button>
  </form>;
}
