import api from './api.js';

const getAuthToken = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};

const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const fetchAllPages = async (url) => {
  const results = [];
  let nextUrl = url;

  while (nextUrl) {
    const { data } = await api.get(nextUrl, { headers: authHeaders() });
    const pageResults = extractList(data);
    results.push(...pageResults);
    nextUrl = data?.next || null;
  }

  return results;
};

const normalizeStudent = (student) => ({
  id: student?.id,
  studentCode: student?.student_code || student?.studentCode || '',
  fullName: `${student?.first_name || student?.firstName || ''} ${student?.last_name || student?.lastName || ''}`.trim(),
  gender: student?.gender || 'Unknown',
  phone: student?.phone || '',
  course: student?.course_name || student?.course || 'Not assigned',
  status: student?.status || 'Active',
  photo: student?.photo || student?.profile_photo || null,
  raw: student,
});

export async function fetchStudents() {
  try {
    const list = await fetchAllPages('students/');
    return list.map(normalizeStudent);
  } catch (error) {
    console.error('Failed to fetch students from backend.', error);
    return [];
  }
}

export async function fetchStudentById(id) {
  try {
    const { data } = await api.get(`students/${id}/`, { headers: authHeaders() });
    // return the raw student object for forms that expect original field names
    return data?.data ?? data;
  } catch (error) {
    console.error('Failed to fetch student by id from backend.', error);
    return null;
  }
}

// export async function createStudent(payload) {
//   try {
//     const requestPayload = {
//       student_code: payload.studentCode || payload.student_code || payload.id,
//       first_name: payload.firstName || payload.first_name || payload.fullName?.split(' ')[0] || '',
//       last_name: payload.lastName || payload.last_name || payload.fullName?.split(' ').slice(1).join(' ') || '',
//       gender: payload.gender,
//       date_of_birth: payload.dob || payload.date_of_birth,
//       phone: payload.phone,
//       address: payload.address,
//       parent_name: payload.parentName || payload.parent_name,
//       parent_phone: payload.parentPhone || payload.parent_phone,
//       course: payload.course,
//       photo: payload.photo,
//       status: payload.status || 'Active',
//     };
//     console.log("Request payload:", requestPayload);
//     const { data } = await api.post('students/', requestPayload, { headers: authHeaders() });
//     return normalizeStudent(data?.data ?? data);
//   } catch (error) {
//     console.error('Failed to create student on backend.', error);
//     console.error("Backend error:", error.response?.data);
//     return null;
//   }
// }

export async function createStudent(payload) {
  try {
    let requestPayload;
    let headers = authHeaders();

    // ✅ If photo is a FileList or File, build FormData
    if (payload.photo instanceof File || (payload.photo && payload.photo[0])) {
      requestPayload = new FormData();
      requestPayload.append("student_code", payload.studentCode || payload.student_code || payload.id);
      requestPayload.append("first_name", payload.firstName || payload.first_name || payload.fullName?.split(" ")[0] || "");
      requestPayload.append("last_name", payload.lastName || payload.last_name || payload.fullName?.split(" ").slice(1).join(" ") || "");
      requestPayload.append("gender", payload.gender);
      requestPayload.append("date_of_birth", payload.dob || payload.date_of_birth);
      requestPayload.append("phone", payload.phone);
      requestPayload.append("address", payload.address);
      requestPayload.append("parent_name", payload.parentName || payload.parent_name);
      requestPayload.append("parent_phone", payload.parentPhone || payload.parent_phone);
      requestPayload.append("course", payload.course);
      requestPayload.append("status", payload.status || "Active");

      // append actual file
      const file = payload.photo instanceof File ? payload.photo : payload.photo[0];
      requestPayload.append("photo", file);

      headers = { ...headers, "Content-Type": "multipart/form-data" };
    } else {
      // ✅ Otherwise, send JSON
      requestPayload = {
        student_code: payload.studentCode || payload.student_code || payload.id,
        first_name: payload.firstName || payload.first_name || payload.fullName?.split(" ")[0] || "",
        last_name: payload.lastName || payload.last_name || payload.fullName?.split(" ").slice(1).join(" ") || "",
        gender: payload.gender,
        date_of_birth: payload.dob || payload.date_of_birth,
        phone: payload.phone,
        address: payload.address,
        parent_name: payload.parentName || payload.parent_name,
        parent_phone: payload.parentPhone || payload.parent_phone,
        course: payload.course,
        photo: payload.photo,
        status: payload.status || "Active",
      };
    }

    console.log("Request payload:", requestPayload);

    const { data } = await api.post("students/", requestPayload, { headers });
    return normalizeStudent(data?.data ?? data);
  } catch (error) {
    console.error("Failed to create student on backend.", error);
    console.error("Backend error:", error.response?.data);
    // surface the error to caller so UI can render backend messages
    throw error;
  }
}


export async function updateStudent(id, payload) {
  try {
    let requestPayload;
    let headers = authHeaders();

    // if updating with a file, send as multipart/form-data
    if (payload.photo instanceof File || (payload.photo && payload.photo[0])) {
      requestPayload = new FormData();
      requestPayload.append('student_code', payload.studentCode || payload.student_code || payload.id);
      requestPayload.append('first_name', payload.firstName || payload.first_name || payload.fullName?.split(' ')[0] || '');
      requestPayload.append('last_name', payload.lastName || payload.last_name || payload.fullName?.split(' ').slice(1).join(' ') || '');
      requestPayload.append('gender', payload.gender || '');
      requestPayload.append('date_of_birth', payload.dob || payload.date_of_birth || '');
      requestPayload.append('phone', payload.phone || '');
      requestPayload.append('address', payload.address || '');
      requestPayload.append('parent_name', payload.parentName || payload.parent_name || '');
      requestPayload.append('parent_phone', payload.parentPhone || payload.parent_phone || '');
      requestPayload.append('course', payload.course ?? '');
      requestPayload.append('status', payload.status || 'Active');

      const file = payload.photo instanceof File ? payload.photo : payload.photo[0];
      requestPayload.append('photo', file);

      headers = { ...headers, 'Content-Type': 'multipart/form-data' };
    } else {
      requestPayload = {
        student_code: payload.studentCode || payload.student_code || payload.id,
        first_name: payload.firstName || payload.first_name || payload.fullName?.split(' ')[0] || '',
        last_name: payload.lastName || payload.last_name || payload.fullName?.split(' ').slice(1).join(' ') || '',
        gender: payload.gender,
        date_of_birth: payload.dob || payload.date_of_birth,
        phone: payload.phone,
        address: payload.address,
        parent_name: payload.parentName || payload.parent_name,
        parent_phone: payload.parentPhone || payload.parent_phone,
        course: payload.course,
        photo: payload.photo,
        status: payload.status || 'Active',
      };
    }

    const { data } = await api.put(`students/${id}/`, requestPayload, { headers });
    return data?.data ? normalizeStudent(data.data) : normalizeStudent(data);
  } catch (error) {
    console.error('Failed to update student on backend.', error);
    throw error;
  }
}

export async function deleteStudent(id) {
  try {
    await api.delete(`students/${id}/`, { headers: authHeaders() });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete student on backend.', error);
    return { success: false };
  }
}
