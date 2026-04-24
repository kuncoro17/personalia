import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import Layout from "../../components/layout";
import { apiClient, resolveApiAssetUrl } from "../../service/api";
import { useMaster } from "../../hooks/useMaster";
import { DETAILENDPOINT } from "../../constants/api";
import Detail from "./details";

export default function EmployeeDetail() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);
  const { state } = useLocation();
  const navigate = useNavigate();

  const { data } = useMaster(
    api,
    [`profile-${state.id}`],
    DETAILENDPOINT.get.profile(state.id),
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
          id_karyawan: rawData.id_karyawan || state.id,
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
      <section className="flex flex-1 justify-between pl-5 pr-16 pb-7 gap-4 w-screen">
        <div className="rounded-lg shadow-lg h-full w-48 border-1 border-[#00000010] relative">
          <div className="fixed w-48 p-5 flex flex-col gap-20">
            <div className="flex flex-col flex-1 items-center gap-1">
              <img
                src={
                  data?.foto ? resolveApiAssetUrl(data.foto) : "/image/1.svg"
                }
                alt="Foto karyawan"
                className="rounded-md aspect-square w-full"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/image/1.svg";
                }}
              />

              <p className="font-Poppins font-semibold text-primary text-center">
                {data?.nama_lengkap || "-"}
              </p>
              <p className="font-Poppins font-semibold text-primary text-center">
                {data?.nama || "-"}
              </p>
            </div>

            <div className="h-2/5 flex items-center justify-center">
              <p className="font-Poppins font-semibold text-primary">
                {data?.status || "-"}
              </p>
            </div>

            <div className="flex flex-col flex-1 gap-5 justify-between">
              <div>
                <p className="font-Poppins font-medium opacity-50 text-sm">
                  Employee ID
                </p>
                <p className="font-Poppins font-semibold text-primary">
                  {data?.nik || "-"}
                </p>
              </div>

              <div>
                <p className="font-Poppins font-medium opacity-50 text-sm">
                  Request Date
                </p>
                <p className="font-Poppins font-semibold text-primary">
                  August 8, 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div>
            <button
              type="button"
              className="h-9 px-4 rounded-md bg-primary text-white font-Poppins text-sm font-medium"
              onClick={() => navigate("/employees")}
            >
              Kembali ke Employee
            </button>
          </div>

          <Detail employeeData={data} />
        </div>
      </section>
    </Layout>
  );
}
