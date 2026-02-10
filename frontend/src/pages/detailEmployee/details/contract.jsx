import { useAuth } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { apiClient } from "../../../service/api";
import Modals from "../components/modals";
import Loading from "../../../components/common/Loading";
import { useMaster } from "../../../hooks/useMaster";
import { PROPERTIES } from "../constant";
import { DETAILENDPOINT } from "../../../constants/api";

export default function Contract() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedEdit, setSelectedEdit] = useState(0);

  const { data: kontrak, isFetching: kontrakFetching } = useMaster(
    api,
    [`kontrak-${state.id}`],
    DETAILENDPOINT.get.contract(state.id),
  );

  const hasKontrak = (kontrak?.data || []).length > 0;

  const onUpdate = (value) => {
    try {
      queryClient.setQueryData([`kontrak-${state.id}`], (oldRaw) => {
        if (!oldRaw) return oldRaw;
        const next =
          typeof structuredClone === "function"
            ? structuredClone(oldRaw)
            : JSON.parse(JSON.stringify(oldRaw));

        const applyToList = (list) => {
          const arr = Array.isArray(list) ? [...list] : [];
          const targetIndex = Number.isFinite(selectedEdit) ? selectedEdit : 0;
          const current = arr[targetIndex] ?? {};
          const updated = { ...(current || {}) };

          Object.entries(value).forEach(([key, val]) => {
            updated[key] = val;
          });

          arr[targetIndex] = updated;
          return arr;
        };

        let result = next;

        if (Array.isArray(next)) {
          result = applyToList(next);
        } else if (next && typeof next === "object") {
          next.data = applyToList(next.data);
          result = next;
        }

        return result;
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (kontrakFetching) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-5">
      {!hasKontrak ? (
        <div className="flex justify-center items-center flex-1 flex-col gap-10">
          <p className="font-Poppins">Tidak ada data kontrak</p>

          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedEdit(0);
              onOpen();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="#344561"
                d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
              />
            </svg>

            <p className="font-Poppins font-semibold text-primary">
              Tambah Data Lokasi
            </p>
          </button>
        </div>
      ) : (
        <p>Kontrak</p>
      )}

      <Modals
        data={PROPERTIES.lokasi}
        title={`Edit Lokasi Kerja ${selectedEdit === 0 ? "Utama" : selectedEdit + 1}`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={onUpdate}
      />
    </div>
  );
}
