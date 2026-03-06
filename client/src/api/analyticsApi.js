import axios from "./axiosInstance";

export const getSummaryApi = () => axios.get("/analytics/summary");
export const getDepartmentAnalyticsApi = () => axios.get("/analytics/department");
