import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

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
    <div className="flex flex-col gap-4 mt-4">
      {employees.map((item) => (
        <button
          className="w-full border-2 flex border-primary rounded-lg h-28 gap-5 p-3 items-end"
          key={item.id_karyawan}
          type="button"
          onClick={() => navigate(`/detailEmployee/${item.id_karyawan}`)}
        >
          <div
            style={{
              height: "100%",
              aspectRatio: 1,
              backgroundColor: "gray",
              borderRadius: 5,
              opacity: 0.5,
            }}
          />

          <div className="flex flex-col justify-between flex-1 h-full items-start">
            <p className="font-Poppins font-medium text-primary text-lg">
              {item.nama_lengkap}
            </p>
            <p className="font-Poppins font-bold text-xl text-primary">
              {String(getNewEmployeeStatus(item)).replace(/-/g, " ")}
            </p>
          </div>

          <div className="flex gap-2 bg-yellow p-1 rounded-md px-2">
            <img src="/icon/cetakSurat.svg" />
            <p className="font-Poppins font-semibold text-primary">
              Print Letter
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
