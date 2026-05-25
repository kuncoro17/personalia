import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EMPLOYEEENDPOINT, MASTERENDPOINT } from "../../../constants/api";
import { useMaster } from "../../../hooks/useMaster";

const isValidNikMin7 = (value) =>
  /^[0-9]{7,16}$/.test(String(value ?? "").trim());
const isValidKtp16 = (value) => /^[0-9]{16}$/.test(String(value ?? "").trim());
const isValidEmail = (value) =>
  /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(value ?? "").trim());

const cleanPayload = (values) => {
  const payload = {};

  for (const [key, raw] of Object.entries(values || {})) {
    if (raw == null) continue;
    const value = typeof raw === "string" ? raw.trim() : raw;
    if (value === "") continue;
    payload[key] = value;
  }

  const numericKeys = [
    "agama",
    "tinggi_badan",
    "berat_badan",
    "id_master_setempat",
  ];
  for (const key of numericKeys) {
    if (payload[key] == null) continue;
    const n = Number(payload[key]);
    if (!Number.isNaN(n)) payload[key] = n;
  }

  return payload;
};

const toFormData = (payload) => {
  const formData = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value == null) return;
    formData.append(key, String(value));
  });
  return formData;
};

export default function AddEmployeeModal({ api, isOpen, onOpenChange }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    nik: "",
    no_ktp: "",
    status_aktif: "Aktif",
    nama_lengkap: "",
    nama_panggilan: "",
    email_pribadi: "",
    email_penabur: "",
    tgl_join_penabur: "",
    tgl_join_penabur_jkt: "",
    agama: "",
    kode_status_karyawan: "",
    id_master_setempat: "",
  });

  const { data: agamaOptions, isFetching: agamaFetching } = useMaster(
    api,
    ["master-agama-options"],
    MASTERENDPOINT.agama,
    {
      enabled: isOpen,
      select: (resp) => {
        const list = Array.isArray(resp?.data) ? resp.data : [];
        return list
          .map((item) => ({
            id: item?.kode_agama ?? item?.id ?? null,
            label: item?.agama ?? "",
          }))
          .filter((item) => item.id != null && item.label);
      },
    },
  );

  const { data: statusOptions, isFetching: statusFetching } = useMaster(
    api,
    ["master-status-karyawan-options"],
    MASTERENDPOINT.statusKaryawan,
    {
      enabled: isOpen,
      select: (resp) => {
        const list = Array.isArray(resp?.data) ? resp.data : [];
        return list
          .map((item) => ({
            id: item?.kode ?? item?.id ?? null,
            label: String(
              item?.stat_karyawan_gp ??
                item?.stat_karyawan ??
                item?.nama_status ??
                "",
            ).trim(),
          }))
          .filter((item) => item.id != null && item.label);
      },
    },
  );

  const { data: setempatOptions, isFetching: setempatFetching } = useMaster(
    api,
    ["master-setempat-options-modal"],
    MASTERENDPOINT.setempat,
    {
      enabled: isOpen,
      select: (resp) => {
        const list = Array.isArray(resp?.data) ? resp.data : [];
        return list
          .map((item) => ({
            id: item?.id ?? null,
            label: item?.kota_setempat ?? "",
          }))
          .filter((item) => item.id != null && item.label);
      },
    },
  );

  const isLoadingMaster = agamaFetching || statusFetching || setempatFetching;

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = cleanPayload(form);
      return api.post(EMPLOYEEENDPOINT.create(), toFormData(payload));
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Karyawan berhasil ditambahkan",
        color: "success",
      });

      await queryClient.invalidateQueries({
        queryKey: ["allKaryawan"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["search"],
        exact: false,
      });
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal menambahkan karyawan";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const isSubmitting = createMutation.isPending;

  const canSubmit = useMemo(() => {
    const nik = String(form.nik || "").trim();
    const noKtp = String(form.no_ktp || "").trim();
    const emailPribadi = String(form.email_pribadi || "").trim();
    const emailPenabur = String(form.email_penabur || "").trim();

    return (
      isValidNikMin7(nik) &&
      isValidKtp16(noKtp) &&
      isValidEmail(emailPribadi) &&
      isValidEmail(emailPenabur) &&
      !isSubmitting
    );
  }, [
    form.email_penabur,
    form.email_pribadi,
    form.nik,
    form.no_ktp,
    isSubmitting,
  ]);

  const updateField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="max-w-5xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              createMutation.mutate(undefined, {
                onSuccess: () => {
                  onClose();
                  setForm({
                    nik: "",
                    no_ktp: "",
                    status_aktif: "Aktif",
                    nama_lengkap: "",
                    nama_panggilan: "",
                    email_pribadi: "",
                    email_penabur: "",
                    tgl_join_penabur: "",
                    tgl_join_penabur_jkt: "",
                    agama: "",
                    kode_status_karyawan: "",
                    id_master_setempat: "",
                  });
                },
              });
            }}
          >
            <ModalHeader className="flex flex-col gap-1 font-Poppins text-xl">
              Tambah Karyawan
            </ModalHeader>

            <ModalBody>
              {isLoadingMaster ? (
                <div className="flex items-center justify-center min-h-28">
                  <Spinner color="primary" size="md" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    label="NIK *"
                    value={form.nik}
                    onValueChange={(value) => {
                      const digitsOnly = String(value ?? "")
                        .replace(/\\D+/g, "")
                        .slice(0, 16);
                      updateField("nik")(digitsOnly);
                    }}
                    maxLength={16}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    isRequired
                    validate={(value) => {
                      const v = String(value ?? "").trim();
                      if (v === "") return "NIK wajib diisi";
                      if (!/^[0-9]+$/.test(v)) return "NIK tidak boleh huruf";
                      if (v.length < 7) return "NIK minimal 7 digit";
                      if (v.length > 16) return "NIK maksimal 16 digit";
                    }}
                  />
                  <Input
                    label="No KTP *"
                    value={form.no_ktp}
                    onValueChange={(value) => {
                      const digitsOnly = String(value ?? "")
                        .replace(/\\D+/g, "")
                        .slice(0, 16);
                      updateField("no_ktp")(digitsOnly);
                    }}
                    maxLength={16}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    isRequired
                    validate={(value) => {
                      const v = String(value ?? "").trim();
                      if (v === "") return "No KTP wajib diisi";
                      if (!/^[0-9]+$/.test(v))
                        return "No KTP tidak boleh huruf";
                      if (v.length !== 16) return "No KTP harus 16 digit";
                    }}
                  />
                  <Select
                    label="Status Aktif"
                    selectedKeys={new Set([form.status_aktif || "Aktif"])}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] || "Aktif";
                      updateField("status_aktif")(String(selected));
                    }}
                  >
                    <SelectItem key="Aktif">Aktif</SelectItem>
                    <SelectItem key="Tidak Aktif">Tidak Aktif</SelectItem>
                  </Select>
                  <Select
                    label="Master Setempat"
                    selectedKeys={
                      new Set([String(form.id_master_setempat || "")])
                    }
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] || "";
                      updateField("id_master_setempat")(String(selected));
                    }}
                  >
                    {(Array.isArray(setempatOptions)
                      ? setempatOptions
                      : []
                    ).map((item) => (
                      <SelectItem key={String(item.id)}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Nama Lengkap *"
                    value={form.nama_lengkap}
                    onValueChange={updateField("nama_lengkap")}
                    isRequired
                  />
                  <Input
                    label="Nama Panggilan *"
                    value={form.nama_panggilan}
                    onValueChange={updateField("nama_panggilan")}
                    isRequired
                  />
                  <Input
                    label="Email Pribadi *"
                    value={form.email_pribadi}
                    onValueChange={updateField("email_pribadi")}
                    isRequired
                    type="email"
                    validate={(value) => {
                      const v = String(value ?? "").trim();
                      if (v === "") return "Email wajib diisi";
                      if (!isValidEmail(v)) return "Format email tidak valid";
                    }}
                  />
                  <Input
                    label="Email Penabur *"
                    value={form.email_penabur}
                    onValueChange={updateField("email_penabur")}
                    isRequired
                    type="email"
                    validate={(value) => {
                      const v = String(value ?? "").trim();
                      if (v === "") return "Email wajib diisi";
                      if (!isValidEmail(v)) return "Format email tidak valid";
                    }}
                  />

                  <Input
                    label="Tgl Join Penabur"
                    type="date"
                    value={form.tgl_join_penabur}
                    onValueChange={updateField("tgl_join_penabur")}
                  />
                  <Input
                    label="Tgl Join Penabur JKT"
                    type="date"
                    value={form.tgl_join_penabur_jkt}
                    onValueChange={updateField("tgl_join_penabur_jkt")}
                  />
                  <Select
                    label="Agama"
                    selectedKeys={new Set([String(form.agama || "")])}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] || "";
                      updateField("agama")(String(selected));
                    }}
                  >
                    {(Array.isArray(agamaOptions) ? agamaOptions : []).map(
                      (item) => (
                        <SelectItem key={String(item.id)}>
                          {item.label}
                        </SelectItem>
                      ),
                    )}
                  </Select>
                  <Select
                    label="Status Karyawan"
                    selectedKeys={
                      new Set([String(form.kode_status_karyawan || "")])
                    }
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] || "";
                      updateField("kode_status_karyawan")(String(selected));
                    }}
                  >
                    {(Array.isArray(statusOptions) ? statusOptions : []).map(
                      (item) => (
                        <SelectItem key={String(item.id)}>
                          {item.label}
                        </SelectItem>
                      ),
                    )}
                  </Select>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="bordered"
                onPress={onClose}
                isDisabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                color="primary"
                type="submit"
                isDisabled={!canSubmit}
                isLoading={isSubmitting}
              >
                Simpan
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
