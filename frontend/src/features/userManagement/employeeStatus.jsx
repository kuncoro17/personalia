import { useAuth } from "@clerk/clerk-react";

import { apiClient } from "../../service/api";
import Loading from "../../components/common/Loading";
import NoData from "../../components/common/NoData";
import { useMaster } from "../../hooks/useMaster";
import { MASTERENDPOINT } from "../../constants/api";

export default function EmployeeStatus() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const api = apiClient(getToken);

  const {
    data: statusSummary = {},
    isFetching,
    error,
  } = useMaster(api, ["statusKaryawan"], MASTERENDPOINT.statusKaryawan, {
    enabled: isLoaded && isSignedIn,
    returnEmptyOnError: false,
    select: (response) => {
      const rows = response?.data ?? [];
      if (!rows.length) return {};

      return rows.reduce((acc, item) => {
        const code = (item.stat_karyawan_gp ?? "").trim().replace("-", " ");

        if (!code) return acc;
        acc[code] = (acc[code] ?? 0) + 1;
        return acc;
      }, {});
    },
  });

  if (isFetching) return <Loading />;
  if (error)
    return (
      <div className="w-full flex items-center justify-center min-h-20">
        <p className="font-Poppins text-primary opacity-70 text-center">
          {error.message || "Gagal memuat status karyawan"}
        </p>
      </div>
    );
  if (!Object.keys(statusSummary).length) return <NoData />;

  return (
    <div className="grid grid-cols-6 gap-5">
      {Object.keys(statusSummary).map((key, index) => (
        <div
          key={key}
          className={`h-16 rounded-lg flex items-center gap-3 ${
            index % 2 === 0 ? "bg-red" : "bg-primary"
          }`}
        >
          <div className="bg-white h-4/6 aspect-square rounded-md ml-2 flex items-center justify-center">
            <p className="font-Poppins font-[600] text-center">{key}</p>
          </div>

          <p className="font-Poppins font-[600] text-white text-lg">
            {statusSummary[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
