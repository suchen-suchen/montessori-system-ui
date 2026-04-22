'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const user = data.user;

      if (!user || !user.role) {
        throw new Error('User role is missing');
      }

      localStorage.setItem('user', JSON.stringify(user));

      const access = user.dashboard_access || user.role;

      if (access === 'admin') {
        router.push('/admin/dashboard');
        return;
      }

      if (access === 'teacher') {
        router.push('/teacher/dashboard');
        return;
      }

      if (access === 'student') {
        router.push('/student/dashboard');
        return;
      }

      throw new Error('Unknown user role');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="flex items-center justify-center min-h-screen px-6 py-10 bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/background4.png')" }}
    >
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="SCMS Logo"
            width={180}
            height={180}
            className="h-auto w-36 drop-shadow-xl sm:w-44 md:w-48"
            priority
          />
        </div>

        <div className="relative w-full px-8 py-8 bg-white border border-gray-200 shadow-2xl rounded-2xl">
          <Link
            href="/"
            className="absolute text-blue-600 transition left-4 top-4 hover:text-blue-800"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>

          <h2 className="mb-6 text-2xl font-bold text-center text-blue-800">
            Login
          </h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-16 text-gray-800 bg-white border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-sm font-medium text-blue-600 -translate-y-1/2 right-4 top-1/2"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white transition bg-blue-700 rounded-lg shadow hover:bg-blue-800 disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}