'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

type EnrollmentRow = {
  id: number;
};

const verses = [
  '“I can do all things through Christ who strengthens me.” – Philippians 4:13',
  '“Trust in the Lord with all your heart and lean not on your own understanding.” – Proverbs 3:5',
  '“Let all that you do be done in love.” – 1 Corinthians 16:14',
  '“The Lord is my shepherd; I shall not want.” – Psalm 23:1',
  '“Be strong and courageous. Do not be afraid.” – Joshua 1:9',
  '“Commit to the Lord whatever you do, and He will establish your plans.” – Proverbs 16:3',
  '“Whatever you do, work at it with all your heart, as working for the Lord.” – Colossians 3:23',
  '“Blessed are the peacemakers, for they will be called children of God.” – Matthew 5:9',
  '“Love is patient, love is kind.” – 1 Corinthians 13:4',
  '“For we walk by faith, not by sight.” – 2 Corinthians 5:7',
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [studentCount, setStudentCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchEnrollmentCount();
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function fetchEnrollmentCount() {
    try {
      setLoadingCount(true);

      const res = await fetch('/api/admin/enrollments');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load enrollment count');
      }

      const enrollments: EnrollmentRow[] = data.enrollments || [];
      setStudentCount(enrollments.length);
    } catch (error) {
      console.error(error);
      setStudentCount(0);
    } finally {
      setLoadingCount(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('user');
    router.push('/login');
  }

  const homeActive = pathname === '/admin/dashboard';
  const enrollmentActive = pathname.startsWith('/admin/enrollments');
  const userManagementActive = pathname.startsWith('/admin/users');
  const gradesManagementActive = pathname.startsWith('/admin/grades');

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [currentTime]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [currentTime]);

  const dailyVerse = useMemo(() => {
    const dayIndex = currentTime.getDate() % verses.length;
    return verses[dayIndex];
  }, [currentTime]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#eef4fb] via-[#f5f8fc] to-[#e7eef8]">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-[#243b55] text-white shadow-2xl">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="SCMS Logo"
                width={60}
                height={60}
                className="h-14 w-14"
                priority
              />
              <h1 className="text-lg font-bold">SCMS Admin</h1>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className={`w-full px-4 py-3 rounded-2xl text-left font-semibold ${
                homeActive ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => router.push('/admin/enrollments')}
              className={`w-full px-4 py-3 rounded-2xl text-left font-semibold ${
                enrollmentActive ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Enrollment Form Records
            </button>

            <button
              onClick={() => router.push('/admin/users')}
              className={`w-full px-4 py-3 rounded-2xl text-left font-semibold ${
                userManagementActive ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              User Account Management
            </button>

            <button
              onClick={() => router.push('/admin/grades')}
              className={`w-full px-4 py-3 rounded-2xl text-left font-semibold ${
                gradesManagementActive ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Grades Management
            </button>

          </nav>
          

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full py-3 font-semibold bg-red-600 rounded-2xl hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="w-full p-8 space-y-6 ml-72">

          {/* HEADER */}
          <div className="overflow-hidden bg-white shadow-xl rounded-3xl">
            <div className="bg-gradient-to-r from-[#243b55] to-[#35516f] px-8 py-10 text-white">
              <h2 className="text-3xl font-bold">
                Welcome to SCMS Admin Dashboard
              </h2>
            </div>
          </div>

          {/* VERSE (MOVED TO TOP) */}
          <div className="p-8 bg-white shadow-xl rounded-3xl">
            <h3 className="text-2xl font-bold text-[#243b55] mb-4">
              Verse of the Day
            </h3>
            <p className="text-lg italic text-gray-700">{dailyVerse}</p>
          </div>

          {/* CARDS */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* CLOCK */}
            <div className="p-6 bg-white shadow-xl rounded-3xl">
              <p className="text-sm text-gray-500 uppercase">Live Clock</p>
              <h3 className="text-4xl font-bold text-[#243b55] mt-3">
                {formattedTime}
              </h3>
              <p className="mt-2 text-gray-600">{formattedDate}</p>
            </div>

            {/* ENROLLMENT */}
            <div className="p-6 bg-white shadow-xl rounded-3xl">
              <p className="text-sm text-gray-500 uppercase">
                Enrollment Count
              </p>
              <h3 className="text-4xl font-bold text-[#243b55] mt-3">
                {loadingCount ? '...' : studentCount}
              </h3>
              <button
                onClick={() => router.push('/admin/enrollments')}
                className="mt-4 px-5 py-2 bg-[#243b55] text-white rounded-xl"
              >
                View Records
              </button>
            </div>
          </div>

        </main>
      </div>
    </section>
  );
}