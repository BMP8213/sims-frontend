import api from './api.js';

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const normalizeAttendance = (item) => ({
  id: item?.id,
  studentName: item?.student_name || item?.studentName || item?.student?.full_name || item?.student?.fullName || '',
  studentId: item?.student_id || item?.studentId || item?.student?.id || null,
  course: item?.course_name || item?.course || item?.course?.name || 'Not assigned',
  status: item?.status || item?.attendance_status || 'Present',
  date: item?.date || item?.attendance_date || '',
  raw: item,
});

export async function fetchAttendance() {
  try {
    const { data } = await api.get('attendance/');
    return extractList(data).map(normalizeAttendance);
  } catch (error) {
    console.error('Failed to fetch attendance from backend.', error);
    return [];
  }
}

export async function recordAttendance(payload) {
  try {
    const requestPayload = {
      student: payload.studentId,
      student_id: payload.studentId,
      student_name: payload.studentName,
      course_id: payload.courseId,
      course_name: payload.courseName,
      status: payload.status,
      date: payload.date,
    };
    const { data } = await api.post('attendance/', requestPayload);
    return normalizeAttendance(data?.data ?? data);
  } catch (error) {
    console.error('Failed to record attendance on backend.', error);
    console.error('Attendance request payload:', {
      student: payload.studentId,
      student_id: payload.studentId,
      student_name: payload.studentName,
      course_id: payload.courseId,
      course_name: payload.courseName,
      status: payload.status,
      date: payload.date,
    });
    if (error.response) {
      console.error('Attendance backend response:', error.response.data);
    }
    throw error;
  }
}

export async function updateAttendance(id, payload) {
  try {
    const requestPayload = {
      student: payload.studentId,
      student_id: payload.studentId,
      student_name: payload.studentName,
      course_id: payload.courseId,
      course_name: payload.courseName,
      status: payload.status,
      date: payload.date,
    };
    const { data } = await api.put(`attendance/${id}/`, requestPayload);
    return normalizeAttendance(data?.data ?? data);
  } catch (error) {
    console.error('Failed to update attendance on backend.', error);
    if (error.response) {
      console.error('Attendance backend response:', error.response.data);
    }
    throw error;
  }
}
