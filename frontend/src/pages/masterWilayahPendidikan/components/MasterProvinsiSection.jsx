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
import { MASTERENDPOINT } from "../../../constants/api";
import { apiService } from "../../../service/api";
import { normalizeApiList } from "./utils";

export default function MasterProvinsiSection({ api, isReady }) {
  const queryClient = useQueryClient();
  const [nama, setNama] = useState("");
  const [editing, setEditing] = useState(null); // { id, nama }
  const [editingNama, setEditingNama] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    data: rowsRaw,
    isFetching,
    error,
  } = useMaster(api, ["master-provinsi"], MASTERENDPOINT.provinsi, {
    enabled: isReady,
    returnEmptyOnError: false,
  });

  const rows = useMemo(() => {
    const list = normalizeApiList(rowsRaw);
    return list
      .map((item) => ({
        id: item?.id ?? null,
        nama: String(item?.nama ?? "").trim(),
      }))
      .filter((item) => item.id && item.nama);
  }, [rowsRaw]);

  useEffect(() => {
    if (!error) return;
    const message =
      error?.payload?.message || error?.message || "Gagal memuat master provinsi";
    addToast({ title: "Error", description: message, color: "danger" });
  }, [error]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = { nama: nama.trim() };
      const response = await api.post(MASTERENDPOINT.provinsi, payload);
      return response.data;
    },
    onSuccess: async () => {
      setNama("");
      addToast({
        title: "Berhasil",
        description: "Provinsi berhasil ditambahkan",
        color: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["master-provinsi"],
        exact: false,
      });
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal menambahkan provinsi";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing?.id) throw new Error("ID provinsi tidak ditemukan");
      const payload = { nama: editingNama.trim() };
      const response = await api.put(
        `${MASTERENDPOINT.provinsi}/${editing.id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Provinsi berhasil diperbarui",
        color: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["master-provinsi"],
        exact: false,
      });
      onClose();
      setEditing(null);
      setEditingNama("");
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal memperbarui provinsi";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const resp = await apiService(
        "delete",
        api,
        `${MASTERENDPOINT.provinsi}/${id}`,
      );
      return resp;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Provinsi berhasil dihapus",
        color: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["master-provinsi"],
        exact: false,
      });
    },
    onError: (err) => {
      const message =
        err?.payload?.message || err?.message || "Gagal menghapus provinsi";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const canSubmit = useMemo(() => nama.trim().length > 0, [nama]);
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <div className="flex gap-3 items-end">
        <Input
          label="Nama provinsi"
          placeholder="Contoh: DKI Jakarta"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="max-w-md"
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
          <Table aria-label="Master provinsi table" className="w-full min-w-0">
            <TableHeader>
              <TableColumn key="id" align="start">
                ID
              </TableColumn>
              <TableColumn key="nama" align="start">
                PROVINSI
              </TableColumn>
              <TableColumn key="actions" align="center">
                AKSI
              </TableColumn>
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={String(item.id)}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-Poppins text-primary">
                    {item.nama}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="bordered"
                        isDisabled={isMutating}
                        onPress={() => {
                          setEditing(item);
                          setEditingNama(item.nama || "");
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
                Edit Provinsi
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nama provinsi"
                  value={editingNama}
                  onChange={(e) => setEditingNama(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={closeHandler}
                  isDisabled={isMutating}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  isDisabled={editingNama.trim().length === 0 || isMutating}
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
