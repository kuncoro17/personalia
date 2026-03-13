import { addToast } from "@heroui/toast";
import axios from "axios";

import { useToastSlice } from "../stores/useToast";

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = (getToken) => {
  const showToastOnce = (toastMessage, toastConfig) => {
    const { message, setMessage, deleteMessage } = useToastSlice.getState();

    if (message.includes(toastMessage)) return;

    setMessage(toastMessage);
    addToast({
      ...toastConfig,
      onClose: () => {
        deleteMessage(toastMessage);
      },
    });
  };

  const api = axios.create({
    baseURL: `${API_URL}/`,
    timeout: 15_000,
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        const { status, data } = error.response;

        const message =
          data?.detail ||
          data?.message ||
          data?.error ||
          `Server responded with status ${status}`;

        return Promise.reject({
          type: "HTTP_ERROR",
          status,
          payload: data,
          message,
        });
      }

      if (error.request) {
        showToastOnce("Tidak mendapat respons dari server", {
          title: "No Response",
          description: "Tidak mendapat respons dari server",
          color: "danger",
        });

        return Promise.reject({
          type: "NO_RESPONSE",
          message: "Tidak mendapat respons dari server. Cek koneksi internet?",
        });
      }

      const msg = error?.message || "Unknown error";

      showToastOnce(msg, {
        title: "Unknown Error",
        description: msg,
        color: "danger",
      });

      return Promise.reject({
        type: "UNKNOWN_ERROR",
        message: msg,
      });
    },
  );

  return api;
};

// Backward-compatible export for existing imports.
export const useApiClient = apiClient;

const stripLeadingSlash = (path = "") => path.replace(/^\/+/, "");

export const apiService = async (method, api, params, body = {}) => {
  try {
    const endpoint = stripLeadingSlash(params);
    const normalizedMethod = String(method || "").toLowerCase();
    const response =
      normalizedMethod === "delete"
        ? await api.delete(
            endpoint,
            body && Object.keys(body).length > 0 ? { data: body } : undefined,
          )
        : await api[normalizedMethod](endpoint, body);

    return response?.data ?? null;
  } catch {
    return [];
  }
};
