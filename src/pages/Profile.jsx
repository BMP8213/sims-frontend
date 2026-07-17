import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-[1300px] gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Profile</h2>
                <p className="text-sm text-slate-500">Review your account details and sign out.</p>
              </div>
              <button
                onClick={logout}
                className="rounded-3xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Account</h3>
                <div className="mt-5 space-y-4 text-sm text-slate-700">
                  <div>
                    <p className="font-medium">Name</p>
                    <p>{user?.name}</p>
                  </div>
                  <div>
                    <p className="font-medium">Username</p>
                    <p>{user?.username}</p>
                  </div>
                  <div>
                    <p className="font-medium">Role</p>
                    <p>{user?.role}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Preferences</h3>
                <p className="mt-4 text-sm text-slate-600">There are no preferences configured yet, but this area can be extended for profile settings.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
