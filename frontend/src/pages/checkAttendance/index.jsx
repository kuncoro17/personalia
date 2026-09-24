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
import { useAuth } from "@clerk/clerk-react";
import { useMemo, useState } from "react";

import Layout from "../../components/layout";
import { apiClient } from "../../service/api";
import { useMaster } from "../../hooks/useMaster";
import { buildAttendanceExportXlsx } from "../../utils/xlsxAttendanceExport";

const ROWS_PER_PAGE = 20;
const EMPTY_FILTERS = { unit_kerja: "all", nama_div: "all", nama_bag: "all" };
const getUniqueOptions = (rows, key) =>
  Array.from(
    new Set(rows.map((row) => String(row?.[key] ?? "").trim()).filter(Boolean)),
  ).sort((first, second) => first.localeCompare(second, "id"));
const getDayColumns = (rows) =>
  Array.from(
    new Set(
      rows.flatMap((row) =>
        Object.keys(row || {}).filter((key) => /^\d{2}-[A-Za-z]{3}$/.test(key)),
      ),
    ),
  );
const getErrorMessage = (error) =>
  error?.payload?.message ||
  error?.response?.data?.message ||
  error?.message ||
  "Gagal memuat data absensi.";

export default function CheckAttendancePage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const api = apiClient(getToken);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedPeriod, setAppliedPeriod] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const endpoint = useMemo(
    () =>
      appliedPeriod
        ? `personalia/absensi/pivot?tanggal_mulai=${encodeURIComponent(appliedPeriod.start)}&tanggal_selesai=${encodeURIComponent(appliedPeriod.end)}&page=1&limit=500`
        : "",
    [appliedPeriod],
  );
  const {
    data: rows = [],
    isFetching,
    error,
  } = useMaster(api, ["attendance-pivot", appliedPeriod], endpoint, {
    enabled: Boolean(appliedPeriod) && isLoaded && isSignedIn,
    returnEmptyOnError: false,
    select: (response) => (Array.isArray(response?.data) ? response.data : []),
  });

  const unitOptions = useMemo(
    () => getUniqueOptions(rows, "unit_kerja"),
    [rows],
  );
  const divisiOptions = useMemo(
    () => getUniqueOptions(rows, "nama_div"),
    [rows],
  );
  const bagianOptions = useMemo(
    () => getUniqueOptions(rows, "nama_bag"),
    [rows],
  );
  const dayColumns = useMemo(() => getDayColumns(rows), [rows]);
  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        Object.entries(filters).every(([key, value]) =>
          value === "all" ? true : String(row?.[key] ?? "").trim() === value,
        ),
      ),
    [filters, rows],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ROWS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const displayedRows = filteredRows.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );
  const updateFilter = (key) => (keys) => {
    const value =
      typeof keys === "string" ? keys : (Array.from(keys)[0] ?? "all");
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };
  const applyPeriod = () => {
    if (!startDate || !endDate || startDate > endDate) return;
    setAppliedPeriod({ start: startDate, end: endDate });
    setPage(1);
  };
  const columns = [
    { key: "nik", label: "NIK", frozen: true },
    { key: "nama_lengkap", label: "NAMA KARYAWAN", frozen: true },
    { key: "unit_kerja", label: "UNIT KERJA" },
    { key: "nama_div", label: "DIVISI" },
    { key: "nama_bag", label: "BAGIAN" },
    ...dayColumns.map((key) => ({ key, label: key })),
    { key: "total_yangmenggunakanjam", label: "JAM" },
    { key: "total_LUPA(LUPA)", label: "LUPA" },
    { key: "total_sakit(SKT)", label: "SAKIT" },
    { key: "total_izin(IZN)", label: "IZIN" },
    { key: "total_cuti_tahunan(CTH)", label: "CUTI" },
    { key: "total_semua", label: "TOTAL" },
  ];
  const exportToXlsx = async () => {
    if (!appliedPeriod || filteredRows.length === 0) return;

    setIsExporting(true);
    try {
      const blob = await buildAttendanceExportXlsx(columns, filteredRows);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DATA-ABSENSI-${appliedPeriod.start}-${appliedPeriod.end}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      addToast({
        title: "Gagal export Excel",
        description: err?.message || "File Excel tidak dapat dibuat.",
        color: "danger",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Layout>
      <section className="flex min-w-0 flex-1 flex-col gap-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Check Data Absen
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tinjau kehadiran karyawan dalam format pivot per tanggal.
          </p>
        </div>
        <div className="personalia-card grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-6 xl:items-end">
          <Input
            isRequired
            label="Tanggal mulai"
            type="date"
            value={startDate}
            onValueChange={(value) => {
              setStartDate(value);
              setAppliedPeriod(null);
            }}
          />
          <Input
            isRequired
            label="Tanggal selesai"
            type="date"
            value={endDate}
            onValueChange={(value) => {
              setEndDate(value);
              setAppliedPeriod(null);
            }}
          />
          <Select
            label="Unit kerja"
            selectedKeys={[filters.unit_kerja]}
            onSelectionChange={updateFilter("unit_kerja")}
          >
            <SelectItem key="all">Semua unit kerja</SelectItem>
            {unitOptions.map((item) => (
              <SelectItem key={item}>{item}</SelectItem>
            ))}
          </Select>
          <Select
            label="Divisi"
            selectedKeys={[filters.nama_div]}
            onSelectionChange={updateFilter("nama_div")}
          >
            <SelectItem key="all">Semua divisi</SelectItem>
            {divisiOptions.map((item) => (
              <SelectItem key={item}>{item}</SelectItem>
            ))}
          </Select>
          <Select
            label="Bagian"
            selectedKeys={[filters.nama_bag]}
            onSelectionChange={updateFilter("nama_bag")}
          >
            <SelectItem key="all">Semua bagian</SelectItem>
            {bagianOptions.map((item) => (
              <SelectItem key={item}>{item}</SelectItem>
            ))}
          </Select>
          <div className="flex gap-2">
            <Button
              color="primary"
              isDisabled={!startDate || !endDate || startDate > endDate}
              onPress={applyPeriod}
            >
              Tampilkan
            </Button>
            <Button
              variant="bordered"
              onPress={() => {
                setFilters(EMPTY_FILTERS);
                setPage(1);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        {startDate > endDate && (
          <p className="text-sm text-danger">
            Tanggal mulai tidak boleh melebihi tanggal selesai.
          </p>
        )}
        {error ? (
          <p className="text-sm text-danger">{getErrorMessage(error)}</p>
        ) : (
          <div className="personalia-card min-w-0 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm text-default-500">
                {filteredRows.length} data karyawan
              </p>
              <div className="flex items-center gap-3">
                <p className="text-xs text-default-400">
                  Geser tabel ke samping untuk melihat absensi per tanggal.
                </p>
                <Button
                  color="primary"
                  isDisabled={filteredRows.length === 0 || isExporting}
                  isLoading={isExporting}
                  size="sm"
                  onPress={exportToXlsx}
                >
                  Export Excel
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table aria-label="Data pivot absensi" className="min-w-max">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  emptyContent={
                    appliedPeriod
                      ? "Tidak ada data absensi pada periode ini"
                      : "Masukkan periode tanggal, lalu klik Tampilkan"
                  }
                  isLoading={isFetching}
                  items={displayedRows}
                  loadingContent={<Spinner />}
                >
                  {(row) => (
                    <TableRow key={`${row.nik}-${row.nama_lengkap}`}>
                      {(columnKey) => (
                        <TableCell
                          className={
                            dayColumns.includes(String(columnKey))
                              ? "whitespace-nowrap text-xs"
                              : "whitespace-nowrap"
                          }
                        >
                          {row[columnKey] || "-"}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
        )}
      </section>
    </Layout>
  );
}
