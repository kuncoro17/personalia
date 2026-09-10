import { useAuth } from "@clerk/clerk-react";
import { Chip } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout";
import Loading from "../../components/common/Loading";
import NoData from "../../components/common/NoData";
import { EMPLOYEEENDPOINT } from "../../constants/api";
import { useMaster } from "../../hooks/useMaster";
import { apiClient } from "../../service/api";
import { formatOffboardingDate, normalizeOffboardingResponse } from "./utils";

export default function OffBoardingPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const api = apiClient(getToken);

  const { data, isFetching, error } = useMaster(
    api,
    ["karyawan", "offboarding-today"],
    EMPLOYEEENDPOINT.offboardingToday,
    {
      enabled: isLoaded && isSignedIn,
      returnEmptyOnError: false,
    },
  );

  const { total, date, employees } = normalizeOffboardingResponse(data);

  return (
    <Layout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <section className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="personalia-hero-card flex flex-col gap-4 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-semibold">Offboarding</p>
            <p className="mt-1 text-sm text-white/75">
              Karyawan dengan tanggal resign {formatOffboardingDate(date)}
            </p>
          </div>

          <div className="flex min-w-28 items-center justify-center rounded-md bg-white/15 px-5 py-3">
            <div className="text-center">
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-xs text-white/75">Karyawan</p>
            </div>
          </div>
        </div>

        {isFetching && <Loading />}

        {!isFetching && error && (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-center">
            <p className="font-Poppins text-sm text-danger">
              {error.message || "Gagal memuat data offboarding"}
            </p>
          </div>
        )}

        {!isFetching && !error && !employees.length && <NoData />}

        {!isFetching && !error && employees.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {employees.map((employee) => (
              <button
                key={employee.id_karyawan}
                type="button"
            className="personalia-card flex min-w-0 flex-col gap-4 p-5 text-left transition hover:-translate-y-0"
                onClick={() =>
                  navigate(`/detailEmployee/${employee.id_karyawan}`)
                }
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {employee.nama_lengkap || "Tanpa nama"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      NIK: {employee.nik || "-"}
                    </p>
                  </div>
                  <Chip className="bg-red-50 font-semibold text-red-700 ring-1 ring-red-100" size="sm" variant="flat">
                    Resign
                  </Chip>
                </div>

                <div className="grid w-full grid-cols-1 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-400">
                      Tanggal inactive
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {employee.tanggal_inactive || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Alasan berhenti
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {employee.alasan_berhenti_kerja || "Resign"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
