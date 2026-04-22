'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

type UserRole = 'admin' | 'teacher' | 'student';

type UserRow = {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  is_active: number;
  dashboard_access: UserRole;
  created_at: string;
  updated_at: string;
};

type UserForm = {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  is_active: number;
  dashboard_access: UserRole;
};

const initialForm: UserForm = {
  full_name: '',
  email: '',
  password: '',
  role: 'teacher',
  is_active: 1,
  dashboard_access: 'teacher',
};

export default function UserManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [createForm, setCreateForm] = useState<UserForm>(initialForm);
  const [editForm, setEditForm] = useState<UserForm>(initialForm);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const homeActive = pathname === '/admin/dashboard';
  const enrollmentActive = pathname.startsWith('/admin/enrollments');
  const userManagementActive = pathname.startsWith('/admin/users');
  const gradesManagementActive = pathname.startsWith('/admin/grades');

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

    fetchUsers();
  }, [router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  async function fetchUsers() {
    try {
      setLoading(true);

      const res = await fetch('/api/admin/users');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load users');
      }

      setUsers(data.users || []);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('user');
    router.push('/login');
  }

  function openCreateModal() {
    setCreateForm(initialForm);
    setShowCreateModal(true);
  }

  function openEditModal(user: UserRow) {
    setSelectedUserId(user.id);
    setEditForm({
      full_name: user.full_name,
      email: user.email,
      password: user.password || '',
      role: user.role,
      is_active: user.is_active,
      dashboard_access: user.role,
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  }

  function openResetModal(user: UserRow) {
    setSelectedUserId(user.id);
    setResetPassword(user.password || '');
    setShowResetModal(true);
    setOpenMenuId(null);
  }

  function handleCreateChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setCreateForm((prev) => {
      if (name === 'role') {
        const roleValue = value as UserRole;
        return {
          ...prev,
          role: roleValue,
          dashboard_access: roleValue,
        };
      }

      return {
        ...prev,
        [name]: name === 'is_active' ? Number(value) : value,
      };
    });
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setEditForm((prev) => {
      if (name === 'role') {
        const roleValue = value as UserRole;
        return {
          ...prev,
          role: roleValue,
          dashboard_access: roleValue,
        };
      }

      return {
        ...prev,
        [name]: name === 'is_active' ? Number(value) : value,
      };
    });
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...createForm,
        dashboard_access: createForm.role,
      };

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create account');
      }

      alert('User account created successfully.');
      setShowCreateModal(false);
      setCreateForm(initialForm);
      fetchUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedUserId) return;

    try {
      setSaving(true);

      const payload = {
        ...editForm,
        dashboard_access: editForm.role,
      };

      const res = await fetch(`/api/admin/users/${selectedUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update account');
      }

      alert('User account updated successfully.');
      setShowEditModal(false);
      setSelectedUserId(null);
      fetchUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update account');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(user: UserRow) {
    const actionText = user.is_active ? 'deactivate' : 'activate';
    const ok = window.confirm(
      `Are you sure you want to ${actionText} this account?`
    );

    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: user.full_name,
          email: user.email,
          password: user.password,
          role: user.role,
          is_active: user.is_active ? 0 : 1,
          dashboard_access: user.role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update account status');
      }

      alert(
        `Account ${user.is_active ? 'deactivated' : 'activated'} successfully.`
      );
      setOpenMenuId(null);
      fetchUsers();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to update account status'
      );
    }
  }

  async function handleDelete(user: UserRow) {
    const ok = window.confirm(
      `Are you sure you want to delete the account for ${user.full_name}?`
    );
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete account');
      }

      alert('User account deleted successfully.');
      setOpenMenuId(null);
      fetchUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete account');
    }
  }

  async function handleResetPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedUserId) return;

    try {
      setSaving(true);

      const targetUser = users.find((item) => item.id === selectedUserId);
      if (!targetUser) {
        throw new Error('User not found');
      }

      const res = await fetch(`/api/admin/users/${selectedUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: targetUser.full_name,
          email: targetUser.email,
          password: resetPassword,
          role: targetUser.role,
          is_active: targetUser.is_active,
          dashboard_access: targetUser.role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset password');
      }

      alert('Password reset successfully.');
      setShowResetModal(false);
      setSelectedUserId(null);
      setResetPassword('');
      fetchUsers();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setSaving(false);
    }
  }

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase();

    return users.filter((item) => {
      return (
        item.full_name.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.role.toLowerCase().includes(keyword) ||
        item.dashboard_access.toLowerCase().includes(keyword) ||
        String(item.is_active ? 'active' : 'inactive').includes(keyword)
      );
    });
  }, [users, search]);

  return (
    <section className="min-h-screen bg-[#eef4fb]">
      <div className="min-h-screen">
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
                <h1 className="text-lg font-bold leading-tight">SCMS Admin</h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-base font-semibold transition ${
                  homeActive
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => router.push('/admin/enrollments')}
                className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-base font-semibold transition ${
                  enrollmentActive
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                Enrollment Form Records
              </button>

              <button
                onClick={() => router.push('/admin/users')}
                className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-base font-semibold transition ${
                  userManagementActive
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'hover:bg-white/10'
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

            </div>
          </nav>

          <div className="px-4 py-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-base font-semibold text-white transition bg-red-600 rounded-xl hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 p-8 ml-72">
          <div className="flex min-h-[calc(100vh-64px)] flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="px-6 py-5 border-b bg-gray-50">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#243b55]">
                    User Account Management
                  </h3>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    type="text"
                    placeholder="Search full name, email, role, status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-300 outline-none rounded-xl focus:border-blue-600 md:w-96"
                  />

                  <button
                    onClick={openCreateModal}
                    className="rounded-xl bg-[#243b55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d3148]"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-lg text-gray-600">Loading user accounts...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-lg text-gray-600">No user accounts found.</div>
            ) : (
              <div className="flex-1 overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-[#e9eef5]">
                    <tr>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Full Name
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Email
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Role
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Status
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Dashboard Access
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Created At
                      </th>
                      <th className="border-b px-6 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#243b55]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/40">
                        <td className="px-6 py-4 text-sm text-gray-800 border-b">
                          {item.full_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 border-b">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 uppercase border-b">
                          {item.role}
                        </td>
                        <td className="px-6 py-4 text-sm border-b">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 uppercase border-b">
                          {item.dashboard_access}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 border-b">
                          {new Date(item.created_at).toLocaleDateString('en-US')}
                        </td>
                        <td className="px-6 py-4 text-sm border-b">
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(openMenuId === item.id ? null : item.id)
                              }
                              className="rounded-xl bg-[#243b55] px-4 py-2 font-medium text-white transition hover:bg-[#1d3148]"
                            >
                              Manage
                            </button>

                            {openMenuId === item.id && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 z-20 w-56 mt-2 overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl"
                              >
                                <button
                                  type="button"
                                  onClick={() => openEditModal(item)}
                                  className="block w-full px-4 py-3 text-sm font-medium text-left text-gray-700 transition hover:bg-blue-50"
                                >
                                  Edit Account
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleActive(item)}
                                  className="block w-full px-4 py-3 text-sm font-medium text-left text-gray-700 transition hover:bg-blue-50"
                                >
                                  {item.is_active
                                    ? 'Deactivate Account'
                                    : 'Activate Account'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openResetModal(item)}
                                  className="block w-full px-4 py-3 text-sm font-medium text-left text-gray-700 transition hover:bg-blue-50"
                                >
                                  Reset Password
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(item)}
                                  className="block w-full px-4 py-3 text-sm font-medium text-left text-red-600 transition hover:bg-red-50"
                                >
                                  Delete Account
                                </button>
                              </div>
                            )}
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

      {showCreateModal && (
        <ModalShell
          title="Create User Account"
          onClose={() => setShowCreateModal(false)}
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <FormFields form={createForm} onChange={handleCreateChange} />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 font-semibold text-white bg-gray-500 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#243b55] px-4 py-2 font-semibold text-white hover:bg-[#1d3148] disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Create Account'}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {showEditModal && (
        <ModalShell
          title="Edit User Account"
          onClose={() => setShowEditModal(false)}
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <FormFields form={editForm} onChange={handleEditChange} />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 font-semibold text-white bg-gray-500 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#243b55] px-4 py-2 font-semibold text-white hover:bg-[#1d3148] disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {showResetModal && (
        <ModalShell
          title="Reset Password"
          onClose={() => setShowResetModal(false)}
        >
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="text"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 outline-none rounded-xl focus:border-blue-600"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 font-semibold text-white bg-gray-500 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#243b55] px-4 py-2 font-semibold text-white hover:bg-[#1d3148] disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </ModalShell>
      )}
    </section>
  );
}

function FormFields({
  form,
  onChange,
}: {
  form: UserForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  const inputClass =
    'w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600';
  const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

  const isExistingAdmin = form.role === 'admin';

  return (
    <>
      <div>
        <label className={labelClass}>Full Name</label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={onChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Password</label>
        <input
          type="text"
          name="password"
          value={form.password}
          onChange={onChange}
          className={inputClass}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Role</label>

          {isExistingAdmin ? (
            <input
              type="text"
              value="admin"
              className={`${inputClass} bg-gray-100 uppercase`}
              disabled
            />
          ) : (
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className={inputClass}
            >
              <option value="teacher">teacher</option>
              <option value="student">student</option>
            </select>
          )}
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select
            name="is_active"
            value={form.is_active}
            onChange={onChange}
            className={inputClass}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Dashboard Access</label>
        <input
          type="text"
          value={form.role}
          className={`${inputClass} bg-gray-100 uppercase`}
          disabled
        />
      </div>
    </>
  );
}

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
      <div className="w-full max-w-2xl p-6 bg-white shadow-2xl rounded-3xl">
        <div className="flex items-center justify-between pb-3 mb-5 border-b">
          <h3 className="text-xl font-bold text-[#243b55]">{title}</h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-gray-500 hover:text-gray-700"
            type="button"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}