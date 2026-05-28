import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
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

const KECAMATAN_ENDPOINT = "master-kecamatan";

export default function MasterKecamatanSection({ api, isReady }) {
  const queryClient = useQueryClient();
  const [provId, setProvId] = useState("");
  const [kotaId, setKotaId] = useState("");
  const [nama, setNama] = useState("");
  const [editing, setEditing] = useState(null); // { id, nama, kot_id }
  const [editingNama, setEditingNama] = useState("");
  const [editingKotaId, setEditingKotaId] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data: provRaw } = useMaster(
    api,
    ["master-provinsi"],
    MASTERENDPOINT.provinsi,
    {
      enabled: isReady,
      returnEmptyOnError: true,
    },
  );

  const provinsiOptions = useMemo(() => {
    const list = normalizeApiList(provRaw);
    return list
      .map((item) => ({
        id: String(item?.id ?? "").trim(),
        nama: String(item?.nama ?? "").trim(),
      }))
      .filter((item) => item.id && item.nama);
  }, [provRaw]);

  const {
    data: kotaRaw,
    isFetching: kotaFetching,
    error: kotaError,
  } = useMaster(
    api,
    ["master-kota-by-prov", provId],
    MASTERENDPOINT.kota(provId),
    {
      enabled: isReady && Boolean(provId),
      returnEmptyOnError: true,
    },
  );

  const kotaOptions = useMemo(() => {
    const list = normalizeApiList(kotaRaw);
    return list
      .map((item) => ({
        id: String(item?.id ?? "").trim(),
        nama: String(item?.nama ?? "").trim(),
      }))
      .filter((item) => item.id && item.nama);
  }, [kotaRaw]);

  const kecUrl = kotaId ? MASTERENDPOINT.kecamatan(kotaId) : null;

  const {
    data: kecRaw,
    isFetching,
    error,
  } = useMaster(api, ["master-kecamatan", kotaId || "none"], kecUrl || "", {
    enabled: isReady && Boolean(kotaId) && Boolean(kecUrl),
    returnEmptyOnError: false,
  });

  const kecRows = useMemo(() => {
    const list = normalizeApiList(kecRaw);
    return list
      .map((item) => ({
        id: item?.id ?? null,
        kot_id: String(item?.kot_id ?? "").trim(),
        nama: String(item?.nama ?? "").trim(),
      }))
      .filter((item) => item.id && item.nama);
  }, [kecRaw]);

  const kotaNameById = useMemo(() => {
    const map = new Map();
    for (const k of kotaOptions) map.set(String(k.id), k.nama);
    return map;
  }, [kotaOptions]);

  useEffect(() => {
    if (!kotaError) return;
    const message =
      kotaError?.payload?.message ||
      kotaError?.message ||
      "Gagal memuat master kota";
    addToast({ title: "Error", description: message, color: "danger" });
  }, [kotaError]);

  useEffect(() => {
    if (!error) return;
    const message =
      error?.payload?.message ||
      error?.message ||
      "Gagal memuat master kecamatan";
    addToast({ title: "Error", description: message, color: "danger" });
  }, [error]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = { nama: nama.trim(), kot_id: String(kotaId) };
      const response = await api.post(KECAMATAN_ENDPOINT, payload);
      return response.data;
    },
    onSuccess: async () => {
      setNama("");
      addToast({
        title: "Berhasil",
        description: "Kecamatan berhasil ditambahkan",
        color: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["master-kecamatan"],
        exact: false,
      });
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal menambahkan kecamatan";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing?.id) throw new Error("ID kecamatan tidak ditemukan");
      const payload = {
        nama: editingNama.trim(),
        kot_id: String(editingKotaId || editing?.kot_id || ""),
      };
      const response = await api.put(
        `${KECAMATAN_ENDPOINT}/${editing.id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Kecamatan berhasil diperbarui",
        color: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["master-kecamatan"],
        exact: false,
      });
      onClose();
      setEditing(null);
      setEditingNama("");
      setEditingKotaId("");
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal memperbarui kecamatan";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const resp = await apiService(
        "delete",
        api,
        `${KECAMATAN_ENDPOINT}/${id}`,
      );
      return resp;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Kecamatan berhasil dihapus",
        color: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["master-kecamatan"],
        exact: false,
      });
    },
    onError: (err) => {
      const message =
        err?.payload?.message || err?.message || "Gagal menghapus kecamatan";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const canSubmit = useMemo(
    () => provId && kotaId && nama.trim().length > 0,
    [provId, kotaId, nama],
  );
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3 items-end">
        <Select
          label="Provinsi"
          selectedKeys={new Set([String(provId || "")])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] || "";
            const nextProv = String(selected);
            setProvId(nextProv);
            setKotaId("");
          }}
          className="max-w-md"
        >
          {provinsiOptions.map((item) => (
            <SelectItem key={String(item.id)}>{item.nama}</SelectItem>
          ))}
        </Select>

        <Select
          label="Kota/Kabupaten"
          selectedKeys={new Set([String(kotaId || "")])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] || "";
            setKotaId(String(selected));
          }}
          className="max-w-md"
          isDisabled={!provId || kotaFetching}
        >
          {kotaOptions.map((item) => (
            <SelectItem key={String(item.id)}>{item.nama}</SelectItem>
          ))}
        </Select>

        <Input
          label="Nama kecamatan"
          placeholder="Contoh: Kebayoran Baru"
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
        {!kotaId ? (
          <div className="w-full flex items-center justify-center min-h-20 text-sm text-gray-500">
            Pilih provinsi dan kota untuk menampilkan kecamatan.
          </div>
        ) : isFetching ? (
          <div className="w-full flex items-center justify-center min-h-20">
            <Spinner size="md" color="primary" />
          </div>
        ) : (
          <Table aria-label="Master kecamatan table" className="w-full min-w-0">
            <TableHeader>
              <TableColumn key="id" align="start">
                ID
              </TableColumn>
              <TableColumn key="kota" align="start">
                KOTA/KABUPATEN
              </TableColumn>
              <TableColumn key="nama" align="start">
                KECAMATAN
              </TableColumn>
              <TableColumn key="actions" align="center">
                AKSI
              </TableColumn>
            </TableHeader>
            <TableBody items={kecRows}>
              {(item) => (
                <TableRow key={String(item.id)}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-Poppins text-primary">
                    {kotaNameById.get(String(item.kot_id)) ||
                      item.kot_id ||
                      "-"}
                  </TableCell>
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
                          setEditingKotaId(String(item.kot_id || ""));
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
                Edit Kecamatan
              </ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Select
                  label="Kota/Kabupaten"
                  selectedKeys={new Set([String(editingKotaId || "")])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] || "";
                    setEditingKotaId(String(selected));
                  }}
                  isDisabled={!provId}
                >
                  {kotaOptions.map((item) => (
                    <SelectItem key={String(item.id)}>{item.nama}</SelectItem>
                  ))}
                </Select>

                <Input
                  label="Nama kecamatan"
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
                  isDisabled={
                    !editingKotaId ||
                    editingNama.trim().length === 0 ||
                    isMutating
                  }
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
