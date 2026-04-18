'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem('admin');

    if (!admin) {
      router.push('/admin/login');
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-800">
        Admin Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome! You are now logged in.
      </p>
    </div>
  );
}