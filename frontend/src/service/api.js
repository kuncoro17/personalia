import { addToast } from "@heroui/toast";
import axios from "axios";

import { useToastSlice } from "../stores/useToast";

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = (getToken) => {
  const { message: messageToast, setMessage, deleteMessage } = useToastSlice();

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
        if (!messageToast.includes("Tidak mendapat respons dari server")) {
          setMessage("Tidak mendapat respons dari server");
          addToast({
            title: "No Response",
            description: "Tidak mendapat respons dari server",
            color: "danger",
            onClose: () => {
              deleteMessage("Tidak mendapat respons dari server");
            },
          });
        }

        return Promise.reject({
          type: "NO_RESPONSE",
          message: "Tidak mendapat respons dari server. Cek koneksi internet?",
        });
      }

      const msg = error?.message || "Unknown error";

      if (!messageToast.includes(msg)) {
        setMessage(msg);
        addToast({
          title: "Unknown Error",
          description: msg,
          color: "danger",
          onClose: () => {
            deleteMessage(msg);
          },
        });
      }

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
    const response = await api[method](endpoint, body);

    return response?.data ?? null;
  } catch (error) {
    return [];
  }
};
