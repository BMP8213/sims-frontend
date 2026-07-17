import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import DataTable from '../components/DataTable.jsx';

const initialUsers = [
  { id: 'U001', username: 'admin', role: 'Admin', status: 'Active' },
  { id: 'U002', username: 'teacher', role: 'Teacher', status: 'Active' },
  { id: 'U003', username: 'cashier', role: 'Cashier', status: 'Active' },
];
const roles = ['Admin', 'Teacher', 'Cashier'];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [editing, setEditing] = useState(null);
  const [formState, setFormState] = useState({ username: '', role: 'Teacher', status: 'Active' });

  const saveUser = () => {
    if (!formState.username.trim()) return;
    if (editing) {
      setUsers((prev) => prev.map((item) => (item.id === editing.id ? { ...editing, ...formState } : item)));
    } else {
      setUsers((prev) => [{ id: `U${Date.now()}`, ...formState }, ...prev]);
    }
    setEditing(null);
    setFormState({ username: '', role: 'Teacher', status: 'Active' });
  };

  const handleEdit = (user) => {
    setEditing(user);
    setFormState({ username: user.username, role: user.role, status: user.status });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this user?')) return;
    setUsers((prev) => prev.filter((item) => item.id !== id));
  };

  const columns = useMemo(
    () => [
      { key: 'username', title: 'Username' },
      { key: 'role', title: 'Role' },
      { key: 'status', title: 'Status' },
      {
        key: 'actions',
        title: 'Actions',
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleEdit(row)}
              className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row.id)}
              className="rounded-2xl bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-[1300px] gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
                <p className="text-sm text-slate-500">Admin-only user management for roles and access control.</p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">{editing ? 'Edit User' : 'Create User'}</h3>
                <div className="space-y-4">
                  <input
                    value={formState.username}
                    onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
                    placeholder="Username"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  />
                  <select
                    value={formState.role}
                    onChange={(event) => setFormState((prev) => ({ ...prev, role: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <select
                    value={formState.status}
                    onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null);
                        setFormState({ username: '', role: 'Teacher', status: 'Active' });
                      }}
                      className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveUser}
                      className="rounded-3xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
                    >
                      {editing ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <DataTable columns={columns} rows={users} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
