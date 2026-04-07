import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useDisclosure } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { apiClient, apiService } from "../../../service/api";
import Modals from "../components/modals";
import Loading from "../../../components/common/Loading";
import { PROPERTIES } from "../constant";
import { useMaster } from "../../../hooks/useMaster";
import { DETAILENDPOINT, MASTERENDPOINT } from "../../../constants/api";
import { formatDataDetail } from "../../../utils/format";
import { uniqById } from "../../../utils/uniqueValue";

export default function Education() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const employeeId = state?.id ?? state?.id_karyawan ?? null;
  const [selectedEdit, setSelectedEdit] = useState(null);

  const { data: pendidikan, isFetching: pendidikanFetching } = useMaster(
    api,
    [`pendidikan-${employeeId}`],
    DETAILENDPOINT.get.education(employeeId),
    {
      enabled: Boolean(employeeId),
      select: (data) => data.data.map((i) => formatDataDetail("pendidikan", i)),
    },
  );

  
  
  const {
    data: masterUniv,
    isFetching: masterUnivFetching,
    error: masterUnivError,
  } = useMaster(
    api,
    ["master-riwayat-pendidikan", "education-modal"],
    MASTERENDPOINT.universitas,
    {
      enabled: isOpen,
      returnEmptyOnError: false,
      staleTime: 0,
      refetchOnMount: "always",
      select: (data) => {
        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];
        const mapped = rows
          .map((i) => ({
            id: i?.id ?? i?.riw_pendidikan_id ?? i?.kode ?? null,
            name: i?.univ ?? i?.nama_sekolah ?? i?.nama ?? i?.jenjang ?? null,
          }))
          .filter((i) => i.id && i.name);

        return uniqById(mapped, "id");
      },
    },
  );

  useEffect(() => {
    if (!masterUnivError || !isOpen) return;

    const message =
      masterUnivError?.payload?.message ||
      masterUnivError?.message ||
      "Data master institusi pendidikan gagal dimuat.";

    addToast({
      title: "Gagal memuat institusi",
      description: message,
      color: "danger",
    });
  }, [masterUnivError, isOpen]);

  useEffect(() => {
    if (!isOpen || masterUnivFetching || masterUnivError) return;
    if (!Array.isArray(masterUniv) || masterUniv.length > 0) return;

    addToast({
      title: "Institusi tidak ditemukan",
      description:
        "Endpoint /riwayat-pendidikan terbaca, tetapi frontend tidak menerima opsi institusi yang bisa ditampilkan.",
      color: "warning",
    });
  }, [isOpen, masterUniv, masterUnivFetching, masterUnivError]);

  const master = { masterUniv: Array.isArray(masterUniv) ? masterUniv : [] };

  const onUpdate = async (value, onClose) => {
    if (selectedEdit === null) return;

    try {
      const rpkId = pendidikan[selectedEdit].find(
        (i) => i.title === "Id",
      ).value;

      const requestBody = {
        karyawan_id: employeeId,
        rpk_id: rpkId,
      };

      Object.keys(value).forEach((key) => {
        const findProp = PROPERTIES.pendidikan.find(
          (i) => i.properties === key,
        );

        if (findProp?.master) {
          const selectedMaster = master[findProp.master]?.find(
            (i) => i.name === value[key],
          );

          if (selectedMaster) {
            requestBody[key] = selectedMaster.id;
          }
        } else if (findProp?.form === "number" || findProp?.form === "float") {
          const numValue = parseFloat(value[key]);
          if (!isNaN(numValue)) {
            requestBody[key] = numValue;
          }
        } else {
          requestBody[key] = value[key];
        }
      });

      const response = await apiService(
        "put",
        api,
        DETAILENDPOINT.update.education(employeeId, rpkId),
        requestBody,
      );

      if (!response?.success) {
        addToast({
          title: "Gagal menyimpan",
          description: "Perubahan data pendidikan tidak berhasil disimpan.",
          color: "danger",
        });
        return;
      }

      queryClient.invalidateQueries([`pendidikan-${employeeId}`]);

      onClose();
    } catch (err) {
      console.error("Error updating education:", err);
    }
  };

  const onNew = async (value, onClose) => {
    try {
      const requestBody = {
        karyawan_id: employeeId,
        rpk_id: crypto.randomUUID(),
      };

      Object.keys(value).forEach((key) => {
        const findProp = PROPERTIES.pendidikan.find(
          (i) => i.properties === key,
        );

        if (findProp?.master) {
          const selectedMaster = master[findProp.master]?.find(
            (i) => i.name === value[key] || String(i.id) === String(value[key]),
          );

          if (selectedMaster) {
            if (key === "univ") {
              requestBody.riw_pendidikan_id = String(selectedMaster.id);
            } else {
              requestBody[key] = String(selectedMaster.id);
            }
          }
        } else if (findProp?.form === "number" || findProp?.form === "float") {
          const numValue = parseFloat(value[key]);
          if (!isNaN(numValue)) {
            requestBody[key] = numValue;
          }
        } else {
          requestBody[key] = value[key];
        }
      });

      if (!requestBody.riw_pendidikan_id || !requestBody.tingkat) {
        addToast({
          title: "Data belum lengkap",
          description: "Tingkat dan Nama Institusi Pendidikan wajib diisi.",
          color: "danger",
        });
        return;
      }

      const response = await apiService(
        "post",
        api,
        DETAILENDPOINT.create.education(),
        requestBody,
      );

      if (!response?.success) {
        addToast({
          title: "Gagal menambah",
          description: "Data pendidikan gagal ditambahkan.",
          color: "danger",
        });
        return;
      }

      queryClient.invalidateQueries([`pendidikan-${employeeId}`]);

      onClose();
    } catch (err) {
      console.error("Error creating education:", err);
    }
  };

  const onRemove = async (index) => {
    try {
      const item = pendidikan?.[index];
      if (!item) return;

      const rpkId = item.find((i) => i.title === "Id")?.value ?? null;
      if (!rpkId) return;

      const response = await apiService(
        "delete",
        api,
        DETAILENDPOINT.delete.education(rpkId),
      );

      if (!response?.success) {
        addToast({
          title: "Gagal menghapus",
          description: "Data pendidikan gagal dihapus.",
          color: "danger",
        });
        return;
      }

      await queryClient.invalidateQueries([`pendidikan-${employeeId}`]);
    } catch (err) {
      console.error("Error deleting education:", err);
      addToast({
        title: "Gagal menghapus",
        description: "Terjadi kesalahan saat menghapus data pendidikan.",
        color: "danger",
      });
    }
  };

  const isLoading = masterUnivFetching;

  const educationInput = useMemo(() => {
    let updatedPendidikan = PROPERTIES.pendidikan;

    if (selectedEdit !== null && pendidikan?.[selectedEdit]) {
      updatedPendidikan = pendidikan[selectedEdit];
    }

    if (isOpen && !isLoading) {
      return updatedPendidikan.map((item) => {
        if (item.form === "select" && item.master && master[item.master]) {
          return {
            ...item,
            listSelect: master[item.master],
          };
        }

        return item;
      });
    }

    return updatedPendidikan;
  }, [isOpen, pendidikan, masterUniv, selectedEdit, isLoading]);

  const hasEducation = !!pendidikan?.length;

  if (pendidikanFetching) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-5">
      {!hasEducation ? (
        <div className="flex justify-center items-center flex-1 flex-col gap-10">
          <p className="font-Poppins">Tidak ada data Pendidikan</p>

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
              Tambah Data Pendidikan
            </p>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {pendidikan.map((item, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex w-full justify-between border-b-1 border-primary border-opacity-20 py-2">
                <p className="font-Poppins font-extrabold text-lg text-primary">
                  {item[0].value}
                </p>

                <div className="flex gap-5">
                  <button type="button" onClick={() => onRemove(index)}>
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

              <div className="grid grid-cols-4 gap-5">
                {item.map((item) => {
                  if (item.title !== "Tingkat" && item.title !== "Id") {
                    return (
                      <div key={item.title}>
                        <p className="font-Poppins font-normal opacity-50 text-sm">
                          {item.title}
                        </p>
                        <p className="font-Poppins font-medium truncate text-primary">
                          {item.value?.name ?? item.value}
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasEducation && (
        <button
          className="bg-[#00000010] rounded-md h-10 flex items-center justify-center w-full"
          onClick={() => {
            onOpen();
            setSelectedEdit(null);
          }}
        >
          <i className="fi fi-rr-plus" />
        </button>
      )}

      <Modals
        data={educationInput ?? PROPERTIES.pendidikan}
        title={`${selectedEdit !== null ? "Edit" : "Tambah"} Pendidikan`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={(value, onClose) =>
          selectedEdit !== null
            ? onUpdate(value, onClose)
            : onNew(value, onClose)
        }
        isLoading={isLoading}
      />
    </div>
  );
}
