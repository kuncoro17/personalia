import { useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Input,
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
} from "@heroui/react";
import { addToast } from "@heroui/toast";

import { useMaster } from "../../../hooks/useMaster";
import { apiService } from "../../../service/api";

import { normalizeApiList, unwrapApiRecord } from "./utils";

const FIELDS = [
  {
    key: "kode_direktur",
    label: "Direktur",
    endpoint: "master-direktur",
    name: "nama_dir",
    queryKey: "master-direktur",
  },
  {
    key: "kode_deputi",
    label: "Deputi",
    endpoint: "master-deputi/getAllDeputi",
    name: "nama_dep",
    queryKey: "master-deputi",
  },
  {
    key: "kode_divisi",
    label: "Divisi",
    endpoint: "personalia/divisi",
    name: "nama_div",
    queryKey: "master-divisi",
  },
  {
    key: "kode_bagian",
    label: "Bagian/Biro/Sekolah",
    endpoint: "personalia/bagian",
    name: "nama_bag",
    queryKey: "master-bagian",
  },
  {
    key: "kode_seksi",
    label: "Seksi",
    endpoint: "seksi",
    name: "nama_sek",
    queryKey: "master-seksi",
  },
];
const EMPTY_FORM = Object.fromEntries(FIELDS.map(({ key }) => [key, ""]));
const normalizeCode = (value) => {
  const code = String(value ?? "").trim();

  return code === "nnn" || code === "None" ? "" : code;
};
const errorMessage = (error) =>
  error?.payload?.error?.message ||
  error?.payload?.message ||
  error?.response?.data?.message ||
  error?.message ||
  "Silakan coba kembali.";

export default function MasterUnitKerjaSection({ api, isReady }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const units = useMaster(api, ["master-unit-kerja"], "unit-kerja/getall", {
    enabled: isReady,
    returnEmptyOnError: false,
  });
  const masters = useQueries({
    queries: FIELDS.map((field) => ({
      queryKey: [field.queryKey],
      queryFn: () => apiService("get", api, field.endpoint),
      enabled: isReady,
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });
  const options = FIELDS.map((field, index) => {
    const records = normalizeApiList(masters[index].data).map(unwrapApiRecord);

    return [
      ...new Map(
        records.map((row) => [
          normalizeCode(row.kode),
          {
            code: normalizeCode(row.kode),
            name: row[field.name] || row.kode,
          },
        ]),
      ).values(),
    ].filter((row) => row.code);
  });
  const rows = normalizeApiList(units.data).map(unwrapApiRecord);
  const labelFor = (row, field, index) => {
    const code = normalizeCode(row[field.key]);

    if (!code) return "—";
    const option = options[index].find((item) => item.code === code);

    return option ? `${code} - ${option.name}` : code;
  };
  const filtered = rows.filter((row) =>
    FIELDS.some((field, index) =>
      labelFor(row, field, index)
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    ),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, totalPages);
  const duplicate = rows.some((row) =>
    FIELDS.every(
      ({ key }) => normalizeCode(row[key]) === normalizeCode(form[key]),
    ),
  );
  const loading = units.isPending || masters.some((query) => query.isPending);
  const error = units.error || masters.find((query) => query.error)?.error;
  const create = useMutation({
    mutationFn: () =>
      api.post("unit-kerja/created", {
        ...form,
        kode_direktur: form.kode_direktur || null,
        kode_deputi: form.kode_deputi || null,
        kode_bagian: form.kode_bagian || "nnn",
        kode_seksi: form.kode_seksi || "nnn",
      }),
    onSuccess: async () => {
      setForm(EMPTY_FORM);
      setSearch("");
      setPage(1);
      addToast({
        title: "Berhasil",
        description: "Unit kerja berhasil ditambahkan",
        color: "success",
      });
      await Promise.all(
        [
          "master-unit-kerja",
          "master-lokasi-kerja",
          "master-bagian-by-divisi",
        ].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      );
    },
    onError: (err) =>
      addToast({
        title: "Gagal menambahkan unit kerja",
        description: errorMessage(err),
        color: "danger",
      }),
  });
  const canSubmit =
    isReady && !loading && !error && !duplicate && Boolean(form.kode_divisi);

  return (
    <>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Pilih struktur organisasi untuk membuat unit kerja. Divisi wajib
        dipilih; bagian dan seksi dapat dikosongkan jika tidak berlaku.
      </p>
      {error && (
        <div className="text-sm text-danger" role="alert">
          Gagal memuat data: {errorMessage(error)}{" "}
          <Button
            size="sm"
            variant="light"
            onPress={() => {
              units.refetch();
              masters.forEach((query) => query.refetch());
            }}
          >
            Coba lagi
          </Button>
        </div>
      )}
      <form
        className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit && !create.isPending) create.mutate();
        }}
      >
        {FIELDS.map((field, index) => (
          <Select
            key={field.key}
            isDisabled={
              !isReady ||
              create.isPending ||
              (field.key === "kode_seksi" && !form.kode_bagian)
            }
            isLoading={masters[index].isPending && isReady}
            isRequired={field.key === "kode_divisi"}
            label={field.label}
            placeholder={
              field.key === "kode_divisi" ? "Pilih divisi" : "Tidak dipilih"
            }
            selectedKeys={form[field.key] ? [form[field.key]] : []}
            onSelectionChange={(keys) =>
              setForm((current) => ({
                ...current,
                [field.key]: String(Array.from(keys)[0] || ""),
                ...(field.key === "kode_divisi"
                  ? { kode_bagian: "", kode_seksi: "" }
                  : {}),
                ...(field.key === "kode_bagian" ? { kode_seksi: "" } : {}),
              }))
            }
          >
            {options[index].map((item) => (
              <SelectItem
                key={item.code}
                textValue={`${item.code} - ${item.name}`}
              >
                {item.code} - {item.name}
              </SelectItem>
            ))}
          </Select>
        ))}
        <Button
          color="primary"
          isDisabled={!canSubmit || create.isPending}
          isLoading={create.isPending}
          type="submit"
        >
          Tambah Unit Kerja
        </Button>
      </form>
      {duplicate && form.kode_divisi && (
        <p className="text-sm text-warning" role="status">
          Kombinasi unit kerja ini sudah tersedia.
        </p>
      )}
      <div className="personalia-card p-3">
        <div className="mb-4 flex items-center gap-3">
          <Input
            aria-label="Cari unit kerja"
            placeholder="Cari unit kerja..."
            value={search}
            onValueChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
          <span className="shrink-0 text-sm text-default-500">
            {filtered.length} data
          </span>
        </div>
        <Table aria-label="Daftar unit kerja">
          <TableHeader>
            {FIELDS.map((field) => (
              <TableColumn key={field.key}>
                {field.label.toUpperCase()}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            emptyContent={
              error ? "Data belum dapat dimuat" : "Belum ada unit kerja"
            }
            isLoading={units.isPending && isReady}
            items={filtered.slice((currentPage - 1) * 10, currentPage * 10)}
            loadingContent={<Spinner />}
          >
            {(row) => (
              <TableRow key={row.uk_id}>
                {FIELDS.map((field, index) => (
                  <TableCell key={field.key}>
                    {labelFor(row, field, index)}
                  </TableCell>
                ))}
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
    </>
  );
}
