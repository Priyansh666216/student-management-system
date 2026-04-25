import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/students`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const studentService = {
  createStudent: async (studentData) => (await apiClient.post("", studentData)).data,
  getAllStudents: async () => (await apiClient.get("")).data,
  getStudentById: async (id) => (await apiClient.get(`/${id}`)).data,
  updateStudent: async (id, studentData) => (await apiClient.put(`/${id}`, studentData)).data,
  deleteStudent: async (id) => (await apiClient.delete(`/${id}`)).data,
  searchStudents: async (keyword) => (await apiClient.get(`/search?keyword=${keyword}`)).data,
};

export default studentService;