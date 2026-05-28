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

export default function MasterRiwPendidikanSection({ api, isReady }) {
  const queryClient = useQueryClient();
  const [univ, setUniv] = useState("");
  const [editing, setEditing] = useState(null); // { id, univ }
  const [editingUniv, setEditingUniv] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    data: rowsRaw,
    isFetching,
    error,
  } = useMaster(api, ["master-riwayat-pendidikan"], MASTERENDPOINT.universitas, {
    enabled: isReady,
    returnEmptyOnError: false,
  });

  const rows = useMemo(() => {
    const list = normalizeApiList(rowsRaw);
    return list
      .map((item) => ({
        id: item?.id ?? item?.riw_pendidikan_id ?? null,
        univ: String(item?.univ ?? item?.nama_sekolah ?? item?.nama ?? "").trim(),
      }))
      .filter((item) => item.id && item.univ);
  }, [rowsRaw]);

  useEffect(() => {
    if (!error) return;
    const message =
      error?.payload?.message ||
      error?.message ||
      "Gagal memuat master riwayat pendidikan";
    addToast({ title: "Error", description: message, color: "danger" });
  }, [error]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = { univ: univ.trim() };
      const response = await api.post(MASTERENDPOINT.universitas, payload);
      return response.data;
    },
    onSuccess: async () => {
      setUniv("");
      addToast({
        title: "Berhasil",
        description: "Institusi pendidikan berhasil ditambahkan",
        color: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["master-riwayat-pendidikan"],
        exact: false,
      });
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal menambahkan institusi pendidikan";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing?.id) throw new Error("ID institusi tidak ditemukan");
      const payload = { univ: editingUniv.trim() };
      const response = await api.put(
        `${MASTERENDPOINT.universitas}/${editing.id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Institusi pendidikan berhasil diperbarui",
        color: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["master-riwayat-pendidikan"],
        exact: false,
      });
      onClose();
      setEditing(null);
      setEditingUniv("");
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal memperbarui institusi pendidikan";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const resp = await apiService(
        "delete",
        api,
        `${MASTERENDPOINT.universitas}/${id}`,
      );
      return resp;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Institusi pendidikan berhasil dihapus",
        color: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["master-riwayat-pendidikan"],
        exact: false,
      });
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        "Gagal menghapus institusi pendidikan";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const canSubmit = useMemo(() => univ.trim().length > 0, [univ]);
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <div className="flex gap-3 items-end">
        <Input
          label="Nama institusi pendidikan"
          placeholder="Contoh: Universitas Indonesia"
          value={univ}
          onChange={(e) => setUniv(e.target.value)}
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
          <Table aria-label="Master riwayat pendidikan table" className="w-full min-w-0">
            <TableHeader>
              <TableColumn key="id" align="start">
                ID
              </TableColumn>
              <TableColumn key="univ" align="start">
                INSTITUSI
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
                    {item.univ}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="bordered"
                        isDisabled={isMutating}
                        onPress={() => {
                          setEditing(item);
                          setEditingUniv(item.univ || "");
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
                Edit Institusi Pendidikan
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nama institusi pendidikan"
                  value={editingUniv}
                  onChange={(e) => setEditingUniv(e.target.value)}
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
                  isDisabled={editingUniv.trim().length === 0 || isMutating}
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
