import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import DataTable from '../components/DataTable.jsx';
import { createPayment, fetchPayments, updatePayment } from '../services/paymentService.js';

const statusOptions = ['Paid', 'Pending', 'Overdue'];

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [student, setStudent] = useState('Amina Yusuf');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('Pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPayments().then((list) => {
      setPayments(list);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { student, amount: Number(amount), date, status };
    const newPayment = await createPayment(payload);
    setPayments((prev) => [newPayment, ...prev]);
    setAmount(0);
    setStatus('Pending');
  };

  const handleStatusUpdate = async (id, nextStatus) => {
    const updated = await updatePayment(id, { status: nextStatus });
    setPayments((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const columns = [
    { key: 'student', title: 'Student' },
    { key: 'amount', title: 'Amount', render: (row) => `$${row.amount}` },
    { key: 'date', title: 'Date' },
    { key: 'status', title: 'Status', render: (row) => <span className="font-semibold">{row.status}</span> },
    {
      key: 'actions',
      title: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleStatusUpdate(row.id, option)}
              className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              {option}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-[1300px] gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Payments</h2>
                <p className="text-sm text-slate-500">Register payments and review the payment history.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="grid gap-4 lg:grid-cols-4">
                <input value={student} onChange={(e) => setStudent(e.target.value)} placeholder="Student name" className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount" className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm">
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="rounded-3xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
                  Add Payment
                </button>
              </div>
            </form>
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">Loading payments...</div>
            ) : (
              <div className="mt-6">
                <DataTable columns={columns} rows={payments} />
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
