import { addToast } from "@heroui/toast";
import axios from "axios";

import { useToastSlice } from "../stores/useToast";

const getResolvedApiUrl = () => {
  const configuredApiUrl = String(import.meta.env.VITE_API_URL || "").trim();
  const isLocalHost =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname);

  if (!configuredApiUrl && isLocalHost) {
    return "http://localhost:3001";
  }

  return configuredApiUrl;
};

const API_URL = getResolvedApiUrl();

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

        if (
          status === 401 &&
          typeof data?.message === "string" &&
          /missing authorization/i.test(data.message)
        ) {
          showToastOnce("Authentication required", {
            title: "Unauthorized",
            description:
              "Request ditolak karena tidak ada header Authorization. Pastikan sudah login dan token berhasil dibuat.",
            color: "danger",
          });
        }

        return Promise.reject({
          type: "HTTP_ERROR",
          status,
          payload: data,
          message,
        });
      }

      if (error.request) {
        const isBrowser = typeof window !== "undefined";
        const frontendOrigin = isBrowser ? window.location.origin : "";
        const message = "Tidak mendapat respons dari server";

        const apiOrigin = (() => {
          try {
            return API_URL ? new URL(API_URL).origin : "";
          } catch {
            return "";
          }
        })();

        const likelyCorsIssue =
          isBrowser &&
          apiOrigin &&
          frontendOrigin &&
          apiOrigin !== frontendOrigin;

        showToastOnce(message, {
          title: likelyCorsIssue ? "CORS Blocked" : "No Response",
          description: likelyCorsIssue
            ? `Browser memblokir request cross-origin (${frontendOrigin} → ${apiOrigin}). Gunakan same-origin '/api' di staging atau pastikan request tidak diblok WAF/Cloudflare.`
            : message,
          color: "danger",
        });

        return Promise.reject({
          type: "NO_RESPONSE",
          message: likelyCorsIssue
            ? `Kemungkinan diblok CORS (${frontendOrigin} → ${apiOrigin}). Gunakan '/api' di staging atau cek Cloudflare/WAF.`
            : "Tidak mendapat respons dari server. Cek koneksi internet?",
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

export const resolveApiAssetUrl = (assetPath) => {
  if (!assetPath) return "";

  const rawPath = String(assetPath)
    .trim()
    .replace(/^['"]|['"]$/g, "");

  if (!rawPath) return "";

  const normalizedPath = rawPath.replace(/\\/g, "/");

  if (/^(data:|blob:|https?:\/\/)/i.test(normalizedPath)) {
    return normalizedPath;
  }

  if (/^\/\//.test(normalizedPath)) {
    const protocol =
      typeof window !== "undefined" ? window.location.protocol : "https:";

    return `${protocol}${normalizedPath}`;
  }

  // Handle domain/path values stored without protocol, e.g. cloudinary.com/...
  if (/^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i.test(normalizedPath)) {
    return `https://${normalizedPath}`;
  }

  const normalizedBase = String(API_URL || "").replace(/\/+$/, "");
  const relativePath = normalizedPath.replace(/^\.?\/+/, "");

  return normalizedBase ? `${normalizedBase}/${relativePath}` : normalizedPath;
};

const stripLeadingSlash = (path = "") => path.replace(/^\/+/, "");

export const apiService = async (method, api, params, body = {}) => {
  const normalizedMethod = String(method || "").toLowerCase();

  try {
    const endpoint = stripLeadingSlash(params);
    const response =
      normalizedMethod === "delete"
        ? await api.delete(
            endpoint,
            body && Object.keys(body).length > 0 ? { data: body } : undefined,
          )
        : await api[normalizedMethod](endpoint, body);

    return response?.data ?? null;
  } catch (error) {
    if (normalizedMethod === "get") {
      return [];
    }

    throw error;
  }
};
