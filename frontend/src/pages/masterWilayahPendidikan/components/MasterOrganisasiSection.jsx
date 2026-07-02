import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useMaster } from "../../../hooks/useMaster";
import { apiService } from "../../../service/api";
import { normalizeApiList } from "./utils";

const EMPTY_FORM = {
  kode: "",
  nama: "",
  alamat: "",
};

const getErrorMessage = (err, fallback) =>
  err?.payload?.message ||
  err?.message ||
  err?.response?.data?.message ||
  fallback;

export default function MasterOrganisasiSection({ api, isReady, config }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [editingForm, setEditingForm] = useState(EMPTY_FORM);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    data: rowsRaw,
    isFetching,
    error,
  } = useMaster(api, [config.queryKey], config.endpoint, {
    enabled: isReady,
    returnEmptyOnError: false,
  });

  const rows = useMemo(() => {
    const list = normalizeApiList(rowsRaw);

    return list
      .map((item) => ({
        id: item?.[config.idField] ?? item?.id ?? null,
        kode: String(item?.kode ?? item?.[config.codeField] ?? "").trim(),
        nama: String(item?.[config.nameField] ?? item?.nama ?? "").trim(),
        alamat: String(item?.alamat ?? "").trim(),
      }))
      .filter((item) => item.id);
  }, [config.codeField, config.idField, config.nameField, rowsRaw]);

  useEffect(() => {
    if (!error) return;
    addToast({
      title: "Error",
      description: getErrorMessage(error, `Gagal memuat master ${config.name}`),
      color: "danger",
    });
  }, [config.name, error]);

  const buildPayload = (data) => ({
    kode: data.kode.trim(),
    [config.nameField]: data.nama.trim(),
    alamat: data.alamat.trim(),
  });

  const invalidateList = async () => {
    await queryClient.invalidateQueries({
      queryKey: [config.queryKey],
      exact: false,
    });
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(config.endpoint, buildPayload(form));
      return response.data;
    },
    onSuccess: async () => {
      setForm(EMPTY_FORM);
      addToast({
        title: "Berhasil",
        description: `${config.label} berhasil ditambahkan`,
        color: "success",
      });
      await invalidateList();
    },
    onError: (err) => {
      addToast({
        title: "Gagal",
        description: getErrorMessage(
          err,
          `Gagal menambahkan ${config.name}`,
        ),
        color: "danger",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing?.id) throw new Error(`ID ${config.name} tidak ditemukan`);
      const response = await api.put(
        `${config.endpoint}/${editing.id}`,
        buildPayload(editingForm),
      );
      return response.data;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: `${config.label} berhasil diperbarui`,
        color: "success",
      });
      await invalidateList();
      onClose();
      setEditing(null);
      setEditingForm(EMPTY_FORM);
    },
    onError: (err) => {
      addToast({
        title: "Gagal",
        description: getErrorMessage(
          err,
          `Gagal memperbarui ${config.name}`,
        ),
        color: "danger",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      apiService("delete", api, `${config.endpoint}/${id}`),
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: `${config.label} berhasil dihapus`,
        color: "success",
      });
      await invalidateList();
    },
    onError: (err) => {
      addToast({
        title: "Gagal",
        description: getErrorMessage(err, `Gagal menghapus ${config.name}`),
        color: "danger",
      });
    },
  });

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const canSubmit = Boolean(form.kode.trim() && form.nama.trim());
  const canUpdate = Boolean(editingForm.kode.trim() && editingForm.nama.trim());

  const updateForm = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const updateEditingForm = (field, value) =>
    setEditingForm((current) => ({ ...current, [field]: value }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <Input
          label={`Kode ${config.label}`}
          placeholder="Maks. 5 karakter"
          maxLength={5}
          value={form.kode}
          onChange={(e) => updateForm("kode", e.target.value)}
        />
        <Input
          label={`Nama ${config.label}`}
          placeholder={`Contoh: ${config.example}`}
          value={form.nama}
          onChange={(e) => updateForm("nama", e.target.value)}
        />
        <Input
          label="Alamat"
          placeholder="Opsional"
          value={form.alamat}
          onChange={(e) => updateForm("alamat", e.target.value)}
        />
        <Button
          color="primary"
          isDisabled={!canSubmit || isMutating}
          onPress={() => createMutation.mutate()}
        >
          Tambah
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3">
        {isFetching ? (
          <div className="w-full flex items-center justify-center min-h-20">
            <Spinner size="md" color="primary" />
          </div>
        ) : (
          <Table
            aria-label={`Master ${config.name} table`}
            className="w-full min-w-0"
          >
            <TableHeader>
              <TableColumn key="id" align="start">
                ID
              </TableColumn>
              <TableColumn key="kode" align="start">
                KODE
              </TableColumn>
              <TableColumn key="nama" align="start">
                NAMA
              </TableColumn>
              <TableColumn key="alamat" align="start">
                ALAMAT
              </TableColumn>
              <TableColumn key="actions" align="center">
                AKSI
              </TableColumn>
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={String(item.id)}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.kode}</TableCell>
                  <TableCell className="font-Poppins text-primary">
                    {item.nama}
                  </TableCell>
                  <TableCell>{item.alamat || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="bordered"
                        isDisabled={isMutating}
                        onPress={() => {
                          setEditing(item);
                          setEditingForm({
                            kode: item.kode || "",
                            nama: item.nama || "",
                            alamat: item.alamat || "",
                          });
                          onOpen();
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="bordered"
                        isDisabled={isMutating}
                        onPress={() => deleteMutation.mutate(item.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(closeHandler) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit {config.label}
              </ModalHeader>
              <ModalBody>
                <Input
                  label={`Kode ${config.label}`}
                  maxLength={5}
                  value={editingForm.kode}
                  onChange={(e) => updateEditingForm("kode", e.target.value)}
                />
                <Input
                  label={`Nama ${config.label}`}
                  value={editingForm.nama}
                  onChange={(e) => updateEditingForm("nama", e.target.value)}
                />
                <Input
                  label="Alamat"
                  value={editingForm.alamat}
                  onChange={(e) => updateEditingForm("alamat", e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => {
                    closeHandler();
                    setEditing(null);
                    setEditingForm(EMPTY_FORM);
                  }}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  isDisabled={!canUpdate || isMutating}
                  isLoading={updateMutation.isPending}
                  onPress={() => updateMutation.mutate()}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
