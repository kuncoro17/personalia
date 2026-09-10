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

import { MASTERENDPOINT } from "../../../constants/api";
import { useMaster } from "../../../hooks/useMaster";
import { apiService } from "../../../service/api";
import { normalizeApiList } from "./utils";

const QUERY_KEY = ["master-tipe-dokumen"];
const MAX_NAME_LENGTH = 100;

const getErrorMessage = (error, fallback) =>
  error?.payload?.message ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function MasterTipeDokumenSection({ api, isReady }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [editingName, setEditingName] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    data: rowsRaw,
    isFetching,
    error,
  } = useMaster(api, QUERY_KEY, MASTERENDPOINT.tipeDokumen, {
    enabled: isReady,
    returnEmptyOnError: false,
  });

  const rows = useMemo(
    () =>
      normalizeApiList(rowsRaw)
        .map((item) => ({
          id: item?.id ?? null,
          tipeDokumen: String(item?.tipe_dokumen ?? "").trim(),
          createdAt: item?.created_at ?? null,
          updatedAt: item?.updated_at ?? null,
        }))
        .filter((item) => item.id && item.tipeDokumen),
    [rowsRaw],
  );

  useEffect(() => {
    if (!error) return;
    addToast({
      title: "Gagal memuat data",
      description: getErrorMessage(error, "Gagal memuat tipe dokumen"),
      color: "danger",
    });
  }, [error]);

  const refreshRows = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(MASTERENDPOINT.tipeDokumen, {
        tipe_dokumen: name.trim(),
      });
      return response.data;
    },
    onSuccess: async () => {
      setName("");
      addToast({
        title: "Berhasil",
        description: "Tipe dokumen berhasil ditambahkan",
        color: "success",
      });
      await refreshRows();
    },
    onError: (mutationError) => {
      addToast({
        title: "Gagal",
        description: getErrorMessage(
          mutationError,
          "Gagal menambahkan tipe dokumen",
        ),
        color: "danger",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing?.id) throw new Error("ID tipe dokumen tidak ditemukan");
      const response = await api.put(
        `${MASTERENDPOINT.tipeDokumen}/${editing.id}`,
        { tipe_dokumen: editingName.trim() },
      );
      return response.data;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Tipe dokumen berhasil diperbarui",
        color: "success",
      });
      await refreshRows();
      onClose();
      setEditing(null);
      setEditingName("");
    },
    onError: (mutationError) => {
      addToast({
        title: "Gagal",
        description: getErrorMessage(
          mutationError,
          "Gagal memperbarui tipe dokumen",
        ),
        color: "danger",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      apiService("delete", api, `${MASTERENDPOINT.tipeDokumen}/${id}`),
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Tipe dokumen berhasil dihapus",
        color: "success",
      });
      await refreshRows();
    },
    onError: (mutationError) => {
      addToast({
        title: "Gagal",
        description: getErrorMessage(
          mutationError,
          "Gagal menghapus tipe dokumen",
        ),
        color: "danger",
      });
    },
  });

  const normalizedName = name.trim();
  const normalizedEditingName = editingName.trim();
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
        <Input
          className="max-w-md"
          description={`${name.length}/${MAX_NAME_LENGTH} karakter`}
          label="Nama tipe dokumen"
          maxLength={MAX_NAME_LENGTH}
          placeholder="Contoh: IJAZAH"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && normalizedName && !isMutating) {
              createMutation.mutate();
            }
          }}
        />
        <Button
          color="primary"
          isDisabled={!normalizedName || isMutating}
          isLoading={createMutation.isPending}
          onPress={() => createMutation.mutate()}
        >
          Tambah
        </Button>
      </div>

      <div className="personalia-card p-3">
        {isFetching ? (
          <div className="flex min-h-20 w-full items-center justify-center">
            <Spinner color="primary" size="md" />
          </div>
        ) : (
          <Table aria-label="Tabel master tipe dokumen" className="w-full">
            <TableHeader>
              <TableColumn key="id">ID</TableColumn>
              <TableColumn key="tipeDokumen">TIPE DOKUMEN</TableColumn>
              <TableColumn key="createdAt">DIBUAT</TableColumn>
              <TableColumn key="updatedAt">DIPERBARUI</TableColumn>
              <TableColumn key="actions" align="center">
                AKSI
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent="Belum ada tipe dokumen" items={rows}>
              {(item) => (
                <TableRow key={String(item.id)}>
                  <TableCell>
                    <span className="font-mono text-xs">{item.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-Poppins font-medium text-primary dark:text-slate-100">
                      {item.tipeDokumen}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>{formatDate(item.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-nowrap justify-center gap-1.5">
                      <Button
                        isDisabled={isMutating}
                        size="sm"
                        variant="bordered"
                        onPress={() => {
                          setEditing(item);
                          setEditingName(item.tipeDokumen);
                          onOpen();
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        isDisabled={isMutating}
                        size="sm"
                        variant="bordered"
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
              <ModalHeader>Edit Tipe Dokumen</ModalHeader>
              <ModalBody>
                <Input
                  description={`${editingName.length}/${MAX_NAME_LENGTH} karakter`}
                  label="Nama tipe dokumen"
                  maxLength={MAX_NAME_LENGTH}
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={isMutating}
                  variant="light"
                  onPress={closeHandler}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  isDisabled={!normalizedEditingName || isMutating}
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
