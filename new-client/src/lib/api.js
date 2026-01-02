import axios from "axios";

// Use relative base for dev so Vite proxy keeps cookies same-origin.
// Fallback to env when explicitly provided (e.g., production).
const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true, // ensure cookies are sent
});
