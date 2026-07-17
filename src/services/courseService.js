import api from './api.js';

const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const normalizeCourse = (item) => ({
  id: item?.id,
  name: item?.name || item?.course_name || item?.title || item?.course || '',
  raw: item,
});

export async function fetchCourses() {
  try {
    const { data } = await api.get('courses/');
    return extractList(data).map(normalizeCourse);
  } catch (error) {
    console.error('Failed to fetch courses from backend.', error);
    return [];
  }
}
