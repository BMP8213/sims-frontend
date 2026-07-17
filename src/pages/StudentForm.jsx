import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createStudent, fetchStudentById, updateStudent } from "../services/studentService.js";
import { fetchCourses } from "../services/courseService.js";

const genderOptions = ["Male", "Female", "Other"];
const statusOptions = ["Active", "Inactive", "Pending"];

export default function StudentForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [courseOptions, setCourseOptions] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      student_code: "",
      first_name: "",
      last_name: "",
      gender: "Male",
      date_of_birth: "",
      phone: "",
      address: "",
      parent_name: "",
      parent_phone: "",
      course: "",
      photo: null,
      status: "Active",
    },
  });

  const navigate = useNavigate();
  const photoValue = watch("photo");
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchStudentById(id).then((student) => {
        if (student) {
          reset({
            student_code: student.student_code || student.id || "",
            first_name: student.first_name || "",
            last_name: student.last_name || "",
            gender: student.gender || "Male",
            date_of_birth: student.date_of_birth || "",
            phone: student.phone || "",
            address: student.address || "",
            parent_name: student.parent_name || "",
            parent_phone: student.parent_phone || "",
            course: student.course ?? "",
            photo: null, // file upload handled separately
            status: student.status || "Active",
          });
          setPreview(student.photo);
        }
        setLoading(false);
      });
    }
  }, [id, reset]);

  useEffect(() => {
    fetchCourses().then((courses) => {
      const normalized = courses
        .filter((course) => course?.name)
        .map((course) => ({ id: course.id, name: course.name }));
      setCourseOptions(normalized);

      if (normalized.length > 0 && !watch('course')) {
        setValue('course', '');
      }
    });
  }, [setValue, watch]);

  useEffect(() => {
    if (photoValue && photoValue[0]) {
      const file = photoValue[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [photoValue]);

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    setSubmitError("");

    // ensure user is authenticated before attempting to post
    if (!token) {
      setSubmitLoading(false);
      setSubmitError('You must be signed in to perform this action.');
      navigate('/login');
      return;
    }

    const payload = {
        studentCode: data.student_code || `STU${Date.now().toString().slice(-4)}`,
        firstName: data.first_name,
        lastName: data.last_name,
        gender: data.gender,
        dob: data.date_of_birth,
        phone: data.phone,
        address: data.address,
        parentName: data.parent_name,
        parentPhone: data.parent_phone,
        course: data.course || null,
        photo: data.photo && data.photo[0] ? data.photo[0] : null,
        status: data.status || "Active",
      };
    try {
      let result = null;
      if (id) {
        result = await updateStudent(id, payload);
      } else {
        result = await createStudent(payload);
      }

      if (!result) {
        // service logged the error; show generic message
        setSubmitError('Failed to submit student. See console for details.');
        setSubmitLoading(false);
        return;
      }

      setSubmitLoading(false);
      navigate("/students");
    } catch (err) {
      console.error('Submit error:', err);
      // prefer backend-provided detail message
      const backendDetail = err?.response?.data?.detail || err?.response?.data || null;
      const message = typeof backendDetail === 'string' ? backendDetail : JSON.stringify(backendDetail || err?.message || 'An unexpected error occurred');
      setSubmitError(message);
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-[1300px] gap-6 px-4 py-6">
        <Sidebar />
        <main className="flex-1">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                {id ? "Edit Student" : "Register Student"}
              </h2>
              <p className="text-sm text-slate-500">
                Complete the student registration form and save the profile.
              </p>
            </div>
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                Loading student profile...
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]"
              >
                {submitError && (
                  <div className="col-span-full rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}
                <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <label>
                    Student Code
                    <input
                      {...register("student_code", { required: "Student code is required" })}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                      placeholder="STU012"
                    />
                    {errors.student_code && (
                      <p className="text-red-500 text-sm">{errors.student_code.message}</p>
                    )}
                  </label>
                  <label>
                    First Name
                    <input
                      {...register("first_name", { required: "First name is required" })}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                    )}
                  </label>
                  <label>
                    Last Name
                    <input
                      {...register("last_name", { required: "Last name is required" })}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                    )}
                  </label>
                  <label>
                    Gender
                    <select
                      {...register("gender")}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    >
                      {genderOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Date of Birth
                    <input
                      {...register("date_of_birth", { required: "Date of birth is required" })}
                      type="date"
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    />
                    {errors.date_of_birth && (
                      <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>
                    )}
                  </label>
                  <label>
                    Phone
                    <input
                      {...register("phone")}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    />
                  </label>
                  <label>
                    Address
                    <textarea
                      {...register("address")}
                      rows="3"
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    />
                  </label>
                  <label>
                    Parent Name
                    <input
                      {...register("parent_name")}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    />
                  </label>
                  <label>
                    Parent Phone
                    <input
                      {...register("parent_phone")}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    />
                  </label>
                  <label>
                    Course
                    <select
                      {...register("course")}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    >
                      <option value="">Select course</option>
                      {courseOptions.length > 0 ? (
                        courseOptions.map((courseOption) => (
                          <option key={courseOption.id} value={courseOption.id}>
                            {courseOption.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No courses available
                        </option>
                      )}
                    </select>
                  </label>
                  <label>
                    Photo
                    <input
                      type="file"
                      accept="image/*"
                      {...register("photo")}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    />
                  </label>
                  <label>
                    Status
                    <select
                      {...register("status")}
                      className="mt-2 w-full rounded-3xl border px-4 py-3 text-sm"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="space-y-5 rounded-3xl border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <div className="flex items-center gap-4 rounded-3xl border bg-slate-50 p-4">
                    <div className="h-24 w-24 overflow-hidden rounded-3xl bg-slate-200">
                      {preview ? (
                        <img src={preview} alt="Student preview" className="h-24 w-24 object-cover" />
                      ) : (
                        <svg className="h-24 w-24" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
                          <rect width="96" height="96" fill="#E2E8F0" />
                          <g fill="#94A3B8">
                            <circle cx="48" cy="34" r="16" />
                            <path d="M18 78c0-14 12-26 30-26s30 12 30 26H18z" />
                          </g>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {watch("first_name")} {watch("last_name") || "Student Name"}
                      </p>
                      <p className="mt-2 text-sm">Status: {watch("status")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => navigate("/students")}
                      className="rounded-3xl border px-5 py-3 text-sm">Cancel</button>
                    <button type="submit" disabled={submitLoading} className="rounded-3xl bg-brand-600 px-5 py-3 text-sm text-white">
                      {submitLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
