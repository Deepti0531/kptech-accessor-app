import axios from "axios";

import { getToken } from "./auth/services/authStorage";

// kptech-backend mounts every router at the root (e.g. /assessor/login) —
// there is no /api prefix. Override EXPO_PUBLIC_API_URL in a .env file to
// point at a different host; this LAN IP is only a fallback for on-device dev.
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.88.2:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,

  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the stored JWT to every request that has one. The login call itself
// runs before a token exists, so this is a harmless no-op for it.
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
