import { useAuth } from "@clerk/clerk-react";

import { apiClient } from "../../service/api";
import { Badge, Card } from "../../components/ui";
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
      <div className="flex min-h-20 w-full items-center justify-center">
        <p className="text-center text-sm text-slate-500 dark:text-slate-300">
          {error.message || "Gagal memuat status karyawan"}
        </p>
      </div>
    );
  if (!Object.keys(statusSummary).length) return <NoData />;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Object.keys(statusSummary).map((key, index) => (
        <Card
          key={key}
          className="flex min-h-16 min-w-0 items-center gap-3 p-3"
        >
          <Badge variant={index % 2 === 0 ? "destructive" : "default"}>
            {key}
          </Badge>

          <p className="truncate text-lg font-semibold text-slate-950 dark:text-slate-100">
            {statusSummary[key]}
          </p>
        </Card>
      ))}
    </div>
  );
}
