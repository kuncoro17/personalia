import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import Layout from "../../components/layout";
import { apiClient, resolveApiAssetUrl } from "../../service/api";
import { useMaster } from "../../hooks/useMaster";
import { DETAILENDPOINT } from "../../constants/api";
import Detail from "./details";

export default function EmployeeDetail() {
  const location = useLocation();
  const { employeeId: employeeIdFromUrl } = useParams();
  const employeeId = employeeIdFromUrl || location.state?.id;

  if (!employeeId) {
    return <Navigate to="/employees" replace />;
  }

  if (!employeeIdFromUrl || location.state?.id !== employeeId) {
    return (
      <Navigate
        to={`/detailEmployee/${employeeId}`}
        replace
        state={{
          ...location.state,
          id: employeeId,
          title: location.state?.title || "Detail Karyawan",
        }}
      />
    );
  }

  return <EmployeeDetailContent employeeId={employeeId} />;
}

function EmployeeDetailContent({ employeeId }) {
  const { getToken } = useAuth();
  const api = apiClient(getToken);
  const navigate = useNavigate();

  const { data } = useMaster(
    api,
    [`profile-${employeeId}`],
    DETAILENDPOINT.get.profile(employeeId),
    {
      select: (data) => {
        const rawData = data.data;

        // Extract status karyawan dengan multiple fallbacks
        let statusKaryawan = "-";

        if (rawData.kode_status_karyawan) {
          // Jika object dengan property 'nama'
          if (
            typeof rawData.kode_status_karyawan === "object" &&
            rawData.kode_status_karyawan.nama
          ) {
            statusKaryawan = rawData.kode_status_karyawan.nama.trim();
          }
          // Jika object dengan property 'kode'
          else if (
            typeof rawData.kode_status_karyawan === "object" &&
            rawData.kode_status_karyawan.kode
          ) {
            statusKaryawan = rawData.kode_status_karyawan.kode.trim();
          }
          // Jika string langsung
          else if (typeof rawData.kode_status_karyawan === "string") {
            statusKaryawan = rawData.kode_status_karyawan.trim();
          }
        }

        // Fallback ke 'status' jika masih "-"
        if (statusKaryawan === "-" && rawData.status) {
          if (typeof rawData.status === "object" && rawData.status.nama) {
            statusKaryawan = rawData.status.nama.trim();
          } else if (typeof rawData.status === "string") {
            statusKaryawan = rawData.status.trim();
          }
        }

        // Check other possible fields
        if (statusKaryawan === "-") {
          // Try stat_karyawan_gp
          if (rawData.stat_karyawan_gp) {
            if (typeof rawData.stat_karyawan_gp === "string") {
              statusKaryawan = rawData.stat_karyawan_gp.trim();
            }
          }

          // Try status_karyawan
          if (statusKaryawan === "-" && rawData.status_karyawan) {
            if (typeof rawData.status_karyawan === "string") {
              statusKaryawan = rawData.status_karyawan.trim();
            }
          }
        }

        return {
          id_karyawan: rawData.id_karyawan || employeeId,
          foto: rawData.foto || "",
          nama_lengkap: rawData.nama_lengkap || "-",
          jabatan: rawData.jabatan || "-",
          status: statusKaryawan,
          nik: rawData.nik || "-",
        };
      },
    },
  );

  return (
    <Layout>
      <section className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="personalia-card h-full p-5">
          <div className="flex h-full flex-col gap-8">
            <div className="flex flex-col flex-1 items-center gap-1">
              <img
                src={
                  data?.foto ? resolveApiAssetUrl(data.foto) : "/image/1.svg"
                }
                alt="Foto karyawan"
                className="aspect-square w-full rounded-md object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/image/1.svg";
                }}
              />

              <p className="text-center font-semibold text-slate-900 dark:text-slate-100">
                {data?.nama_lengkap || "-"}
              </p>
              <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                {data?.nama || "-"}
              </p>
            </div>

            <div className="h-2/5 flex items-center justify-center">
              <p className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                {data?.status || "-"}
              </p>
            </div>

            <div className="flex flex-col flex-1 gap-5 justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  ID Karyawan
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {data?.nik || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-400">
                  Tanggal Pengajuan
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  August 8, 2025
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col gap-3">
          <div>
            <button
              type="button"
              className="personalia-action-button personalia-action-button-light"
              onClick={() => navigate("/employees")}
            >
              <i className="fi fi-rr-arrow-left" />
              Kembali ke Karyawan
            </button>
          </div>

          <Detail employeeData={data} />
        </div>
      </section>
    </Layout>
  );
}
