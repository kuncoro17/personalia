import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Input,
  Pagination,
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

import { normalizeApiList, unwrapApiRecord } from "./utils";

const EMPTY_FORM = { kode_jab: "", jabatan: "" };
const QUERY_KEY = ["jabatan"];
const getErrorMessage = (error) =>
  error?.payload?.message ||
  error?.response?.data?.message ||
  error?.message ||
  "Silakan coba kembali.";

export default function MasterJabatanSection({ api, isReady }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isPending, error, refetch } = useMaster(
    api,
    QUERY_KEY,
    "personalia/jabatan/getall",
    { enabled: isReady, returnEmptyOnError: false },
  );
  const rows = normalizeApiList(data).map(unwrapApiRecord);
  const filtered = rows.filter((row) =>
    [row.kode_jab, row.jabatan].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    ),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, totalPages);
  const duplicate = rows.some(
    (row) =>
      String(row.kode_jab ?? "")
        .trim()
        .toLowerCase() === form.kode_jab.trim().toLowerCase(),
  );
  const create = useMutation({
    mutationFn: () =>
      api.post("personalia/jabatan", {
        kode_jab: form.kode_jab.trim(),
        jabatan: form.jabatan.trim(),
      }),
    onSuccess: async () => {
      setForm(EMPTY_FORM);
      setSearch("");
      setPage(1);
      addToast({
        title: "Berhasil",
        description: "Jabatan berhasil ditambahkan",
        color: "success",
      });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) =>
      addToast({
        title: "Gagal menambahkan jabatan",
        description: getErrorMessage(err),
        color: "danger",
      }),
  });
  const canSubmit =
    isReady &&
    !isPending &&
    !error &&
    !duplicate &&
    Boolean(form.kode_jab.trim() && form.jabatan.trim());

  return (
    <>
      <form
        className="grid grid-cols-1 items-end gap-3 md:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit && !create.isPending) create.mutate();
        }}
      >
        <Input
          isRequired
          isDisabled={!isReady || create.isPending}
          label="Kode Jabatan"
          maxLength={255}
          placeholder="Masukkan kode jabatan"
          value={form.kode_jab}
          onValueChange={(value) =>
            setForm((current) => ({ ...current, kode_jab: value }))
          }
        />
        <Input
          isRequired
          isDisabled={!isReady || create.isPending}
          label="Nama Jabatan"
          maxLength={255}
          placeholder="Contoh: Kepala Seksi"
          value={form.jabatan}
          onValueChange={(value) =>
            setForm((current) => ({ ...current, jabatan: value }))
          }
        />
        <Button
          color="primary"
          isDisabled={!canSubmit || create.isPending}
          isLoading={create.isPending}
          type="submit"
        >
          Tambah Jabatan
        </Button>
      </form>
      {duplicate && form.kode_jab.trim() && (
        <p className="text-sm text-warning" role="status">
          Kode jabatan ini sudah tersedia.
        </p>
      )}
      {error && (
        <div className="text-sm text-danger" role="alert">
          Gagal memuat jabatan: {getErrorMessage(error)}
          <Button size="sm" variant="light" onPress={() => refetch()}>
            Coba lagi
          </Button>
        </div>
      )}
      <div className="personalia-card p-3">
        <div className="mb-4 flex items-center gap-3">
          <Input
            aria-label="Cari jabatan"
            placeholder="Cari kode atau nama jabatan..."
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
        <Table aria-label="Daftar jabatan">
          <TableHeader>
            <TableColumn>KODE JABATAN</TableColumn>
            <TableColumn>NAMA JABATAN</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              error ? "Data belum dapat dimuat" : "Belum ada jabatan"
            }
            isLoading={isPending && isReady}
            items={filtered.slice((currentPage - 1) * 10, currentPage * 10)}
            loadingContent={<Spinner />}
          >
            {(row) => (
              <TableRow key={row.jab_id}>
                <TableCell>{row.kode_jab}</TableCell>
                <TableCell>{row.jabatan}</TableCell>
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
