import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { apiClient } from "../../../service/api";
import Modals from "../components/modals";
import Loading from "../../../components/common/Loading";
import { useMaster } from "../../../hooks/useMaster";
import { onAddNew, onDelete } from "../../../utils/detailService";
import { formatDataDetail } from "../../../utils/format";
import { PROPERTIES } from "../constant";
import { DETAILENDPOINT } from "../../../constants/api";

export default function EmergencyContact() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedEdit, setSelectedEdit] = useState(null);

  const { data: darurat, isFetching: daruratFetching } = useMaster(
    api,
    [`darurat-${state.id}`],
    DETAILENDPOINT.get.emergencyContact(state.id),
    {
      select: (res) => {
        return res.data.map((d) => formatDataDetail("darurat", d));
      },
    },
  );

  const onUpdate = async (value, onClose) => {
    try {
      const rawCache = queryClient.getQueryData([`darurat-${state.id}`]);

      let dataArray = null;

      if (Array.isArray(rawCache)) {
        dataArray = rawCache;
      } else if (rawCache?.data && Array.isArray(rawCache.data)) {
        dataArray = rawCache.data;
      } else {
        alert("Struktur data tidak valid. Silakan refresh halaman.");
        return;
      }

      const selectedData = dataArray[selectedEdit];

      if (!selectedData) {
        alert("Data tidak ditemukan.");
        return;
      }

      let contactId = null;
      let rawData = {};

      if (Array.isArray(selectedData)) {
        const idField = selectedData.find((item) => item.properties === "id");
        contactId = idField?.value;

        selectedData.forEach((item) => {
          if (item.properties && item.value !== undefined) {
            rawData[item.properties] = item.value;
          }
        });
      } else if (selectedData && typeof selectedData === "object") {
        contactId = selectedData.id;
        rawData = selectedData;
      }

      if (!contactId) {
        alert("ID kontak tidak ditemukan. Silakan refresh halaman.");
        return;
      }

      const getFieldValue = (newVal, oldVal) => {
        if (newVal !== undefined && newVal !== null) {
          return typeof newVal === "string" ? newVal.trim() : newVal;
        }
        if (oldVal !== undefined && oldVal !== null) {
          return typeof oldVal === "string" ? oldVal.trim() : oldVal;
        }
        return "";
      };

      const payload = {
        id_karyawan: state.id,
        id: contactId,
        nama_kondar: getFieldValue(value.nama_kondar, rawData.nama_kondar),
        hubungan_kondar: getFieldValue(
          value.hubungan_kondar,
          rawData.hubungan_kondar,
        ),
        alamat_kondar: getFieldValue(
          value.alamat_kondar,
          rawData.alamat_kondar,
        ),
        telp_darurat: getFieldValue(value.telp_darurat, rawData.telp_darurat),
        kategori_kontak: getFieldValue(
          value.kategori_kontak,
          rawData.kategori_kontak,
        ),
        no_hp: getFieldValue(value.no_hp, rawData.no_hp),
      };

      await api.put(
        DETAILENDPOINT.update.emergencyContact(state.id, contactId),
        payload,
      );

      await queryClient.invalidateQueries([`darurat-${state.id}`]);

      onClose();
    } catch (error) {
      console.error("Update Error:", error);

      if (error.type === "HTTP_ERROR") {
        if (error.message?.message) {
          try {
            const zodErrors = JSON.parse(error.message.message);
            const fieldNames = {
              nama_kondar: "Nama Kontak",
              hubungan_kondar: "Hubungan",
              alamat_kondar: "Alamat",
              telp_darurat: "Telepon Darurat",
              no_hp: "No HP",
              kategori_kontak: "Kategori Kontak",
            };

            const errorList = zodErrors.map((e) => {
              const field = e.path?.join(".") || "Unknown field";
              const displayField = fieldNames[field] || field;
              return `• ${displayField}: ${e.message}`;
            });

            alert(`Validasi Gagal:\n\n${errorList.join("\n")}`);
          } catch {
            alert(`Gagal menyimpan:\n\n${JSON.stringify(error.message)}`);
          }
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

  if (daruratFetching) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-10">
      {!darurat || darurat.length === 0 ? (
        <div className="flex justify-center items-center flex-1 flex-col gap-10">
          <p className="font-Poppins">Tidak ada kontak darurat</p>

          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedEdit(null);
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
              Tambah Data Kontak Darurat
            </p>
          </button>
        </div>
      ) : (
        darurat.map((i, index) => (
          <div key={index}>
            <div className="flex justify-between w-full border-b-1 border-[#00000020] py-2">
              <p className="font-Poppins font-extrabold text-lg text-primary">
                Kontak Darurat {index + 1}
              </p>

              <div className="flex gap-5">
                <button
                  onClick={() =>
                    onDelete(
                      queryClient,
                      index,
                      "kontak_darurat",
                      `darurat-${state.id}`,
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#8C2526"
                      d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    setSelectedEdit(index);
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
            </div>

            <div className="grid grid-cols-5 gap-x-5 gap-y-7 mt-2">
              {i.map((j) => {
                if (j.properties !== "id") {
                  return (
                    <div key={j.title}>
                      <p className="font-Poppins opacity-50 text-sm">
                        {j.title}
                      </p>
                      <p className="font-Poppins font-medium truncate text-primary">
                        {j.value || "-"}
                      </p>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))
      )}

      {darurat && darurat.length > 0 && (
        <button
          className="bg-[#00000010] rounded-md h-10 flex items-center justify-center w-full"
          onClick={() => {
            setSelectedEdit(null);
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
              fill="currentColor"
              d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
            />
          </svg>
        </button>
      )}

      <Modals
        data={darurat[selectedEdit] ?? PROPERTIES.darurat}
        title={`${selectedEdit !== null ? "Edit" : "Tambah"} Kontak Darurat`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={(value, onClose) =>
          selectedEdit !== null
            ? onUpdate(value, onClose)
            : onAddNew(
                value,
                queryClient,
                "kontak_darurat",
                `darurat-${state.id}`,
                onClose,
              )
        }
      />
    </div>
  );
}
