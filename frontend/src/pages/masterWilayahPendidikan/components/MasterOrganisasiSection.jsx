import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
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
import { apiService } from "../../../service/api";
import { normalizeApiList, unwrapApiRecord } from "./utils";

const EMPTY_FORM = {
  kode: "",
  nama: "",
  alamat: "",
  divisi: "",
  bagian: "",
};

const DIVISI_ENDPOINT = "personalia/divisi";
const UNIT_KERJA_ENDPOINT = "unit-kerja";
const UNIT_KERJA_LIST_ENDPOINT = "unit-kerja/getllUnitKerja";

const isNoneValue = (value) => {
  const normalized = String(value ?? "").trim();
  return !normalized || normalized === "nnn" || normalized === "None";
};

const getErrorMessage = (err, fallback) =>
  err?.payload?.error?.message ||
  err?.response?.data?.error?.message ||
  err?.payload?.message ||
  err?.response?.data?.message ||
  err?.message ||
  fallback;

const toOption = (id, name) => ({
  id: String(id ?? "").trim(),
  name: String(name ?? "").trim(),
});

const normalizeNestedApiList = (payload) => {
  const firstLevel = normalizeApiList(payload);
  if (firstLevel.length > 0) return firstLevel;

  return normalizeApiList(payload?.data);
};

const unitToFlat = (item) => ({
  id: item?.id ?? item?.uk_id ?? null,
  divisiId: String(item?.divisi?.id ?? item?.kode_divisi ?? "").trim(),
  divisiName: String(item?.divisi?.nama ?? item?.divisi?.name ?? "").trim(),
  bagianId: String(item?.bagian?.id ?? item?.kode_bagian ?? "").trim(),
  bagianName: String(item?.bagian?.nama ?? item?.bagian?.name ?? "").trim(),
  seksiId: String(item?.seksi?.id ?? item?.kode_seksi ?? "").trim(),
  seksiName: String(item?.seksi?.nama ?? item?.seksi?.name ?? "").trim(),
});

export default function MasterOrganisasiSection({ api, isReady, config }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [editingForm, setEditingForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const needsDivisi = config.level === "bagian" || config.level === "seksi";
  const needsBagian = config.level === "seksi";
  const isBagianRequired = needsBagian && config.requireBagian !== false;
  const hasDataTableSearch = ["divisi", "bagian", "seksi"].includes(
    config.level,
  );
  const rowsPerPage = 10;

  const {
    data: rowsRaw,
    isFetching,
    error,
  } = useMaster(
    api,
    [config.queryKey],
    config.listEndpoint || config.endpoint,
    {
      enabled: isReady,
      returnEmptyOnError: false,
    },
  );

  const { data: divisiRaw } = useMaster(
    api,
    ["master-divisi-options"],
    DIVISI_ENDPOINT,
    {
      enabled: isReady && needsDivisi,
      returnEmptyOnError: true,
    },
  );

  const { data: unitKerjaRaw } = useMaster(
    api,
    ["master-lokasi-kerja"],
    UNIT_KERJA_LIST_ENDPOINT,
    {
      enabled: isReady && needsDivisi,
      returnEmptyOnError: true,
    },
  );

  const { data: bagianByFormDivisiRaw } = useMaster(
    api,
    ["master-bagian-by-divisi", form.divisi || "none"],
    form.divisi ? `personalia/bagian/divisi/${form.divisi}` : "",
    {
      enabled: isReady && needsBagian && Boolean(form.divisi),
      returnEmptyOnError: true,
    },
  );

  const { data: bagianByEditingDivisiRaw } = useMaster(
    api,
    ["master-bagian-by-divisi", editingForm.divisi || "none"],
    editingForm.divisi ? `personalia/bagian/divisi/${editingForm.divisi}` : "",
    {
      enabled: isReady && needsBagian && Boolean(editingForm.divisi),
      returnEmptyOnError: true,
    },
  );

  const divisiOptions = useMemo(() => {
    const list = normalizeApiList(divisiRaw);
    return list
      .map((item) =>
        toOption(item?.kode ?? item?.id, item?.nama_div ?? item?.nama),
      )
      .filter((item) => item.id && item.name);
  }, [divisiRaw]);

  const unitRows = useMemo(
    () =>
      normalizeApiList(unitKerjaRaw)
        .map(unitToFlat)
        .filter((item) => item.id),
    [unitKerjaRaw],
  );

  const toBagianOptions = (payload, selectedDivisi) => {
    const endpointOptions = normalizeNestedApiList(payload)
      .map((item) =>
        toOption(
          item?.kode_bagian ?? item?.kode ?? item?.id,
          item?.nama_bag ?? item?.nama ?? item?.name,
        ),
      )
      .filter((item) => item.id && item.name);

    if (endpointOptions.length > 0) return endpointOptions;

    const seen = new Set();
    return unitRows
      .filter((item) => item.divisiId === selectedDivisi && item.bagianId)
      .map((item) => toOption(item.bagianId, item.bagianName || item.bagianId))
      .filter((item) => {
        if (!item.id || !item.name || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
  };

  const bagianFormOptions = useMemo(
    () => toBagianOptions(bagianByFormDivisiRaw, form.divisi),
    [bagianByFormDivisiRaw, form.divisi, unitRows],
  );

  const bagianEditingOptions = useMemo(
    () => toBagianOptions(bagianByEditingDivisiRaw, editingForm.divisi),
    [bagianByEditingDivisiRaw, editingForm.divisi, unitRows],
  );

  const findRelation = (kode) => {
    if (!kode) return null;

    if (config.level === "bagian") {
      return (
        unitRows.find(
          (item) => item.bagianId === kode && isNoneValue(item.seksiId),
        ) ?? unitRows.find((item) => item.bagianId === kode)
      );
    }

    if (config.level === "seksi") {
      return unitRows.find((item) => item.seksiId === kode) ?? null;
    }

    return null;
  };

  const rows = useMemo(() => {
    const list = normalizeApiList(rowsRaw);

    return list
      .map((item) => {
        const row = unwrapApiRecord(item);
        const kode = String(row?.kode ?? row?.[config.codeField] ?? "").trim();
        const relation = findRelation(kode);

        return {
          id: row?.[config.idField] ?? row?.id ?? null,
          kode,
          nama: String(row?.[config.nameField] ?? row?.nama ?? "").trim(),
          alamat: String(row?.alamat ?? "").trim(),
          divisi: relation?.divisiId ?? "",
          divisiName: relation?.divisiName ?? "",
          bagian: relation?.bagianId ?? "",
          bagianName: relation?.bagianName ?? "",
        };
      })
      .filter((item) => item.id);
  }, [config.codeField, config.idField, config.nameField, rowsRaw, unitRows]);

  const filteredRows = useMemo(() => {
    if (!hasDataTableSearch) return rows;

    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((item) =>
      [
        item.id,
        item.kode,
        item.nama,
        item.alamat,
        item.divisi,
        item.divisiName,
        item.bagian,
        item.bagianName,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(keyword),
      ),
    );
  }, [hasDataTableSearch, rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const displayedRows = useMemo(() => {
    if (!hasDataTableSearch) return filteredRows;
    const start = (page - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, hasDataTableSearch, page]);

  useEffect(() => {
    setSearch("");
    setPage(1);
  }, [config.level]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const columns = useMemo(() => {
    const base = [
      { key: "id", label: "ID" },
      { key: "kode", label: "KODE" },
      { key: "nama", label: "NAMA" },
    ];

    if (needsDivisi) base.push({ key: "divisi", label: "DIVISI" });
    if (needsBagian) base.push({ key: "bagian", label: "BAGIAN" });

    return [
      ...base,
      { key: "alamat", label: "ALAMAT" },
      { key: "actions", label: "AKSI" },
    ];
  }, [needsBagian, needsDivisi]);

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

  const invalidateLists = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [config.queryKey],
        exact: false,
      }),
      queryClient.invalidateQueries({
        queryKey: ["master-lokasi-kerja"],
        exact: false,
      }),
      queryClient.invalidateQueries({
        queryKey: ["master-bagian-by-divisi"],
        exact: false,
      }),
      queryClient.invalidateQueries({
        queryKey: ["master-seksi"],
        exact: false,
      }),
      queryClient.invalidateQueries({
        queryKey: ["master-bagian"],
        exact: false,
      }),
    ]);
  };

  const syncUnitKerjaRelation = async (data, previousKode = "") => {
    if (config.level !== "bagian" && config.level !== "seksi") return;

    const kode = data.kode.trim();
    const oldKode = String(previousKode || kode).trim();
    const matches =
      config.level === "bagian"
        ? unitRows.filter((item) => item.bagianId === oldKode)
        : unitRows.filter((item) => item.seksiId === oldKode);

    const relationPayload =
      config.level === "bagian"
        ? {
            kode_divisi: data.divisi,
            kode_bagian: kode,
          }
        : {
            kode_divisi: data.divisi,
            // Kolom database tidak menerima NULL; `nnn` berarti Seksi tidak
            // terhubung ke Bagian/Biro/Sekolah mana pun.
            kode_bagian: data.bagian || "nnn",
            kode_seksi: kode,
          };

    if (matches.length > 0) {
      await Promise.all(
        matches.map((item) =>
          api.put(`${UNIT_KERJA_ENDPOINT}/${item.id}`, {
            kode_divisi: relationPayload.kode_divisi,
            kode_bagian: relationPayload.kode_bagian,
            ...(relationPayload.kode_seksi
              ? { kode_seksi: relationPayload.kode_seksi }
              : {}),
          }),
        ),
      );
      return;
    }

    await api.post(`${UNIT_KERJA_ENDPOINT}/created`, {
      kode_divisi: relationPayload.kode_divisi,
      kode_bagian: relationPayload.kode_bagian,
      kode_seksi: relationPayload.kode_seksi || "nnn",
    });
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        config.createEndpoint || config.endpoint,
        buildPayload(form),
      );
      await syncUnitKerjaRelation(form);
      return response.data;
    },
    onSuccess: async () => {
      setForm(EMPTY_FORM);
      addToast({
        title: "Berhasil",
        description: `${config.label} berhasil ditambahkan`,
        color: "success",
      });
      await invalidateLists();
    },
    onError: (err) => {
      addToast({
        title: "Gagal",
        description: getErrorMessage(err, `Gagal menambahkan ${config.name}`),
        color: "danger",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing?.id) throw new Error(`ID ${config.name} tidak ditemukan`);
      const response = await api.put(
        config.updateEndpoint?.(editing.id) ||
          `${config.endpoint}/${editing.id}`,
        buildPayload(editingForm),
      );
      await syncUnitKerjaRelation(editingForm, editing.kode);
      return response.data;
    },
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: `${config.label} berhasil diperbarui`,
        color: "success",
      });
      await invalidateLists();
      onClose();
      setEditing(null);
      setEditingForm(EMPTY_FORM);
    },
    onError: (err) => {
      addToast({
        title: "Gagal",
        description: getErrorMessage(err, `Gagal memperbarui ${config.name}`),
        color: "danger",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      apiService(
        "delete",
        api,
        config.deleteEndpoint?.(id) || `${config.endpoint}/${id}`,
      ),
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: `${config.label} berhasil dihapus`,
        color: "success",
      });
      await invalidateLists();
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
  const canSubmit = Boolean(
      form.kode.trim() &&
      form.nama.trim() &&
      (!needsDivisi || form.divisi) &&
      (!isBagianRequired || form.bagian),
  );
  const canUpdate = Boolean(
      editingForm.kode.trim() &&
      editingForm.nama.trim() &&
      (!needsDivisi || editingForm.divisi) &&
      (!isBagianRequired || editingForm.bagian),
  );

  const updateForm = (field, value) =>
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "divisi" ? { bagian: "" } : {}),
    }));
  const updateEditingForm = (field, value) =>
    setEditingForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "divisi" ? { bagian: "" } : {}),
    }));

  const renderCell = (item, columnKey) => {
    if (columnKey === "id") return item.id;
    if (columnKey === "kode") return item.kode;
    if (columnKey === "nama") {
      return <span className="font-Poppins text-primary">{item.nama}</span>;
    }
    if (columnKey === "divisi") {
      return item.divisiName ? `${item.divisi} - ${item.divisiName}` : "-";
    }
    if (columnKey === "bagian") {
      return item.bagianName ? `${item.bagian} - ${item.bagianName}` : "-";
    }
    if (columnKey === "alamat") return item.alamat || "-";
    if (columnKey === "actions") {
      return (
        <div className="flex flex-nowrap justify-center gap-1.5">
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
                divisi: item.divisi || "",
                bagian: item.bagian || "",
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
      );
    }

    return null;
  };

  const renderParentSelectors = (value, onChange, bagianOptions) => (
    <>
      {needsDivisi && (
        <Select
          label="Divisi"
          placeholder="Pilih divisi"
          selectedKeys={
            value.divisi ? new Set([String(value.divisi)]) : new Set()
          }
          onSelectionChange={(keys) =>
            onChange("divisi", String(Array.from(keys)[0] || ""))
          }
        >
          {divisiOptions.map((item) => (
            <SelectItem key={item.id}>{item.name}</SelectItem>
          ))}
        </Select>
      )}
      {needsBagian && (
        <Select
          label={`Bagian/Biro/Sekolah${isBagianRequired ? "" : " (Opsional)"}`}
          placeholder={
            value.divisi
              ? isBagianRequired
                ? "Pilih bagian/biro/sekolah"
                : "Pilih bagian/biro/sekolah (opsional)"
              : "Pilih divisi dahulu"
          }
          selectedKeys={
            value.bagian ? new Set([String(value.bagian)]) : new Set()
          }
          isDisabled={!value.divisi}
          onSelectionChange={(keys) =>
            onChange("bagian", String(Array.from(keys)[0] || ""))
          }
        >
          {bagianOptions.map((item) => (
            <SelectItem key={item.id}>{item.name}</SelectItem>
          ))}
        </Select>
      )}
    </>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 items-end">
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
        {renderParentSelectors(form, updateForm, bagianFormOptions)}
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

      <div className="personalia-card p-3">
        {hasDataTableSearch && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <Input
              isClearable
              aria-label={`Cari ${config.label}`}
              className="w-full sm:max-w-xs"
              classNames={{
                input: "text-small",
                inputWrapper:
                  "font-DMSans border-1 shadow-sm bg-white rounded-md dark:border-slate-700 dark:bg-slate-950",
              }}
              placeholder={`Cari ${config.label.toLowerCase()}...`}
              startContent={
                <svg
                  className="text-primary dark:text-slate-300"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"
                    fill="currentColor"
                  />
                </svg>
              }
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              onClear={() => {
                setSearch("");
                setPage(1);
              }}
            />
            <span className="shrink-0 font-Poppins text-sm text-default-500">
              {filteredRows.length} data
            </span>
          </div>
        )}
        {isFetching ? (
          <div className="w-full flex items-center justify-center min-h-20">
            <Spinner size="md" color="primary" />
          </div>
        ) : (
          <Table
            aria-label={`Master ${config.name} table`}
            className="w-full min-w-0"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  align={column.key === "actions" ? "center" : "start"}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={`Tidak ada data ${config.name}`}
              items={displayedRows}
            >
              {(item) => (
                <TableRow key={String(item.id)}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        {hasDataTableSearch && !isFetching && totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              showControls
              page={page}
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
                {renderParentSelectors(
                  editingForm,
                  updateEditingForm,
                  bagianEditingOptions,
                )}
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
