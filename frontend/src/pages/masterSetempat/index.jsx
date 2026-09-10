import {
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Layout from "../../components/layout";
import { Button, Card } from "../../components/ui";
import { apiClient, apiService } from "../../service/api";
import { useMaster } from "../../hooks/useMaster";
import { MASTERENDPOINT } from "../../constants/api";

export default function MasterSetempatPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const api = apiClient(getToken);
  const queryClient = useQueryClient();

  const [kotaSetempat, setKotaSetempat] = useState("");
  const [editing, setEditing] = useState(null); // { id, kota_setempat }
  const [editingName, setEditingName] = useState("");

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    data: rows,
    isFetching,
    error,
  } = useMaster(api, ["master-setempat"], MASTERENDPOINT.setempat, {
    enabled: isLoaded && isSignedIn,
    returnEmptyOnError: false,
    select: (resp) => {
      const list = Array.isArray(resp?.data) ? resp.data : [];
      return list
        .map((item) => ({
          id: item?.id ?? null,
          kota_setempat: item?.kota_setempat ?? "",
        }))
        .filter((item) => item.id != null);
    },
  });

  useEffect(() => {
    if (!error) return;
    const message =
      error?.payload?.message ||
      error?.message ||
      "Gagal memuat master setempat";
    addToast({ title: "Error", description: message, color: "danger" });
  }, [error]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = { kota_setempat: kotaSetempat.trim() };
      const response = await api.post(MASTERENDPOINT.setempat, payload);
      return response.data;
    },
    onSuccess: async () => {
      setKotaSetempat("");
      addToast({
        title: "Berhasil",
        description: "Master setempat berhasil ditambahkan",
        color: "success",
      });
      await queryClient.invalidateQueries({ queryKey: ["master-setempat"] });
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal menambahkan master setempat";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing?.id) throw new Error("ID setempat tidak ditemukan");
      const payload = { kota_setempat: editingName.trim() };
      const response = await api.put(
        `${MASTERENDPOINT.setempat}/${editing.id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Master setempat berhasil diperbarui",
        color: "success",
      });
      await queryClient.invalidateQueries({ queryKey: ["master-setempat"] });
      onClose();
      setEditing(null);
      setEditingName("");
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal memperbarui master setempat";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const resp = await apiService(
        "delete",
        api,
        `${MASTERENDPOINT.setempat}/${id}`,
      );
      return resp;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Master setempat berhasil dihapus",
        color: "success",
      });
      await queryClient.invalidateQueries({ queryKey: ["master-setempat"] });
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        "Gagal menghapus master setempat";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const canSubmit = useMemo(
    () => kotaSetempat.trim().length > 0,
    [kotaSetempat],
  );
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <Layout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <section className="flex flex-1 flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Master Setempat
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kelola data kota setempat untuk filter dan akses data karyawan.
          </p>
        </div>

        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
          <Input
            label="Kota setempat"
            placeholder="Contoh: Jakarta Selatan"
            value={kotaSetempat}
            onChange={(e) => setKotaSetempat(e.target.value)}
            className="max-w-md"
          />
          <Button
            variant="default"
            isDisabled={!canSubmit || isMutating}
            onPress={() => createMutation.mutate()}
          >
            Tambah
          </Button>
        </Card>

        <Card className="p-3">
          {isFetching ? (
            <div className="w-full flex items-center justify-center min-h-20">
              <Spinner size="md" color="primary" />
            </div>
          ) : (
            <Table
              aria-label="Master setempat table"
              className="w-full min-w-0"
            >
              <TableHeader>
                <TableColumn key="id" align="start">
                  ID
                </TableColumn>
                <TableColumn key="kota_setempat" align="start">
                  KOTA SETEMPAT
                </TableColumn>
                <TableColumn key="actions" align="center">
                  AKSI
                </TableColumn>
              </TableHeader>
              <TableBody items={Array.isArray(rows) ? rows : []}>
                {(item) => (
                  <TableRow key={String(item.id)}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-Poppins text-primary">
                      {item.kota_setempat}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-nowrap justify-center gap-1.5">
                        <Button
                          className="personalia-action-button personalia-action-button-light min-h-8 px-2.5 py-1.5 text-xs"
                          size="sm"
                          variant="bordered"
                          isDisabled={isMutating}
                          onPress={() => {
                            setEditing(item);
                            setEditingName(item.kota_setempat || "");
                            onOpen();
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          className="personalia-action-button min-h-8 border-red-200 bg-red-600 px-2.5 py-1.5 text-xs text-white"
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
        </Card>
      </section>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(closeHandler) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Setempat
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Kota setempat"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="outline"
                  onPress={closeHandler}
                  isDisabled={isMutating}
                >
                  Batal
                </Button>
                <Button
                  variant="default"
                  isDisabled={editingName.trim().length === 0 || isMutating}
                  onPress={() => updateMutation.mutate()}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Layout>
  );
}
