import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { Checkbox, useDisclosure } from "@heroui/react";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

import { apiClient, apiService } from "../../../service/api";
import Modals from "../components/modals";
import Loading from "../../../components/common/Loading";
import { useMaster } from "../../../hooks/useMaster";
import { formatDataDetail } from "../../../utils/format";
import { uniqById } from "../../../utils/uniqueValue";
import { PROPERTIES } from "../constant";
import { DETAILENDPOINT, MASTERENDPOINT } from "../../../constants/api";
import { formatDateIndonesia } from "../../../utils/format";

export default function Family() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const employeeId = state?.id ?? state?.id_karyawan ?? null;
  const [selectedEdit, setSelectedEdit] = useState(null);

  const { data: keluarga, isFetching: keluargaFetching } = useMaster(
    api,
    [`keluarga-${employeeId}`],
    DETAILENDPOINT.get.family(employeeId),
    {
      enabled: Boolean(employeeId),
      select: (res) => {
        const d = res.data || "-";

        return {
          nik: d.nik ?? "-",
          nama_lengkap: d.nama_lengkap ?? "-",
          status_dalam_keluarga: d.status_dalam_keluarga ?? "-",
          status_nikah: d.status_nikah ?? "-",
          raw_data: d.keluarga_karyawan,
          data_keluarga: d.keluarga_karyawan.map((k) =>
            formatDataDetail("keluarga", k),
          ),
        };
      },
    },
  );

  const { data: masterKota, isFetching: masterKotaFetching } = useMaster(
    api,
    ["master-kota-all"],
    MASTERENDPOINT.allKota,
    {
      enabled: true,
      select: (data) => {
        const unique = uniqById(data.data, "nama");
        return unique.map((i) => ({
          id: i.id,
          name: i.nama,
        }));
      },
    },
  );

  const { data: masterAgama, isFetching: masterAgamaFetching } = useMaster(
    api,
    ["master-agama"],
    MASTERENDPOINT.agama,
    {
      enabled: true,
      select: (data) => {
        const unique = uniqById(data.data, "agama");
        return unique.map((i) => ({
          id: i.kode_agama,
          name: i.agama,
        }));
      },
    },
  );

  const convertToDisplayFormat = (rawItem) => {
    if (!masterKota) return formatDataDetail("keluarga", rawItem);

    const converted = { ...rawItem };

    if (converted.tempat_lahir && masterKota) {
      const kota = masterKota.find((k) => k.id === converted.tempat_lahir);
      if (kota) converted.tempat_lahir = kota.name;
    }

    if (converted.tanggal_lahir) {
      converted.tanggal_lahir = formatDateIndonesia(converted.tanggal_lahir);
    }

    if (converted.agama_detail?.agama) {
      converted.agama = converted.agama_detail.agama;
    }

    if (converted.flag_berpisah !== undefined) {
      if (converted.flag_berpisah === 0) converted.flag_berpisah = "Tidak";
      else if (converted.flag_berpisah === 1)
        converted.flag_berpisah = "Meninggal";
      else if (converted.flag_berpisah === 2)
        converted.flag_berpisah = "Berpisah";
    }

    return formatDataDetail("keluarga", converted);
  };

  const displayData = useMemo(() => {
    if (!keluarga?.raw_data) return keluarga?.data_keluarga || [];

    return keluarga.raw_data.map((item) => convertToDisplayFormat(item));
  }, [keluarga, masterKota]);

  const master = {
    masterKota,
    masterAgama,
  };

  const isLoadingMaster = masterKotaFetching || masterAgamaFetching;

  const familyInput = useMemo(() => {
    if (!isOpen || isLoadingMaster || keluargaFetching) {
      return selectedEdit !== null
        ? displayData[selectedEdit]
        : PROPERTIES.keluarga;
    }

    const baseData =
      selectedEdit !== null ? displayData[selectedEdit] : PROPERTIES.keluarga;

    return baseData.map((item) => {
      if (item.form === "select" && item.master) {
        return {
          ...item,
          listSelect: master[item.master],
        };
      }
      return item;
    });
  }, [
    isOpen,
    selectedEdit,
    displayData,
    master,
    isLoadingMaster,
    keluargaFetching,
  ]);

  const transformToAPIFormat = (formData, isEdit = false) => {
    const payload = {};

    const getMasterId = (masterKey, displayName) => {
      const masterData = master[masterKey];
      if (!masterData) return displayName;

      const found = masterData.find((item) => item.name === displayName);
      return found ? found.id : displayName;
    };

    const getFlagBerpisahValue = (value) => {
      if (value === "Tidak" || value === 0 || value === "0") return 0;
      if (value === "Meninggal" || value === 1 || value === "1") return 1;
      if (value === "Berpisah" || value === 2 || value === "2") return 2;
      return 0;
    };

    if (formData.nama_lengkap !== undefined)
      payload.nama_lengkap = formData.nama_lengkap;

    if (formData.nomor_identitas !== undefined)
      payload.nomor_identitas = formData.nomor_identitas;

    if (formData.tempat_lahir !== undefined) {
      payload.tempat_lahir = getMasterId("masterKota", formData.tempat_lahir);
    }

    if (formData.tanggal_lahir !== undefined)
      payload.tanggal_lahir = formData.tanggal_lahir;

    if (formData.agama !== undefined) {
      payload.agama = getMasterId("masterAgama", formData.agama);
    }

    if (formData.kewarganegaraan !== undefined)
      payload.kewarganegaraan = formData.kewarganegaraan;

    if (formData.pekerjaan !== undefined)
      payload.pekerjaan = formData.pekerjaan;

    if (formData.pendidikan !== undefined)
      payload.pendidikan = formData.pendidikan;

    if (formData.gender !== undefined) payload.gender = formData.gender;

    if (formData.hubungan !== undefined) payload.hubungan = formData.hubungan;

    if (formData.no_telp !== undefined) {
      payload.no_telp = formData.no_telp;
    }

    if (formData.flag_status !== undefined) {
      payload.flag_status = formData.flag_status ? 1 : 0;
    }

    payload.tanggungan_medical = formData.tanggungan_medical ? 1 : 0;
    payload.kebijakan_khusus_medical = formData.kebijakan_khusus_medical
      ? 1
      : 0;

    if (formData.flag_berpisah !== undefined) {
      payload.flag_berpisah = getFlagBerpisahValue(formData.flag_berpisah);
    } else {
      payload.flag_berpisah = 0;
    }

    if (formData.keterangan !== undefined)
      payload.keterangan = formData.keterangan;

    if (!isEdit) {
      payload.karyawan_id = employeeId;
    }

    return payload;
  };

  const updateFamilyMutation = useMutation({
    mutationFn: async ({ familyId, payload }) => {
      const response = await api.put(
        DETAILENDPOINT.update.family(employeeId, familyId),
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Data keluarga berhasil diperbarui");
      queryClient.invalidateQueries([`keluarga-${employeeId}`]);
    },
    onError: (error) => {
      console.error("Update family error:", error);
      toast.error(
        error.response?.data?.message || "Gagal memperbarui data keluarga",
      );
    },
  });

  const createFamilyMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(DETAILENDPOINT.create.family(), payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Anggota keluarga berhasil ditambahkan");
      queryClient.invalidateQueries([`keluarga-${employeeId}`]);
    },
    onError: (error) => {
      console.error("Create family error:", error);
      toast.error(
        error.response?.data?.message || "Gagal menambahkan anggota keluarga",
      );
    },
  });

  const onRemove = async (index) => {
    try {
      const familyId =
        displayData?.[index]?.find((item) => item.properties === "id")?.value ??
        null;

      if (!familyId) {
        toast.error("ID keluarga tidak ditemukan");
        return;
      }

      const resp = await apiService(
        "delete",
        api,
        DETAILENDPOINT.delete.family(familyId),
      );

      if (!resp?.success) throw resp;

      toast.success("Anggota keluarga berhasil dihapus");
      await queryClient.invalidateQueries([`keluarga-${employeeId}`]);
    } catch (error) {
      console.error("Delete family error:", error);
      toast.error(error?.message || "Gagal menghapus anggota keluarga");
    }
  };

  const onUpdate = (value, onClose) => {
    if (selectedEdit !== null) {
      const currentFamily = displayData[selectedEdit]?.find(
        (item) => item.title === "Id",
      )?.value;

      if (!currentFamily) {
        toast.error("ID keluarga tidak ditemukan");
        return;
      }

      const payload = transformToAPIFormat(value, true);

      updateFamilyMutation.mutate(
        { familyId: currentFamily, payload },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      const payload = transformToAPIFormat(value, false);

      createFamilyMutation.mutate(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (keluargaFetching) return <Loading />;

  const isLoading =
    updateFamilyMutation.isPending ||
    createFamilyMutation.isPending ||
    isLoadingMaster;

  return (
    <div className="flex flex-col flex-1 w-full gap-5">
      <div className="grid grid-cols-4 gap-x-5 gap-y-10">
        <div>
          <p className="font-Poppins font-normal opacity-50 text-sm">NIK</p>
          <p className="font-Poppins font-medium truncate text-primary">
            {keluarga.nik}
          </p>
        </div>
        <div>
          <p className="font-Poppins font-normal opacity-50 text-sm">
            Nama Karyawan
          </p>
          <p className="font-Poppins font-medium truncate text-primary">
            {keluarga.nama_lengkap}
          </p>
        </div>
        <div>
          <p className="font-Poppins font-normal opacity-50 text-sm">
            Status dalam Keluarga
          </p>
          <p className="font-Poppins font-medium truncate text-primary">
            {keluarga.status_dalam_keluarga}
          </p>
        </div>
        <div>
          <p className="font-Poppins font-normal opacity-50 text-sm">
            Status Nikah
          </p>
          <p className="font-Poppins font-medium truncate text-primary">
            {keluarga.status_nikah}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        {displayData.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex w-full justify-between border-b-1 border-primary border-opacity-20 py-2">
              <p className="font-Poppins font-extrabold text-lg text-primary">
                Anggota {index + 1}
              </p>

              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
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

            <div className="grid grid-cols-4 gap-5">
              {item.map((item) => {
                if (item.title !== "Id") {
                  return (
                    <div key={item.title}>
                      <p className="font-Poppins font-normal opacity-50 text-sm">
                        {item.title}
                      </p>
                      {item.form === "checkbox" ? (
                        <Checkbox
                          isSelected={item.value}
                          isDisabled
                          size="md"
                          radius="sm"
                        />
                      ) : (
                        <p className="font-Poppins font-medium truncate text-primary">
                          {item.value || "-"}
                        </p>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        className="bg-[#00000010] rounded-md h-10 flex items-center justify-center w-full"
        onClick={() => {
          onOpen();
          setSelectedEdit(null);
        }}
      >
        <i className="fi fi-rr-plus" />
      </button>

      <Modals
        data={familyInput}
        title={`${selectedEdit !== null ? "Edit" : "Tambah"} Anggota Keluarga`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={onUpdate}
        isLoading={isLoading}
      />
    </div>
  );
}
