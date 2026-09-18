import { addToast } from "@heroui/toast";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@heroui/react";
import { useAuth } from "@clerk/clerk-react";

import {
  apiClient,
  apiService,
  resolveApiAssetUrl,
} from "../../../service/api";
import Modals from "../components/modals";
import Loading from "../../../components/common/Loading";
import { useMaster } from "../../../hooks/useMaster";
import {
  DETAILENDPOINT,
  DOCSENDPOINT,
  MASTERENDPOINT,
} from "../../../constants/api";
import { formatDataDetail } from "../../../utils/format";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Gagal membaca file foto."));

    reader.readAsDataURL(file);
  });

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
      select: (data) => ({
        foto: data.data?.foto || "",
        fields: formatDataDetail("tambahan", data.data),
      }),
    },
  );

  const { data: tipeDokumenRaw } = useMaster(
    api,
    ["master-tipe-dokumen"],
    MASTERENDPOINT.tipeDokumen,
    {
      select: (response) => {
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        return list
          .map((item) => ({
            id: item?.id ?? null,
            name: String(item?.tipe_dokumen ?? "").trim(),
          }))
          .filter((item) => item.id && item.name);
      },
    },
  );

  const { data: masterKota = [] } = useMaster(
    api,
    ["master-kota"],
    MASTERENDPOINT.allKota,
    {
      select: (response) => {
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

        return list
          .map((item) => ({
            id: item?.id ?? null,
            name: String(item?.nama_kota ?? item?.nama ?? "").trim(),
          }))
          .filter((item) => item.id && item.name);
      },
    },
  );

  const onUpdate = async (value, onClose) => {
    try {
      if (Object.keys(value).length === 0) {
        onClose();
        return;
      }

      const requestBody = {};
      const fotoFile = value.foto instanceof File ? value.foto : null;
      const dokumenFile = value.dokumen instanceof File ? value.dokumen : null;
      const tipeDokumenId = String(value.tipe_dokumen_id ?? "").trim();

      if (dokumenFile && !tipeDokumenId) {
        throw new Error("Tipe dokumen wajib dipilih untuk upload dokumen.");
      }

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
        if (["foto", "dokumen"].includes(key)) {
          return;
        }

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

      const hasAdditionalFieldChange = Object.keys(requestBody).length > 0;

      if (!hasAdditionalFieldChange && !fotoFile && !dokumenFile) {
        onClose();
        return;
      }

      if (fotoFile) {
        requestBody.foto_base64 = await readFileAsDataUrl(fotoFile);
        requestBody.foto_filename = fotoFile.name || "foto";
      }

      if (hasAdditionalFieldChange || fotoFile) {
        await apiService(
          "put",
          api,
          DETAILENDPOINT.update.additional(state.id),
          requestBody,
        );
      }

      if (dokumenFile) {
        const formData = new FormData();

        formData.append("karyawan_id", state.id);
        formData.append("tipe_dokumen_id", tipeDokumenId);
        formData.append("dokumen", dokumenFile);

        await apiService("post", api, DOCSENDPOINT.upload, formData);

        addToast({
          title: "Dokumen berhasil diupload",
          description: dokumenFile.name,
          color: "success",
        });
      }

      if (hasAdditionalFieldChange) {
        queryClient.setQueryData([`tambahan-${state.id}`], (oldData) => {
          if (!oldData || !Array.isArray(oldData?.fields)) return oldData;

          const fields = oldData.fields.map((item) => {
            const newValue = value[item.properties];
            if (newValue !== undefined) {
              return {
                ...item,
                value: newValue,
              };
            }
            return item;
          });

          return {
            ...oldData,
            fields,
          };
        });
      }

      queryClient.invalidateQueries([`tambahan-${state.id}`]);
      queryClient.invalidateQueries([`profile-${state.id}`]);
      queryClient.invalidateQueries([`dokumen-${state.id}`]);

      onClose();
    } catch (err) {
      console.error("Error updating additional data:", err);
      console.error(
        "Error details:",
        err?.payload ?? err?.response?.data ?? err,
      );

      const description =
        err?.message || "Data tambahan atau foto gagal diperbarui.";

      addToast({
        title: "Gagal menyimpan",
        description,
        color: "danger",
      });
    }
  };

  const additionalFields = tambahan?.fields ?? [];
  const modalFields = useMemo(
    () => [
      ...additionalFields.map((item) =>
        item.properties === "tempat_lahir"
          ? {
              ...item,
              listSelect: masterKota,
              valueMode: "key",
            }
          : item,
      ),
      {
        title: "Foto",
        properties: "foto",
        form: "file",
        accept: "image/*",
        value: tambahan?.foto || "",
      },
      {
        title: "Tipe Dokumen",
        properties: "tipe_dokumen_id",
        form: "select",
        listSelect: tipeDokumenRaw ?? [],
        valueMode: "key",
        required: true,
        value: "",
      },
      {
        title: "Dokumen",
        properties: "dokumen",
        form: "file",
        accept: "application/pdf,image/*,.doc,.docx,.xls,.xlsx",
        value: "",
      },
    ],
    [additionalFields, tambahan?.foto, masterKota, tipeDokumenRaw],
  );
  const imagePreview =
    (tambahan?.foto ? resolveApiAssetUrl(tambahan.foto) : "") ||
    "/assets/images/1.svgs";

  if (tambahanFetching) return <Loading />;

  return (
    <div className="w-full justify-between flex flex-col flex-1 gap-5">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* <div className="md:col-span-1">
          <p className="font-Poppins font-normal opacity-50 text-sm">Foto</p>
          <img
            src={imagePreview}
            alt="Foto karyawan"
            className="mt-2 h-40 w-full rounded-lg object-cover border border-[#00000010]"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/assets/images/profile.jpg";
            }}
          />
        </div> */}

        <div className="grid grid-cols-4 gap-x-5 gap-y-10 md:col-span-4">
          {additionalFields.map((item) => (
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
      </div>

      <button
        className="bg-[#00000010] rounded-md h-10 flex items-center justify-center w-full"
        onClick={onOpen}
      >
        <i className="fi fi-rr-edit" />
      </button>

      <Modals
        data={modalFields}
        title="Edit Tambahan"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={onUpdate}
      />
    </div>
  );
}
