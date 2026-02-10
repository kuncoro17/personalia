import { useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useDisclosure } from "@heroui/react";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../service/api";
import Loading from "../../../components/common/Loading";
import { useMaster } from "../../../hooks/useMaster";
import { PROPERTIES } from "../constant";
import { DETAILENDPOINT } from "../../../constants/api";
import Modals from "../components/modals";

export default function Salary() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);
  const queryClient = useQueryClient();

  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedSection, setSelectedSection] = useState(null);

  const { data: penggajian, isFetching: penggajianFetching } = useMaster(
    api,
    [`penggajian-${state.id}`],
    DETAILENDPOINT.get.salary(state.id),
    {
      select: (res) => {
        const d = res.data || {};

        const formatNPWPDisplay = (npwp) => {
          if (!npwp) return "";
          const digits = npwp.replace(/\D/g, "");
          if (digits.length !== 15) return npwp;

          return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}.${digits.slice(8, 9)}-${digits.slice(9, 12)}.${digits.slice(12, 15)}`;
        };

        const mappedData = {
          npwp: formatNPWPDisplay(d.npwp),
          nama_npwp: d.nama_npwp || "",
          nama_bank: d.nama_bank || "",
          rekening: d.rekening || "",
          nama_rekening: d.nama_rekening || "",
          cabang_bank: d.cabang_bank || "",
          nama_peserta_bpjs: d.nama_peserta_bpjs || "",
          nomor_bpjs_kesehatan: d.no_bpjs_kesehatan || "",
          nomor_bpjs_ketenagakerjaan: d.no_bpjs_ketenagakerjaan || "",
          nomor_bpjs_jaminan_pensiun: d.no_bpjs_danpes || "",
          no_dana_pensiun: d.no_dana_pensiun || "",
          no_tabita: d.no_tabita || "",
        };

        const formattedData = {};

        Object.keys(PROPERTIES.penggajian).forEach((section) => {
          formattedData[section] = PROPERTIES.penggajian[section].map(
            (field) => {
              if (field.form === "checkbox") {
                return {
                  ...field,
                  value: false,
                };
              }

              return {
                ...field,
                value: mappedData[field.properties] || "",
              };
            },
          );
        });

        return formattedData;
      },
    },
  );

  const salaryInput = useMemo(() => {
    if (selectedSection !== null && penggajian) {
      return penggajian[selectedSection];
    }
    return [];
  }, [selectedSection, penggajian]);

  const onUpdate = async (value, onClose) => {
    try {
      const payload = {};

      Object.keys(value).forEach((key) => {
        if (key === "npwp") {
          payload.npwp = (value[key] || "").replace(/[.-]/g, "");
        } else if (key === "nomor_bpjs_kesehatan") {
          payload.no_bpjs_kesehatan = value[key] || "";
        } else if (key === "nomor_bpjs_ketenagakerjaan") {
          payload.no_bpjs_ketenagakerjaan = value[key] || "";
        } else if (key === "nomor_bpjs_jaminan_pensiun") {
          payload.no_bpjs_danpes = value[key] || "";
        } else {
          payload[key] = value[key] || "";
        }
      });

      await api.put(DETAILENDPOINT.update.salary(state.id), payload);

      await queryClient.invalidateQueries([`penggajian-${state.id}`]);

      onClose();
    } catch (error) {
      console.error("Update Error:", error);

      if (error.type === "HTTP_ERROR") {
        if (error.message?.message) {
          alert(`Gagal menyimpan:\n\n${JSON.stringify(error.message)}`);
        } else {
          alert(`Gagal menyimpan:\n\n${error.message || "Unknown error"}`);
        }
      } else if (error.type === "NO_RESPONSE") {
        alert("Server tidak merespons. Periksa koneksi internet.");
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  if (penggajianFetching) return <Loading />;

  return (
    <div className="flex flex-col w-full gap-5">
      {Object.keys(penggajian).map((key) => (
        <div key={key}>
          <div className="flex justify-between w-full border-b-1 border-[#00000020] py-2">
            <p className="font-Poppins font-semibold text-lg text-primary">
              {key}
            </p>

            {/* Edit button */}
            <button
              onClick={() => {
                setSelectedSection(key);
                onOpen();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#344561"
                  d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6.525q.5 0 .75.313t.25.687t-.262.688T11.5 5H5v14h14v-6.525q0-.5.313-.75t.687-.25t.688.25t.312.75V19q0 .825-.587 1.413T19 21zm4-7v-2.425q0-.4.15-.763t.425-.637l8.6-8.6q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662l-8.6 8.6q-.275.275-.637.438t-.763.162H10q-.425 0-.712-.288T9 14m12.025-9.6l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-x-5 gap-y-7 mt-2">
            {penggajian[key].map((item) => (
              <div key={item.title}>
                <p className="font-Poppins font-normal opacity-50 text-sm">
                  {item.title}
                </p>

                {item.form === "checkbox" ? (
                  <input
                    name={item.properties}
                    type="checkbox"
                    checked={item.value}
                    disabled={true}
                  />
                ) : (
                  <p className="font-Poppins font-semibold truncate text-primary">
                    {item.value || "-"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Modals
        data={salaryInput}
        title={`Edit ${selectedSection || "Data Penggajian"}`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={onUpdate}
      />
    </div>
  );
}
