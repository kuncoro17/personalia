import { Pagination } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import { apiClient } from "../../../../service/api";
import Loading from "../../../../components/common/Loading";
import NoData from "../../../../components/common/NoData";
import { useMaster } from "../../../../hooks/useMaster";
import { EMPLOYEEENDPOINT } from "../../../../constants/api";

export default function NewEmployees({ limitPage }) {
  const { getToken } = useAuth();
  const api = apiClient(getToken);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const { data, isFetching } = useMaster(
    api,
    ["newKaryawan", page, limitPage],
    EMPLOYEEENDPOINT.joinToday,
  );

  if (isFetching) return <Loading />;
  if (!data?.length) return <NoData />;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {data.data &&
        data.data.original.data.data.map((item) => (
          <button
            className="w-full border-2 flex border-primary rounded-lg h-28 gap-5 p-3 items-end"
            key={item.nama_lengkap}
            onClick={() =>
              navigate("/detailKaryawan", {
                state: { id: item.id_karyawan, title: "Detail Karyawan" },
              })
            }
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
                {item.status_karyawan.replace(/-/g, " ")}
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

      <Pagination
        showControls
        initialPage={page}
        onChange={setPage}
        total={data?.data.original.last_page || 1}
        className="font-Poppins"
      />
    </div>
  );
}
