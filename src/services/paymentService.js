import api from './api.js';

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const normalizePayment = (item) => ({
  id: item?.id,
  student: item?.student_name || item?.student || item?.student?.full_name || '',
  course: item?.course_name || item?.course || item?.course?.name || null,
  amount: item?.amount || 0,
  date: item?.date || item?.payment_date || '',
  status: item?.status || 'Pending',
  raw: item,
});

export async function fetchPayments() {
  try {
    const { data } = await api.get('payments/');
    return extractList(data).map(normalizePayment);
  } catch (error) {
    console.error('Failed to fetch payments from backend.', error);
    return [];
  }
}

export async function createPayment(payload) {
  try {
    const requestPayload = {
      student_name: payload.student,
      amount: payload.amount,
      date: payload.date,
      status: payload.status,
    };
    const { data } = await api.post('payments/', requestPayload);
    return normalizePayment(data?.data ?? data);
  } catch (error) {
    console.error('Failed to create payment on backend.', error);
    return null;
  }
}

export async function updatePayment(id, payload) {
  try {
    const requestPayload = {
      student_name: payload.student,
      amount: payload.amount,
      date: payload.date,
      status: payload.status,
    };
    const { data } = await api.put(`payments/${id}/`, requestPayload);
    return normalizePayment(data?.data ?? data);
  } catch (error) {
    console.error('Failed to update payment on backend.', error);
    return null;
  }
}
