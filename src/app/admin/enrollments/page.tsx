'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type EnrollmentRow = {
  id: number;
  full_name: string;
  grade_level_to_enroll: string;
  school_year: string;
  created_at: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [search, setSearch] = useState('');

  const homeActive = pathname === '/admin/dashboard';
  const enrollmentActive = pathname.startsWith('/admin/enrollments');

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

    fetchEnrollments();
  }, [router]);

  async function fetchEnrollments() {
    try {
      setLoading(true);

      const res = await fetch('/api/admin/enrollments');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load enrollments');
      }

      setEnrollments(data.enrollments || []);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('user');
    router.push('/login');
  }

  async function handleDelete(id: number) {
    const ok = window.confirm('Are you sure you want to delete this enrollment?');
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/enrollments/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete');
      }

      alert('Enrollment deleted successfully.');
      fetchEnrollments();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete');
    }
  }

  const filteredEnrollments = useMemo(() => {
    const keyword = search.toLowerCase();

    return enrollments.filter((item) => {
      return (
        item.full_name.toLowerCase().includes(keyword) ||
        (item.grade_level_to_enroll || '').toLowerCase().includes(keyword) ||
        (item.school_year || '').toLowerCase().includes(keyword)
      );
    });
  }, [enrollments, search]);

  return (
    <section className="min-h-screen bg-[#eef4fb]">
      <div className="flex min-h-screen">
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-[#243b55] text-white shadow-2xl">
          <div className="border-b border-white/10 px-6 py-6">
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
                <h1 className="text-lg font-bold leading-tight">SCMS Admin</h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className={`flex items-center w-full px-4 py-3 text-base font-semibold text-left transition rounded-xl ${
                  homeActive
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => router.push('/admin/enrollments')}
                className={`flex items-center w-full px-4 py-3 text-base font-semibold text-left transition rounded-xl ${
                  enrollmentActive
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                Enrollment Form Records
              </button>
            </div>
          </nav>

          <div className="border-t border-white/10 px-4 py-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-base font-semibold text-white transition bg-red-600 rounded-xl hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="w-full p-8 ml-72">
          <div
            id="enrollment-records"
            className="overflow-hidden bg-white shadow-xl rounded-3xl"
          >
            <div className="border-b bg-gray-50 px-6 py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-bold text-[#243b55]">
                  Enrollment Form Records
                </h3>

                <input
                  type="text"
                  placeholder="Search full name, grade level, school year..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 md:w-96"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-lg text-gray-600">Loading enrollments...</div>
            ) : filteredEnrollments.length === 0 ? (
              <div className="p-8 text-lg text-gray-600">
                No enrollment form records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-[#e9eef5]">
                    <tr>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Full Name
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Grade Level
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        School Year
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Date Submitted
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEnrollments.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/40">
                        <td className="border-b px-6 py-4 text-sm text-gray-800">
                          {item.full_name}
                        </td>
                        <td className="border-b px-6 py-4 text-sm text-gray-800">
                          {item.grade_level_to_enroll}
                        </td>
                        <td className="border-b px-6 py-4 text-sm text-gray-800">
                          {item.school_year}
                        </td>
                        <td className="border-b px-6 py-4 text-sm text-gray-800">
                          {new Date(item.created_at).toLocaleDateString('en-US')}
                        </td>
                        <td className="border-b px-6 py-4 text-sm">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => router.push(`/admin/enrollments/${item.id}`)}
                              className="rounded-xl bg-blue-700 px-4 py-2 font-medium text-white transition hover:bg-blue-800"
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                router.push(`/admin/enrollments/${item.id}/edit`)
                              }
                              className="rounded-xl bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600"
                            >
                              Update
                            </button>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}