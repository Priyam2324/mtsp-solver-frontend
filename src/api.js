import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const optimize = (data) =>
  axios.post(`${API}/optimize`, data);