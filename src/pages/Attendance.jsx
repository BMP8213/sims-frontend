import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import DataTable from '../components/DataTable.jsx';
import { fetchAttendance, recordAttendance } from '../services/attendanceService.js';
import { fetchStudents } from '../services/studentService.js';
import { fetchCourses } from '../services/courseService.js';

const statusOptions = ['Present', 'Absent', 'Late'];

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCourses(), fetchAttendance(), fetchStudents()])
      .then(([courseList, attendanceList, studentList]) => {
        const normalized = courseList
          .filter((course) => course?.name)
          .map((course) => ({ id: course.id, name: course.name }));

        setCourseOptions(normalized);
        if (normalized.length > 0) {
          setCourseId(normalized[0].id);
        }

        setAttendance(attendanceList);
        setStudents(studentList);
      })
      .catch((err) => {
        console.error('Failed to load attendance page data:', err);
        setError('Unable to load attendance. Please refresh or sign in again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleMark = async (studentId, studentName, status) => {
    try {
      const selectedCourse = courseOptions.find((option) => option.id === courseId);
      const record = await recordAttendance({
        studentId,
        studentName,
        courseId,
        courseName: selectedCourse?.name || '',
        status,
        date,
      });
      if (!record) {
        setError('Unable to save attendance.');
        return;
      }
      setAttendance((prev) => [record, ...prev.filter((item) => item.studentId !== studentId)]);
    } catch (err) {
      console.error('Failed to record attendance:', err);
      const backendDetail = err?.response?.data?.detail || err?.response?.data || err?.message;
      setError(typeof backendDetail === 'string' ? backendDetail : JSON.stringify(backendDetail));
    }
  };

  const rows = students.map((student) => ({
    id: student.id,
    studentId: student.id,
    studentName: student.fullName,
    status: attendance.find((item) => item.studentId === student.id && item.date === date)?.status || 'Pending',
  }));

  const columns = [
    { key: 'studentName', title: 'Student Name' },
    {
      key: 'status',
      title: 'Attendance Status',
      render: (row) => <span className="font-semibold text-slate-700">{row.status}</span>,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleMark(row.studentId, row.studentName, status)}
              className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              {status}
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
                <h2 className="text-2xl font-semibold text-slate-900">Attendance</h2>
                <p className="text-sm text-slate-500">Select a class and date to mark student attendance.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <select value={courseId} onChange={(e) => setCourseId(Number(e.target.value))} className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm">
                  {courseOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" />
              </div>
            </div>
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">Loading attendance...</div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{error}</div>
            ) : (
              <DataTable columns={columns} rows={rows} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
