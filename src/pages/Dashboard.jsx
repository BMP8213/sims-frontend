import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { fetchStudents } from '../services/studentService.js';
import { fetchAttendance } from '../services/attendanceService.js';
import { fetchPayments } from '../services/paymentService.js';

const cards = [
  { key: 'students', label: 'Total Students', accent: 'bg-brand-50 text-brand-700' },
  { key: 'teachers', label: 'Total Teachers', accent: 'bg-sky-50 text-sky-700' },
  { key: 'courses', label: 'Total Courses', accent: 'bg-violet-50 text-violet-700' },
  { key: 'attendance', label: "Today's Attendance", accent: 'bg-emerald-50 text-emerald-700' },
  { key: 'unpaid', label: 'Unpaid Students', accent: 'bg-orange-50 text-orange-700' },
  { key: 'revenue', label: 'Monthly Revenue', accent: 'bg-slate-50 text-slate-700' },
];

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchStudents().then(setStudents);
    fetchAttendance().then(setAttendance);
    fetchPayments().then(setPayments);
  }, []);

  const stats = useMemo(() => ({
    students: students.length,
    teachers: 12,
    courses: 8,
    attendance: attendance.filter((item) => item.date === new Date().toISOString().slice(0, 10)).length || attendance.length,
    unpaid: payments.filter((item) => item.status !== 'Paid').length,
    revenue: payments.reduce((sum, item) => sum + Number(item.amount || 0), 0),
  }), [students, attendance, payments]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-[1300px] gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
                <p className="text-sm text-slate-500">Overview of current school operations</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
              {cards.map((card) => (
                <div key={card.key} className={`rounded-3xl border border-slate-200 p-5 ${card.accent}`}>
                  <p className="text-sm font-medium uppercase tracking-[0.18em]">{card.label}</p>
                  <p className="mt-4 text-3xl font-semibold">{card.key === 'revenue' ? `$${stats[card.key]}` : stats[card.key]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Attendance Overview</h3>
              <p className="mt-3 text-sm text-slate-500">Latest attendance records and trends.</p>
              <div className="mt-6 space-y-4">
                {attendance.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.studentName}</p>
                      <p className="text-sm text-slate-500">{item.course}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Latest Payments</h3>
              <p className="mt-3 text-sm text-slate-500">Recent payment activity and status.</p>
              <div className="mt-6 space-y-4">
                {payments.slice(0, 4).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{payment.student}</p>
                      <p className="text-sm text-slate-500">{payment.date}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">{payment.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
