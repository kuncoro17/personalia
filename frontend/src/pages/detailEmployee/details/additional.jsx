import { addToast } from "@heroui/toast";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { DETAILENDPOINT } from "../../../constants/api";
import { formatDataDetail } from "../../../utils/format";

export default function Additional() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  const onUpdate = async (value, onClose) => {
    try {
      if (Object.keys(value).length === 0) {
        onClose();
        return;
      }

      const requestBody = {};
      const fotoFile = value.foto instanceof File ? value.foto : null;

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

      const hasAdditionalFieldChange = Object.keys(requestBody).length > 0;

      if (!hasAdditionalFieldChange && !fotoFile) {
        onClose();
        return;
      }

      if (hasAdditionalFieldChange) {
        await apiService(
          "put",
          api,
          DETAILENDPOINT.update.additional(state.id),
          requestBody,
        );
      }

      if (fotoFile) {
        const formData = new FormData();
        formData.append("foto", fotoFile);

        await api.put(
          DETAILENDPOINT.update.additional(state.id),
          formData,
        );
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

      queryClient.invalidateQueries({ queryKey: [`tambahan-${state.id}`] });
      queryClient.invalidateQueries({ queryKey: [`profile-${state.id}`] });

      onClose();
    } catch (err) {
      console.error("Error updating additional data:", err);
      console.error("Error details:", err?.payload ?? err?.response?.data ?? err);
    }
  };

  const onUploadImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setSelectedImage(file);
      setIsUploadingImage(true);

      const formData = new FormData();
      formData.append("foto", file);

      await api.put(
        DETAILENDPOINT.update.additional(state.id),
        formData,
      );

      queryClient.invalidateQueries({ queryKey: [`tambahan-${state.id}`] });
      queryClient.invalidateQueries({ queryKey: [`profile-${state.id}`] });

      addToast({
        title: "Berhasil",
        description: "Foto karyawan berhasil diperbarui",
        color: "success",
      });
    } catch (err) {
      console.error("Error uploading image:", err);
      console.error("Error details:", err?.payload ?? err?.response?.data ?? err);
      addToast({
        title: "Gagal",
        description: "Foto karyawan gagal diperbarui",
        color: "danger",
      });
    } finally {
      setIsUploadingImage(false);
      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const additionalFields = tambahan?.fields ?? [];
  const modalFields = useMemo(
    () => [
      ...additionalFields,
      {
        title: "Foto",
        properties: "foto",
        form: "file",
        accept: "image/*",
        value: tambahan?.foto || "",
      },
    ],
    [additionalFields, tambahan?.foto],
  );
  const imagePreview =
    previewUrl ||
    (tambahan?.foto ? resolveApiAssetUrl(tambahan.foto) : "") ||
    "/assets/images/profile.jpg";

  if (tambahanFetching) return <Loading />;

  return (
    <div className="w-full justify-between flex flex-col flex-1 gap-5">
      <div className="flex items-start justify-between gap-6 border border-[#00000010] rounded-lg p-4">
        <div className="flex items-center gap-4">
          <img
            src={imagePreview}
            alt="Foto tambahan karyawan"
            className="w-24 h-24 rounded-lg object-cover border border-[#00000010]"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/assets/images/profile.jpg";
            }}
          />

          <div>
            <p className="font-Poppins font-semibold text-primary">
              Foto Karyawan
            </p>
            <p className="font-Poppins text-sm opacity-60">
              Update foto melalui tab Tambahan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUploadImage}
          />

          <button
            type="button"
            disabled={isUploadingImage}
            className="bg-primary text-white px-4 h-10 rounded-md font-Poppins text-sm disabled:opacity-60"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploadingImage ? "Mengunggah..." : "Update Image"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-x-5 gap-y-10">
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
