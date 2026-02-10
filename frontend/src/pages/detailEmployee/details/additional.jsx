import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@heroui/react";
import { useAuth } from "@clerk/clerk-react";

import { apiClient, apiService } from "../../../service/api";
import Modals from "../components/modals";
import Loading from "../../../components/common/Loading";
import { useMaster } from "../../../hooks/useMaster";
import { DETAILENDPOINT } from "../../../constants/api";
import { formatDataDetail } from "../../../utils/format";

export default function Additional() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data: tambahan, isFetching: tambahanFetching } = useMaster(
    api,
    [`tambahan-${state.id}`],
    DETAILENDPOINT.get.additional(state.id),
    {
      select: (data) => formatDataDetail("tambahan", data.data),
    },
  );

  const onUpdate = async (value, onClose) => {
    try {
      if (Object.keys(value).length === 0) {
        onClose();
        return;
      }

      const requestBody = {};

      const allowedFields = [
        "kewarganegaraan",
        "tempat_lahir",
        "birth_date",
        "gol_darah",
        "instagram",
        "twitter",
        "no_kitas",
        "no_visa",
        "no_tabita",
        "npwp",
        "rekening",
        "kode_golongan",
        "no_bpjs_ketenagakerjaan",
        "no_bpjs_danpes",
        "nama_bpjs_danpes",
        "no_pasport",
      ];

      Object.keys(value).forEach((key) => {
        if (!allowedFields.includes(key)) {
          return;
        }

        const fieldValue = value[key];

        if (["no_kitas", "no_visa", "no_pasport", "no_tabita"].includes(key)) {
          const numValue = parseInt(fieldValue);
          requestBody[key] = isNaN(numValue) ? 0 : numValue;
        } else if (key === "birth_date") {
          requestBody[key] = fieldValue || "";
        } else {
          requestBody[key] = fieldValue || "";
        }
      });

      if (Object.keys(requestBody).length === 0) {
        onClose();
        return;
      }

      await apiService(
        "put",
        api,
        DETAILENDPOINT.update.additional(state.id),
        requestBody,
      );

      queryClient.setQueryData([`tambahan-${state.id}`], (oldData) => {
        if (!oldData || !Array.isArray(oldData)) return oldData;

        return oldData.map((item) => {
          const newValue = value[item.properties];
          if (newValue !== undefined) {
            return {
              ...item,
              value: newValue,
            };
          }
          return item;
        });
      });

      queryClient.invalidateQueries([`tambahan-${state.id}`]);

      onClose();
    } catch (err) {
      console.error("Error updating additional data:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  if (tambahanFetching) return <Loading />;

  return (
    <div className="w-full justify-between flex flex-col flex-1 gap-5">
      <div className="grid grid-cols-4 gap-x-5 gap-y-10">
        {tambahan.map((item) => (
          <div key={item.title}>
            <p className="font-Poppins font-normal opacity-50 text-sm">
              {item.title}
            </p>
            <p className="font-Poppins font-semibold truncate text-primary">
              {item.value || "-"}
            </p>
          </div>
        ))}
      </div>

      <button
        className="bg-[#00000010] rounded-md h-10 flex items-center justify-center w-full"
        onClick={onOpen}
      >
        <i className="fi fi-rr-edit" />
      </button>

      <Modals
        data={tambahan}
        title="Edit Tambahan"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={onUpdate}
      />
    </div>
  );
}
