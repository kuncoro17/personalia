import { useAuth } from "@clerk/clerk-react";

import { apiClient } from "../../service/api";
import Loading from "../../components/common/Loading";
import NoData from "../../components/common/NoData";
import { useMaster } from "../../hooks/useMaster";
import { EMPLOYEEENDPOINT } from "../../constants/api";

export default function EmployeeStatus() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const api = apiClient(getToken);

  const {
    data: statusSummary = {},
    isFetching,
    error,
  } = useMaster(api, ["statusKaryawan"], EMPLOYEEENDPOINT.statusKaryawan, {
    enabled: isLoaded && isSignedIn,
    returnEmptyOnError: false,
    select: (response) => {
      const rows = response?.data ?? [];
      if (!Array.isArray(rows) || !rows.length) return {};

      return rows.reduce((acc, item) => {
        const code = String(item?.stat_karyawan_gp ?? item?.status ?? "")
          .trim()
          .replace("-", " ");
        const total = Number(item?.jumlah ?? item?.count ?? 0);

        if (!code) return acc;
        acc[code] = (acc[code] ?? 0) + (Number.isNaN(total) ? 0 : total);
        return acc;
      }, {});
    },
  });

  if (isFetching) return <Loading />;
  if (error)
    return (
      <div className="w-full flex items-center justify-center min-h-20">
        <p className="text-center font-Poppins text-primary opacity-70 dark:text-slate-300">
          {error.message || "Gagal memuat status karyawan"}
        </p>
      </div>
    );
  if (!Object.keys(statusSummary).length) return <NoData />;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Object.keys(statusSummary).map((key, index) => (
        <div
          key={key}
          className={`flex h-16 min-w-0 items-center gap-3 rounded-xl px-2 ${
            index % 2 === 0 ? "bg-red" : "bg-primary"
          }`}
        >
          <div className="flex h-11 min-w-11 items-center justify-center rounded-lg bg-white px-2 dark:bg-slate-950">
            <p className="text-center font-Poppins text-sm font-[600] text-primary dark:text-slate-100">
              {key}
            </p>
          </div>

          <p className="truncate font-Poppins text-lg font-[600] text-white">
            {statusSummary[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
