import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import { Badge, Card } from "../../../../components/ui";
import { apiClient } from "../../../../service/api";
import Loading from "../../../../components/common/Loading";
import NoData from "../../../../components/common/NoData";
import { useMaster } from "../../../../hooks/useMaster";
import { EMPLOYEEENDPOINT } from "../../../../constants/api";
import { getNewEmployeeStatus, normalizeJoinTodayResponse } from "../../utils";

export default function NewEmployees({ limitPage }) {
  const { getToken } = useAuth();
  const api = apiClient(getToken);
  const navigate = useNavigate();

  const { data, isFetching } = useMaster(
    api,
    ["newKaryawan", "join-today"],
    EMPLOYEEENDPOINT.joinToday,
  );

  const employees = normalizeJoinTodayResponse(data).slice(
    0,
    Number(limitPage) || 10,
  );

  if (isFetching) return <Loading />;
  if (!employees.length) return <NoData />;

  return (
    <div className="mt-4 flex flex-col gap-4">
      {employees.map((item) => (
        <Card
          as="button"
          className="flex min-h-28 w-full items-center gap-4 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:hover:bg-slate-900"
          key={item.id_karyawan}
          type="button"
          onClick={() => navigate(`/detailEmployee/${item.id_karyawan}`)}
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <i className="fi fi-rr-user text-xl" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="truncate text-base font-semibold text-slate-950 dark:text-slate-100">
              {item.nama_lengkap}
            </p>
            <p className="text-sm font-semibold uppercase leading-5 text-blue-700 dark:text-blue-300">
              {String(getNewEmployeeStatus(item)).replace(/-/g, " ")}
            </p>
          </div>

          <Badge variant="warning" className="hidden gap-2 sm:inline-flex">
            <img src="/icon/cetakSurat.svg" alt="" className="h-4 w-4" />
            <p>
              Print Letter
            </p>
          </Badge>
        </Card>
      ))}
    </div>
  );
}
