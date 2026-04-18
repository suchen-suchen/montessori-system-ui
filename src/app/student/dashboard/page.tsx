'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

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

export default function StudentDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== 'student') {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function handleLogout() {
    localStorage.removeItem('user');
    router.push('/login');
  }

  const homeActive = pathname === '/student/dashboard';
  const profileActive = pathname.startsWith('/student/profile');
  const enrollmentActive = pathname.startsWith('/student/enrollment');

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
              <div>
                <h1 className="text-lg font-bold leading-tight">SCMS Student</h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              <button
                onClick={() => router.push('/student/dashboard')}
                className={`flex w-full items-center rounded-2xl px-4 py-3 text-left text-base font-semibold transition ${
                  homeActive
                    ? 'bg-white/15 shadow-lg hover:bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => router.push('/student/profile')}
                className={`flex w-full items-center rounded-2xl px-4 py-3 text-left text-base font-semibold transition ${
                  profileActive
                    ? 'bg-white/15 shadow-lg hover:bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                Profile
              </button>

              <button
                onClick={() => router.push('/student/enrollment')}
                className={`flex w-full items-center rounded-2xl px-4 py-3 text-left text-base font-semibold transition ${
                  enrollmentActive
                    ? 'bg-white/15 shadow-lg hover:bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                Enrollment
              </button>
            </div>
          </nav>

          <div className="px-4 py-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-base font-semibold text-white transition bg-red-600 rounded-2xl hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="w-full p-8 ml-72">
          <div className="space-y-6">
            <div className="overflow-hidden bg-white shadow-xl rounded-3xl">
              <div className="bg-gradient-to-r from-[#243b55] to-[#35516f] px-8 py-10 text-white">
                <h2 className="text-3xl font-bold">
                  Welcome to SCMS Student Dashboard
                </h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-[#e6edf6]">
                <p className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                  Live Clock
                </p>
                <h3 className="mt-3 text-4xl font-bold tracking-wide text-[#243b55]">
                  {formattedTime}
                </h3>
                <p className="mt-3 text-sm text-gray-600">{formattedDate}</p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-[#e6edf6]">
                <p className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                  Student Panel
                </p>
                <h3 className="mt-3 text-4xl font-bold text-[#243b55]">
                  Active
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  Access your profile, enrollment details, and school information.
                </p>

                <button
                  onClick={() => router.push('/student/profile')}
                  className="mt-5 rounded-2xl bg-[#243b55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d3148]"
                >
                  Open Profile
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[#e6edf6]">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-bold text-[#243b55]">
                  Verse of the Day
                </h3>
                <span className="inline-flex w-fit rounded-full bg-[#eef5ff] px-4 py-2 text-sm font-semibold text-[#35516f]">
                  Daily Reflection
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-[#d9e6f5] bg-gradient-to-r from-[#f7fbff] to-[#eef5ff] p-6">
                <p className="text-lg italic leading-8 text-gray-700">
                  {dailyVerse}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}