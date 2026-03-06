import axios from "./axiosInstance";

export const loginApi = (data) => axios.post("/auth/login", data);
export const registerApi = (data) => axios.post("/auth/register", data);
