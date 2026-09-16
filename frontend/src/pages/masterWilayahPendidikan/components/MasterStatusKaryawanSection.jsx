import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
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
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MASTERENDPOINT } from "../../../constants/api";
import { useMaster } from "../../../hooks/useMaster";
import { apiService } from "../../../service/api";

const EMPTY_FORM = { kode: "", stat_karyawan: "", stat_karyawan_gp: "" };
const QUERY_KEY = ["master-status-karyawan"];
const ROWS_PER_PAGE = 10;

const getErrorMessage = (err, fallback = "Silakan coba kembali.") =>
  err?.payload?.error?.message ||
  err?.response?.data?.error?.message ||
  err?.payload?.message ||
  err?.response?.data?.message ||
  err?.message ||
  fallback;

const normalizeForm = (form) => ({
  kode: form.kode.trim(),
  stat_karyawan: form.stat_karyawan.trim(),
  stat_karyawan_gp: form.stat_karyawan_gp.trim() || null,
});

export default function MasterStatusKaryawanSection({ api, isReady }) {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [editingForm, setEditingForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: rows = [],
    isFetching,
    error,
  } = useMaster(api, QUERY_KEY, MASTERENDPOINT.statusKaryawan, {
    enabled: isReady,
    returnEmptyOnError: false,
    select: (response) =>
      (Array.isArray(response?.data) ? response.data : [])
        .map((item) => ({
          id: String(item?.stat_id ?? item?.id ?? "").trim(),
          kode: String(item?.kode ?? "").trim(),
          stat_karyawan: String(item?.stat_karyawan ?? "").trim(),
          stat_karyawan_gp: String(item?.stat_karyawan_gp ?? "").trim(),
        }))
        .filter((item) => item.id),
  });

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((row) =>
      [row.kode, row.stat_karyawan, row.stat_karyawan_gp].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    );
  }, [rows, search]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ROWS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const displayedRows = filteredRows.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  const createMutation = useMutation({
    mutationFn: () =>
      api.post(MASTERENDPOINT.statusKaryawan, normalizeForm(form)),
    onSuccess: async () => {
      setForm(EMPTY_FORM);
      addToast({
        title: "Berhasil",
        description: "Status karyawan ditambahkan",
        color: "success",
      });
      await invalidate();
    },
    onError: (err) =>
      addToast({
        title: "Gagal menambahkan status",
        description: getErrorMessage(err),
        color: "danger",
      }),
  });
  const updateMutation = useMutation({
    mutationFn: () =>
      api.put(
        `${MASTERENDPOINT.statusKaryawan}/${editing?.id}`,
        normalizeForm(editingForm),
      ),
    onSuccess: async () => {
      onClose();
      setEditing(null);
      setEditingForm(EMPTY_FORM);
      addToast({
        title: "Berhasil",
        description: "Status karyawan diperbarui",
        color: "success",
      });
      await invalidate();
    },
    onError: (err) =>
      addToast({
        title: "Gagal memperbarui status",
        description: getErrorMessage(err),
        color: "danger",
      }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      apiService("delete", api, `${MASTERENDPOINT.statusKaryawan}/${id}`),
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Status karyawan dihapus",
        color: "success",
      });
      await invalidate();
    },
    onError: (err) =>
      addToast({
        title: "Gagal menghapus status",
        description: getErrorMessage(err),
        color: "danger",
      }),
  });

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const isDuplicateCode = (value, excludedId = "") =>
    rows.some(
      (row) =>
        row.id !== excludedId &&
        row.kode.toLowerCase() === value.trim().toLowerCase(),
    );
  const canCreate =
    form.kode.trim().length >= 2 &&
    Boolean(form.stat_karyawan.trim()) &&
    !isDuplicateCode(form.kode);
  const canUpdate =
    editingForm.kode.trim().length >= 2 &&
    Boolean(editingForm.stat_karyawan.trim()) &&
    !isDuplicateCode(editingForm.kode, editing?.id);
  const updateFormField = (setter, field) => (value) =>
    setter((current) => ({ ...current, [field]: value }));

  return (
    <>
      <form
        className="grid grid-cols-1 items-end gap-3 md:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (canCreate && !isMutating) createMutation.mutate();
        }}
      >
        <Input
          isRequired
          isDisabled={!isReady || isMutating}
          label="Kode"
          maxLength={5}
          placeholder="Contoh: TET"
          value={form.kode}
          onValueChange={updateFormField(setForm, "kode")}
        />
        <Input
          isRequired
          isDisabled={!isReady || isMutating}
          label="Status Karyawan"
          placeholder="Contoh: Tetap"
          value={form.stat_karyawan}
          onValueChange={updateFormField(setForm, "stat_karyawan")}
        />
        <Input
          isDisabled={!isReady || isMutating}
          label="Status GP"
          maxLength={5}
          placeholder="Opsional"
          value={form.stat_karyawan_gp}
          onValueChange={updateFormField(setForm, "stat_karyawan_gp")}
        />
        <Button
          color="primary"
          isDisabled={!canCreate || isMutating}
          isLoading={createMutation.isPending}
          type="submit"
        >
          Tambah Status
        </Button>
      </form>
      {isDuplicateCode(form.kode) && form.kode.trim() && (
        <p className="text-sm text-warning">Kode status sudah tersedia.</p>
      )}
      {error && (
        <p className="text-sm text-danger">
          Gagal memuat status karyawan: {getErrorMessage(error)}
        </p>
      )}
      <div className="personalia-card p-3">
        <div className="mb-4 flex items-center gap-3">
          <Input
            aria-label="Cari status karyawan"
            placeholder="Cari kode atau status..."
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
          <span className="shrink-0 text-sm text-default-500">
            {filteredRows.length} data
          </span>
        </div>
        <Table aria-label="Daftar status karyawan">
          <TableHeader>
            <TableColumn>KODE</TableColumn>
            <TableColumn>STATUS KARYAWAN</TableColumn>
            <TableColumn>STATUS GP</TableColumn>
            <TableColumn>AKSI</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              error ? "Data belum dapat dimuat" : "Belum ada status karyawan"
            }
            isLoading={isFetching && isReady}
            items={displayedRows}
            loadingContent={<Spinner />}
          >
            {(row) => (
              <TableRow key={row.id}>
                <TableCell>{row.kode}</TableCell>
                <TableCell>{row.stat_karyawan}</TableCell>
                <TableCell>{row.stat_karyawan_gp || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="bordered"
                      isDisabled={isMutating}
                      onPress={() => {
                        setEditing(row);
                        setEditingForm({
                          kode: row.kode,
                          stat_karyawan: row.stat_karyawan,
                          stat_karyawan_gp: row.stat_karyawan_gp,
                        });
                        onOpen();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      variant="bordered"
                      isDisabled={isMutating}
                      onPress={() => deleteMutation.mutate(row.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              showControls
              page={currentPage}
              total={totalPages}
              onChange={setPage}
            />
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(closeHandler) => (
            <>
              <ModalHeader>Edit Status Karyawan</ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Kode"
                  maxLength={5}
                  value={editingForm.kode}
                  onValueChange={updateFormField(setEditingForm, "kode")}
                />
                <Input
                  isRequired
                  label="Status Karyawan"
                  value={editingForm.stat_karyawan}
                  onValueChange={updateFormField(
                    setEditingForm,
                    "stat_karyawan",
                  )}
                />
                <Input
                  label="Status GP"
                  maxLength={5}
                  value={editingForm.stat_karyawan_gp}
                  onValueChange={updateFormField(
                    setEditingForm,
                    "stat_karyawan_gp",
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  isDisabled={isMutating}
                  onPress={closeHandler}
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
