import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@heroui/react";

import { apiClient, apiService } from "../../../service/api";
import Loading from "../../../components/common/Loading";
import Modals from "../components/modals";
import { useMaster } from "../../../hooks/useMaster";
import { uniqById } from "../../../utils/uniqueValue";
import { formatDataDetail } from "../../../utils/format";
import { PROPERTIES } from "../constant";
import { DETAILENDPOINT, MASTERENDPOINT } from "../../../constants/api";

const STATUS_OPTIONS = [
  { id: "Milik Sendiri", name: "Milik Sendiri" },
  { id: "Milik Orang Tua", name: "Milik Orang Tua" },
  { id: "Milik Keluarga", name: "Milik Keluarga" },
  { id: "Kontrak", name: "Kontrak" },
  { id: "Kontrakan", name: "Kontrakan" },
  { id: "Kos", name: "Kos" },
];

export default function Address() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedEdit, setSelectedEdit] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [tempFormData, setTempFormData] = useState({
    ktp: null,
    tinggal: null,
  });

  const [valueSelect, setValueSelect] = useState({
    ktp: {
      provinsi: null,
      kota: null,
      kecamatan: null,
      kelurahan: null,
    },
    tinggal: {
      provinsi: null,
      kota: null,
      kecamatan: null,
      kelurahan: null,
    },
  });

  const { data: alamat, isFetching: alamatFetching } = useMaster(
    api,
    [`alamat-${state.id}`],
    DETAILENDPOINT.get.address(state.id),
    {
      select: (res) => {
        const dataRes = res.data;

        const isEmpty =
          !dataRes.alamatKtpDetail?.id &&
          !dataRes.alamatTempatTinggalDetail?.id;

        const selectDefaults = {
          ktp: {
            provinsi: dataRes.alamatKtpDetail?.provinsi?.id || null,
            kota: dataRes.alamatKtpDetail?.kota?.id || null,
            kecamatan: dataRes.alamatKtpDetail?.kecamatan?.id || null,
            kelurahan: dataRes.alamatKtpDetail?.kelurahan?.id || null,
          },
          tinggal: {
            provinsi: dataRes.alamatTempatTinggalDetail?.provinsi?.id || null,
            kota: dataRes.alamatTempatTinggalDetail?.kota?.id || null,
            kecamatan: dataRes.alamatTempatTinggalDetail?.kecamatan?.id || null,
            kelurahan: dataRes.alamatTempatTinggalDetail?.kelurahan?.id || null,
          },
        };

        const data = {
          ktp: formatDataDetail("alamat", dataRes.alamatKtpDetail),
          tinggal: formatDataDetail(
            "alamat",
            dataRes.alamatTempatTinggalDetail,
          ),
        };

        return {
          data,
          selectDefaults,
          raw: dataRes,
          isEmpty,
        };
      },
    },
  );

  const { data: masterProvinsi, isLoading: masterProvinsiLoading } = useMaster(
    api,
    ["master-provinsi"],
    MASTERENDPOINT.provinsi,
    {
      enabled: isOpen && selectedEdit !== null,
      select: (data) => {
        const unique = uniqById(data.data, "nama");
        return unique.map((i) => ({
          id: i.id,
          name: i.nama,
        }));
      },
    },
  );

  const { data: masterKota } = useMaster(
    api,
    ["master-kota", selectedEdit, valueSelect[selectedEdit]?.provinsi],
    MASTERENDPOINT.kota(valueSelect[selectedEdit]?.provinsi),
    {
      enabled:
        isOpen &&
        selectedEdit !== null &&
        Boolean(valueSelect[selectedEdit]?.provinsi),
      select: (data) => {
        const unique = uniqById(data.data, "nama");
        return unique.map((i) => ({
          id: i.id,
          name: i.nama,
        }));
      },
    },
  );

  const { data: masterKecamatan } = useMaster(
    api,
    ["master-kecamatan", selectedEdit, valueSelect[selectedEdit]?.kota],
    MASTERENDPOINT.kecamatan(valueSelect[selectedEdit]?.kota),
    {
      enabled:
        isOpen &&
        selectedEdit !== null &&
        Boolean(valueSelect[selectedEdit]?.kota),
      select: (data) => {
        const unique = uniqById(data.data, "nama");
        return unique.map((i) => ({
          id: i.id,
          name: i.nama,
        }));
      },
    },
  );

  const { data: masterKelurahan } = useMaster(
    api,
    ["master-kelurahan", selectedEdit, valueSelect[selectedEdit]?.kecamatan],
    MASTERENDPOINT.kelurahan(valueSelect[selectedEdit]?.kecamatan),
    {
      enabled:
        isOpen &&
        selectedEdit !== null &&
        Boolean(valueSelect[selectedEdit]?.kecamatan),
      select: (data) => {
        const unique = uniqById(data.data, "nama");
        return unique.map((i) => ({
          id: i.id,
          name: i.nama,
        }));
      },
    },
  );

  useEffect(() => {
    if (!alamat?.selectDefaults) return;

    setValueSelect(alamat.selectDefaults);
  }, [alamat?.selectDefaults]);

  const master = {
    masterProvinsi,
    masterKota,
    masterKecamatan,
    masterKelurahan,
  };

  const addressInput = useMemo(() => {
    if (selectedEdit === null) return PROPERTIES.alamat;

    if (isOpen && !masterProvinsiLoading) {
      const rawData =
        alamat?.raw?.[
          selectedEdit === "ktp"
            ? "alamatKtpDetail"
            : "alamatTempatTinggalDetail"
        ];

      return PROPERTIES.alamat.map((item) => {
        if (item.form === "select") {
          let listSelect = [];

          if (item.master) {
            listSelect = master[item.master] ?? [];
          }

          if (item.properties === "status_tempat_tinggal") {
            listSelect = STATUS_OPTIONS;
          }

          return {
            ...item,
            listSelect,
            value: isCreateMode ? "" : rawData?.[item.properties] || "",
          };
        }

        return {
          ...item,
          value: isCreateMode ? "" : rawData?.[item.properties] || "",
        };
      });
    }

    return PROPERTIES.alamat;
  }, [
    isOpen,
    alamat,
    master,
    selectedEdit,
    masterProvinsiLoading,
    isCreateMode,
  ]);

  const onUpdateSingle = async (value, onClose) => {
    setTempFormData((prev) => ({
      ...prev,
      [selectedEdit]: value,
    }));

    onClose();

    if (selectedEdit === "ktp") {
      setTimeout(() => {
        setSelectedEdit("tinggal");
        onOpen();
      }, 300);
    } else {
      if (isCreateMode) {
        await createBothAddresses(value);
      } else {
        await submitBothAddresses(value);
      }
    }
  };

  const createBothAddresses = async (latestTinggalValue) => {
    const ktpData = tempFormData.ktp || {};
    const tinggalData = latestTinggalValue || tempFormData.tinggal || {};

    const payload = {
      alamatKtpDetail: {
        alamat: ktpData.alamat || "",
        rt: ktpData.rt || "",
        rw: ktpData.rw || "",
        kode_pos: ktpData.kode_pos || "",
        status_tempat_tinggal: ktpData.status_tempat_tinggal || "",
        kecamatan: valueSelect.ktp.kecamatan,
        kelurahan: valueSelect.ktp.kelurahan,
        kota: valueSelect.ktp.kota,
        provinsi: valueSelect.ktp.provinsi || null,
      },
      alamatTempatTinggalDetail: {
        alamat: tinggalData.alamat || "",
        rt: tinggalData.rt || "",
        rw: tinggalData.rw || "",
        kode_pos: tinggalData.kode_pos || "",
        status_tempat_tinggal: tinggalData.status_tempat_tinggal || "",
        kecamatan: valueSelect.tinggal.kecamatan,
        kelurahan: valueSelect.tinggal.kelurahan,
        kota: valueSelect.tinggal.kota,
        provinsi: valueSelect.tinggal.provinsi || null,
      },
    };

    const resp = await apiService(
      "post",
      api,
      DETAILENDPOINT.create.address(state.id),
      payload,
    );

    if (resp) {
      queryClient.invalidateQueries([`alamat-${state.id}`]);
      alert("Alamat berhasil ditambahkan");

      setTempFormData({ ktp: null, tinggal: null });
      setSelectedEdit(null);
      setIsCreateMode(false);
    }
  };

  const submitBothAddresses = async (latestTinggalValue) => {
    const ktpData = tempFormData.ktp || {};
    const tinggalData = latestTinggalValue || tempFormData.tinggal || {};

    const payload = {
      alamatKtpDetail: {
        id: alamat.raw.alamatKtpDetail.id,
        ...ktpData,
        kecamatan: valueSelect.ktp.kecamatan,
        kelurahan: valueSelect.ktp.kelurahan,
        kota: valueSelect.ktp.kota,
        provinsi: valueSelect.ktp.provinsi || null,
      },
      alamatTempatTinggalDetail: {
        id: alamat.raw.alamatTempatTinggalDetail.id,
        ...tinggalData,
        kecamatan: valueSelect.tinggal.kecamatan,
        kelurahan: valueSelect.tinggal.kelurahan,
        kota: valueSelect.tinggal.kota,
        provinsi: valueSelect.tinggal.provinsi || null,
      },
    };

    const resp = await apiService(
      "put",
      api,
      DETAILENDPOINT.update.address(state.id),
      payload,
    );

    if (resp) {
      queryClient.invalidateQueries([`alamat-${state.id}`]);
      alert("Alamat berhasil diperbarui");

      setTempFormData({ ktp: null, tinggal: null });
      setSelectedEdit(null);
    }
  };

  const onSelect = (key, value) => {
    if (selectedEdit === null) return;

    setValueSelect((prev) => {
      const updated = { ...prev };

      if (key === "provinsi") {
        updated[selectedEdit] = {
          provinsi: value,
          kota: null,
          kecamatan: null,
          kelurahan: null,
        };
      } else if (key === "kota") {
        updated[selectedEdit] = {
          ...prev[selectedEdit],
          kota: value,
          kecamatan: null,
          kelurahan: null,
        };
      } else if (key === "kecamatan") {
        updated[selectedEdit] = {
          ...prev[selectedEdit],
          kecamatan: value,
          kelurahan: null,
        };
      } else {
        updated[selectedEdit] = {
          ...prev[selectedEdit],
          [key]: value,
        };
      }

      return updated;
    });
  };

  const startEditFlow = () => {
    setTempFormData({ ktp: null, tinggal: null });
    setIsCreateMode(false);
    setSelectedEdit("ktp");
    onOpen();
  };

  const startCreateFlow = () => {
    setTempFormData({ ktp: null, tinggal: null });
    setValueSelect({
      ktp: {
        provinsi: null,
        kota: null,
        kecamatan: null,
        kelurahan: null,
      },
      tinggal: {
        provinsi: null,
        kota: null,
        kecamatan: null,
        kelurahan: null,
      },
    });
    setIsCreateMode(true);
    setSelectedEdit("ktp");
    onOpen();
  };

  if (alamatFetching) return <Loading />;

  const isEmpty = alamat?.isEmpty;

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Header dengan tombol Edit/Tambah */}
      <div className="flex justify-between items-center">
        <h2 className="font-Poppins font-extrabold text-xl text-primary">
          Data Alamat
        </h2>
        {isEmpty ? (
          <Button
            color="primary"
            onPress={startCreateFlow}
            className="font-Poppins"
          >
            ➕ Tambah Alamat
          </Button>
        ) : (
          <Button
            color="primary"
            onPress={startEditFlow}
            className="font-Poppins"
          >
            ✏️ Edit Semua Alamat
          </Button>
        )}
      </div>

      {/* Empty State - Tampil di section Data Alamat */}
      {isEmpty ? (
        <div className="text-center py-16 text-gray-400 font-Poppins">
          <p className="text-base">
            Belum ada data alamat. Klik "Tambah Alamat" untuk menambahkan.
          </p>
        </div>
      ) : (
        <>
          {/* Display KTP */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between w-full border-b-1 border-primary border-opacity-20 py-2">
              <p className="font-Poppins font-extrabold text-lg text-primary">
                Alamat KTP
              </p>
            </div>

            <div className="grid grid-cols-4 gap-5">
              {(alamat?.data?.ktp || []).map((a) => (
                <div key={a.title}>
                  <p className="font-Poppins opacity-50 text-sm">{a.title}</p>
                  <p className="font-Poppins font-medium truncate text-primary">
                    {a?.value?.nama ??
                      (typeof a?.value !== "object" ? a.value : null) ??
                      "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Display Tempat Tinggal */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between w-full border-b-1 border-primary border-opacity-20 py-2">
              <p className="font-Poppins font-extrabold text-lg text-primary">
                Alamat Tempat Tinggal
              </p>
            </div>

            <div className="grid grid-cols-4 gap-5">
              {(alamat?.data?.tinggal || []).map((a) => (
                <div key={a.title}>
                  <p className="font-Poppins opacity-50 text-sm">{a.title}</p>
                  <p className="font-Poppins font-medium truncate text-primary">
                    {a?.value?.nama ??
                      (typeof a?.value !== "object" ? a.value : null) ??
                      "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal - Reuse existing modal */}
      <Modals
        data={addressInput}
        title={`${isCreateMode ? "Tambah" : "Edit"} Alamat ${
          selectedEdit === "ktp" ? "KTP" : "Tempat Tinggal"
        }${selectedEdit === "ktp" ? " (1/2)" : " (2/2)"}`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={onUpdateSingle}
        isLoading={masterProvinsiLoading}
        onSelect={onSelect}
      />
    </div>
  );
}
