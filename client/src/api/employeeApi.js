import axios from "./axiosInstance";

export const uploadCSVApi = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post("/employees/upload-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const getEmployeesApi = () => axios.get("/employees");
export const createEmployeeApi = (data) => axios.post("/employees", data);
export const updateEmployeeApi = (id, data) => axios.put(`/employees/${id}`, data);
export const deleteEmployeeApi = (id) => axios.delete(`/employees/${id}`);
export const predictManyApi = (employeeIds) =>
  axios.post("/employees/predict", { employeeIds });
export const predictOneApi = (id) => axios.post(`/employees/${id}/predict`);
