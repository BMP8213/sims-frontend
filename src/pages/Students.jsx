import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import SearchBar from '../components/SearchBar.jsx';
import DataTable from '../components/DataTable.jsx';
import { deleteStudent, fetchStudents } from '../services/studentService.js';

const statusClasses = {
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Inactive: 'border-amber-200 bg-amber-50 text-amber-700',
  Pending: 'border-sky-200 bg-sky-50 text-sky-700',
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchStudents().then((list) => {
      setStudents(list);
      setCurrentPage(1);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase();
    return students.filter((student) =>
      [student.fullName, student.studentCode, student.course, student.phone].some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );
  }, [students, search]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const stats = useMemo(() => {
    const activeCount = students.filter((student) => student.status === 'Active').length;
    const courseCount = new Set(students.map((student) => student.course).filter(Boolean)).size;
    return {
      total: students.length,
      active: activeCount,
      courses: courseCount,
    };
  }, [students]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student record?')) return;
    await deleteStudent(id);
    setStudents((prev) => prev.filter((item) => item.id !== id));
  };

  const columns = [
    { key: 'studentCode', title: 'Student ID' },
    {
      key: 'photo',
      title: 'Photo',
      render: (row) =>
        row.photo ? (
          <img src={row.photo} alt={row.fullName} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            {row.fullName?.charAt(0) || '?'}
          </div>
        ),
    },
    { key: 'fullName', title: 'Full Name' },
    { key: 'gender', title: 'Gender' },
    { key: 'phone', title: 'Phone' },
    { key: 'course', title: 'Course' },
    {
      key: 'status',
      title: 'Status',
      render: (row) => (
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[row.status] || 'border-slate-200 bg-slate-100 text-slate-700'}`}>
          {row.status || 'Active'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/students/${row.id}`)}
            className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)]">
      <Navbar />
      <div className="mx-auto flex max-w-[1300px] gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_25px_80px_-30px_rgba(15,23,42,0.35)]">
            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                <div className="w-full xl:max-w-md">
                  <SearchBar value={search} onChange={setSearch} placeholder="Search students by name, ID or course" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigate('/students/new')}
                    className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
                  >
                    Add Student
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Total: {filteredStudents.length} student{filteredStudents.length === 1 ? '' : 's'}
                </div>
              </div>

              {loading ? (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                  Loading students...
                </div>
              ) : (
                <>
                  <DataTable columns={columns} rows={paginatedStudents} />

                  <div className="mt-2 flex flex-col gap-2 border-t border-slate-200 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">
                      Showing {paginatedStudents.length} of {filteredStudents.length} student{filteredStudents.length === 1 ? '' : 's'}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={safePage === 1}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                        Page {safePage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={safePage === totalPages}
                        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
