import {
  Button,
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

      <section className="flex flex-col gap-6 flex-1 px-6 pb-5">
        <div className="flex items-center justify-between">
          <p className="font-Poppins text-xl font-semibold text-primary">
            Master Setempat
          </p>
        </div>

        <div className="flex gap-3 items-end">
          <Input
            label="Kota setempat"
            placeholder="Contoh: Jakarta Selatan"
            value={kotaSetempat}
            onChange={(e) => setKotaSetempat(e.target.value)}
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
                      <div className="flex gap-2 justify-center">
                        <Button
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
                  variant="light"
                  onPress={closeHandler}
                  isDisabled={isMutating}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
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
