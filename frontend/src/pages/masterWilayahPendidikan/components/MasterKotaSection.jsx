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

const KOTA_ENDPOINT = "master-kota";

export default function MasterKotaSection({ api, isReady }) {
  const queryClient = useQueryClient();
  const [provId, setProvId] = useState("");
  const [nama, setNama] = useState("");
  const [editing, setEditing] = useState(null); // { id, nama, prov_id }
  const [editingNama, setEditingNama] = useState("");
  const [editingProvId, setEditingProvId] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data: provRaw } = useMaster(api, ["master-provinsi"], MASTERENDPOINT.provinsi, {
    enabled: isReady,
    returnEmptyOnError: true,
  });

  const provinsiOptions = useMemo(() => {
    const list = normalizeApiList(provRaw);
    return list
      .map((item) => ({
        id: String(item?.id ?? "").trim(),
        nama: String(item?.nama ?? "").trim(),
      }))
      .filter((item) => item.id && item.nama);
  }, [provRaw]);

  const kotaUrl = provId ? MASTERENDPOINT.kota(provId) : MASTERENDPOINT.allKota;

  const {
    data: kotaRaw,
    isFetching,
    error,
  } = useMaster(api, ["master-kota", provId || "all"], kotaUrl, {
    enabled: isReady,
    returnEmptyOnError: false,
  });

  const kotaRows = useMemo(() => {
    const list = normalizeApiList(kotaRaw);
    return list
      .map((item) => ({
        id: item?.id ?? null,
        prov_id: String(item?.prov_id ?? item?.provinsi_id ?? "").trim(),
        nama: String(item?.nama ?? "").trim(),
      }))
      .filter((item) => item.id && item.nama);
  }, [kotaRaw]);

  const provNameById = useMemo(() => {
    const map = new Map();
    for (const p of provinsiOptions) map.set(String(p.id), p.nama);
    return map;
  }, [provinsiOptions]);

  useEffect(() => {
    if (!error) return;
    const message =
      error?.payload?.message || error?.message || "Gagal memuat master kota";
    addToast({ title: "Error", description: message, color: "danger" });
  }, [error]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = { nama: nama.trim(), prov_id: String(provId) };
      const response = await api.post(KOTA_ENDPOINT, payload);
      return response.data;
    },
    onSuccess: async () => {
      setNama("");
      addToast({
        title: "Berhasil",
        description: "Kota/Kabupaten berhasil ditambahkan",
        color: "success",
      });
      await queryClient.invalidateQueries({ queryKey: ["master-kota"], exact: false });
      await queryClient.invalidateQueries({
        queryKey: ["master-kota-by-prov"],
        exact: false,
      });
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal menambahkan kota/kabupaten";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing?.id) throw new Error("ID kota tidak ditemukan");
      const payload = {
        nama: editingNama.trim(),
        prov_id: String(editingProvId || editing?.prov_id || ""),
      };
      const response = await api.put(`${KOTA_ENDPOINT}/${editing.id}`, payload);
      return response.data;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Kota/Kabupaten berhasil diperbarui",
        color: "success",
      });
      await queryClient.invalidateQueries({ queryKey: ["master-kota"], exact: false });
      await queryClient.invalidateQueries({
        queryKey: ["master-kota-by-prov"],
        exact: false,
      });
      onClose();
      setEditing(null);
      setEditingNama("");
      setEditingProvId("");
    },
    onError: (err) => {
      const message =
        err?.payload?.message ||
        err?.message ||
        err?.response?.data?.message ||
        "Gagal memperbarui kota/kabupaten";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const resp = await apiService("delete", api, `${KOTA_ENDPOINT}/${id}`);
      return resp;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Kota/Kabupaten berhasil dihapus",
        color: "success",
      });
      await queryClient.invalidateQueries({ queryKey: ["master-kota"], exact: false });
      await queryClient.invalidateQueries({
        queryKey: ["master-kota-by-prov"],
        exact: false,
      });
    },
    onError: (err) => {
      const message =
        err?.payload?.message || err?.message || "Gagal menghapus kota/kabupaten";
      addToast({ title: "Gagal", description: message, color: "danger" });
    },
  });

  const canSubmit = useMemo(
    () => provId && nama.trim().length > 0,
    [provId, nama],
  );
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 items-end">
        <Select
          label="Provinsi"
          selectedKeys={new Set([String(provId || "")])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] || "";
            setProvId(String(selected));
          }}
          className="max-w-md"
        >
          {provinsiOptions.map((item) => (
            <SelectItem key={String(item.id)}>{item.nama}</SelectItem>
          ))}
        </Select>
        <Input
          label="Nama kota/kabupaten"
          placeholder="Contoh: Jakarta Selatan"
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
          <Table aria-label="Master kota table" className="w-full min-w-0">
            <TableHeader>
              <TableColumn key="id" align="start">
                ID
              </TableColumn>
              <TableColumn key="prov" align="start">
                PROVINSI
              </TableColumn>
              <TableColumn key="nama" align="start">
                KOTA/KABUPATEN
              </TableColumn>
              <TableColumn key="actions" align="center">
                AKSI
              </TableColumn>
            </TableHeader>
            <TableBody items={kotaRows}>
              {(item) => (
                <TableRow key={String(item.id)}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-Poppins text-primary">
                    {provNameById.get(String(item.prov_id)) || item.prov_id || "-"}
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
                          setEditingProvId(String(item.prov_id || ""));
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
                Edit Kota/Kabupaten
              </ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Select
                  label="Provinsi"
                  selectedKeys={new Set([String(editingProvId || "")])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] || "";
                    setEditingProvId(String(selected));
                  }}
                >
                  {provinsiOptions.map((item) => (
                    <SelectItem key={String(item.id)}>{item.nama}</SelectItem>
                  ))}
                </Select>
                <Input
                  label="Nama kota/kabupaten"
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
                    !editingProvId || editingNama.trim().length === 0 || isMutating
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
