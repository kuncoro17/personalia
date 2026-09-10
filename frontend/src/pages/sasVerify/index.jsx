import { Button, Spinner } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { apiClient, apiService } from "../../service/api";
import {
  getSasSdmUrl,
  markSasEntry,
  setSasSession,
} from "../../utils/sasSession";

export default function SasVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verifyToken = searchParams.get("token") || "";
  const api = useMemo(() => apiClient(() => ""), []);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Memverifikasi akses dari SAS...");

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (!verifyToken) {
        setStatus("error");
        setMessage("Verify token tidak ditemukan.");
        return;
      }

      try {
        const response = await apiService("post", api, "auth/sas/verify", {
          verify_token: verifyToken,
        });
        const data = response?.data;

        if (!data?.token) {
          throw new Error("Response verifikasi tidak valid.");
        }

        setSasSession({
          token: data.token,
          user: data.user,
        });
        markSasEntry();

        if (!isMounted) return;
        setStatus("success");
        setMessage("Akses berhasil diverifikasi.");
        navigate("/", { replace: true });
      } catch (err) {
        if (!isMounted) return;
        setStatus("error");
        setMessage(err?.message || "Verifikasi SAS gagal.");
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [api, navigate, verifyToken]);

  return (
    <main className="personalia-app flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="personalia-card flex w-full max-w-md flex-col items-center gap-4 p-6 text-center">
        <img
          src="/assets/images/logo_penabur.png"
          alt="Logo BPK PENABUR"
          className="h-16 w-16 object-contain"
        />
        {status === "loading" ? <Spinner size="lg" color="primary" /> : null}

        <h1 className="text-xl font-semibold text-slate-950 dark:text-slate-100">
          Verifikasi SAS
        </h1>
        <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
          {message}
        </p>

        {status === "error" ? (
          <Button
            className="personalia-action-button personalia-action-button-primary"
            color="primary"
            radius="sm"
            onPress={() => {
              window.location.href = getSasSdmUrl();
            }}
          >
            Kembali ke SAS
          </Button>
        ) : null}
      </section>
    </main>
  );
}
