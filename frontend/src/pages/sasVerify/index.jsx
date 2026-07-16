import { Button, Spinner } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { apiClient, apiService } from "../../service/api";
import { setSasSession } from "../../utils/sasSession";

const getPortalUrl = () =>
  import.meta.env.VITE_SAS_PORTAL_URL ||
  import.meta.env.VITE_CLERK_SIGN_IN_URL ||
  "/";

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
    <main className="min-h-screen flex items-center justify-center p-6 bg-white">
      <section className="w-full max-w-md text-center flex flex-col items-center gap-4">
        {status === "loading" ? <Spinner size="lg" color="primary" /> : null}

        <h1 className="font-Poppins text-xl font-semibold text-primary">
          Verifikasi SAS
        </h1>
        <p className="font-Poppins text-sm text-primary/70">{message}</p>

        {status === "error" ? (
          <Button
            color="primary"
            radius="sm"
            onPress={() => {
              window.location.href = getPortalUrl();
            }}
          >
            Kembali ke SAS
          </Button>
        ) : null}
      </section>
    </main>
  );
}
