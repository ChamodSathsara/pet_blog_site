import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LoginForm } from './LoginForm';
export default async function LoginPage() { if (await auth()) redirect('/admin'); return <div className="flex min-h-screen items-center justify-center bg-sand p-6"><LoginForm /></div>; }
