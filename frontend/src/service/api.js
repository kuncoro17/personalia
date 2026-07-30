import { addToast } from "@heroui/toast";
import axios from "axios";

import { useToastSlice } from "../stores/useToast";
import { clearSasSession, getSasSessionToken } from "../utils/sasSession";

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

const isCloudflareChallengePayload = (payload) => {
  if (typeof payload !== "string") return false;

  return (
    /<title>Just a moment\.\.\.<\/title>/i.test(payload) ||
    /cf-challenge|cloudflare/i.test(payload)
  );
};

const toDisplayString = (value) => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (value instanceof Error) return value.message || value.name || "Error";

  if (typeof value === "object") {
    const maybeMessage =
      typeof value.message === "string"
        ? value.message
        : typeof value.error === "string"
          ? value.error
          : "";

    if (maybeMessage) return maybeMessage;

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
};

export const apiClient = (getToken) => {
  const showToastOnce = (toastMessage, toastConfig) => {
    const { message, setMessage, deleteMessage } = useToastSlice.getState();

    const normalizedToastMessage =
      toDisplayString(toastMessage) || "Unknown error";

    if (message.includes(normalizedToastMessage)) return;

    setMessage(normalizedToastMessage);
    addToast({
      ...toastConfig,
      onClose: () => {
        deleteMessage(normalizedToastMessage);
      },
    });
  };

  const api = axios.create({
    baseURL: `${API_URL}/`,
    timeout: 15_000,
  });

  api.interceptors.request.use(async (config) => {
    const sasToken = getSasSessionToken();
    let clerkToken = "";

    // Pengguna yang masuk melalui portal SAS sudah memiliki JWT internal.
    // Jangan tetap meminta token Clerk untuk setiap request karena itu menambah
    // network call lintas origin dan membuat request API bergantung pada FAPI
    // Clerk/Cloudflare walaupun token SAS sudah cukup.
    if (!sasToken && typeof getToken === "function") {
      try {
        clerkToken = (await getToken()) || "";
      } catch {
        clerkToken = "";
      }
    }

    const token = sasToken || clerkToken;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        const { status, data } = error.response;
        const isCloudflareChallenge = isCloudflareChallengePayload(data);

        const message =
          (isCloudflareChallenge &&
            "Request diblok oleh Cloudflare/WAF sebelum mencapai API.") ||
          data?.detail ||
          data?.message ||
          data?.error ||
          `Server responded with status ${status}`;

        const normalizedMessage = toDisplayString(message);

        if (isCloudflareChallenge) {
          showToastOnce("Cloudflare blocked request", {
            title: "Blocked by Cloudflare",
            description:
              "Request diblok oleh halaman challenge Cloudflare/WAF. Backend API kemungkinan belum menerima request ini.",
            color: "danger",
          });
        }

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

        if (status === 401 && getSasSessionToken()) {
          clearSasSession();
        }

        const normalizedPayload = (() => {
          if (isCloudflareChallenge) {
            return {
              provider: "cloudflare",
              challenge: true,
              raw: data,
              message: normalizedMessage,
            };
          }

          if (data && typeof data === "object") {
            const rawMessage = data?.message;

            if (typeof rawMessage !== "string") {
              return { ...data, message: normalizedMessage };
            }
          }

          return data;
        })();

        return Promise.reject({
          type: "HTTP_ERROR",
          status,
          payload: normalizedPayload,
          message: normalizedMessage,
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
            ? `Browser memblokir request cross-origin (${frontendOrigin} → ${apiOrigin}). Pastikan backend mengizinkan origin ini dan request tidak diblok WAF/Cloudflare.`
            : message,
          color: "danger",
        });

        return Promise.reject({
          type: "NO_RESPONSE",
          message: likelyCorsIssue
            ? `Kemungkinan diblok CORS (${frontendOrigin} → ${apiOrigin}). Cek konfigurasi backend / Cloudflare.`
            : "Tidak mendapat respons dari server. Cek koneksi internet?",
        });
      }

      const msg = error?.message || "Unknown error";

      const normalizedMsg = toDisplayString(msg) || "Unknown error";

      showToastOnce(normalizedMsg, {
        title: "Unknown Error",
        description: normalizedMsg,
        color: "danger",
      });

      return Promise.reject({
        type: "UNKNOWN_ERROR",
        message: normalizedMsg,
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
    throw error;
  }
};
