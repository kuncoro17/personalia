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
import { MASTERENDPOINT } from "../../constants/api";
import { apiClient } from "../../service/api";
import { useMaster } from "../../hooks/useMaster";
import { buildAttendanceExportXlsx } from "../../utils/xlsxAttendanceExport";

const ROWS_PER_PAGE = 20;
const LEAVE_TYPE_TOTALS = [
  ["CTH", "Cuti Tahunan"],
  ["DNL", "Dinas Luar"],
  ["EVN", "Event"],
  ["IJS", "Izin Setengah Hari"],
  ["LUPA", "Lupa Absen"],
  ["SKTCVD", "Sakit Covid"],
  ["CKH-MT1", "Cuti Khusus Menikah"],
  ["CKH-MT2", "Cuti Khusus Anak Menikah"],
  ["CKH-MT3", "Cuti Khusus Anak Adopsi Menikah"],
  ["CKH-MD1", "Cuti Khusus Istri Meninggal"],
  ["CKH-MD2", "Cuti Khusus Suami Meninggal"],
  ["CKH-MD3", "Cuti Khusus Anak Meninggal"],
  ["CKH-MD4", "Cuti Khusus Orangtua Meninggal"],
  ["CKH-MD5", "Cuti Khusus Mertua Meninggal"],
  ["CKH-MD6", "Cuti Khusus Saudara Kandung Meninggal"],
  ["CKH-MD7", "Cuti Khusus Istri Melahirkan"],
  ["CKH-ML1", "Cuti Khusus Istri Keguguran"],
  ["CKH-ML2", "Cuti Khusus Melahirkan"],
  ["CKH-KG1", "Cuti Khusus Keguguran"],
  ["CKH-KG2", "Cuti Khusus Keluarga Meninggal"],
  ["CKH-AG1", "Cuti Khusus Baptis"],
  ["CKH-AG2", "Cuti Khusus Sidi"],
  ["CKH-AG3", "Cuti Khusus Khitan"],
  ["SKT", "Sakit"],
  ["IJF", "Izin Potong Gaji"],
  ["KCL", "Izin Musibah"],
  ["TK", "Tidak Hadir"],
  ["TRN", "Tugas Training"],
  ["HDR", "Hadir"],
];
const getDayColumns = (rows) =>
  Array.from(
    new Set(
      rows.flatMap((row) =>
        Object.keys(row || {}).filter((key) => /^\d{2}-[A-Za-z]{3}$/.test(key)),
      ),
    ),
  );
const getSelectedKey = (keys) =>
  typeof keys === "string" ? keys : (Array.from(keys)[0] ?? "all");
const UNIT_FILTER_FIELDS = [
  { key: "DIREKTUR", relation: "direktur", label: "Direktur" },
  { key: "DEPUTI", relation: "deputi", label: "Deputi" },
  { key: "DIVISI", relation: "divisi", label: "Divisi" },
  { key: "BAGIAN", relation: "bagian", label: "Bagian" },
  { key: "SEKSI", relation: "seksi", label: "Seksi" },
];
const isValidUnitValue = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  return normalized && normalized !== "nnn" && normalized !== "none";
};
const buildPivotEndpoint = ({ start, end, unitFilter, page, limit }) =>
  `personalia/absensi/pivot?${new URLSearchParams({
    tanggal_mulai: start,
    tanggal_selesai: end,
    ...(page && limit ? { page: String(page), limit: String(limit) } : {}),
    ...(unitFilter !== "all"
      ? {
          unitType: unitFilter.split(":")[0],
          unitKode: unitFilter.split(":").slice(1).join(":"),
        }
      : {}),
  }).toString()}`;
const buildColumns = (rows) => [
  { key: "nik", label: "NIK", frozen: true },
  { key: "nama_lengkap", label: "NAMA KARYAWAN", frozen: true },
  { key: "nama_div", label: "DIVISI" },
  { key: "nama_bag", label: "BAGIAN" },
  { key: "jabatan", label: "JABATAN" },
  ...getDayColumns(rows).map((key) => ({ key, label: key })),
  { key: "total_yangmenggunakanjam", label: "JAM" },
  ...LEAVE_TYPE_TOTALS.map(([code, label]) => ({
    key: `total_kode_${code}`,
    label: code,
    description: label,
  })),
  { key: "total_semua", label: "TOTAL" },
];
const addLeaveTypeTotals = (row) => {
  const dayColumns = getDayColumns([row]);
  const next = { ...row };
  LEAVE_TYPE_TOTALS.forEach(([code]) => {
    next[`total_kode_${code}`] = dayColumns.filter((day) => {
      const value = String(row?.[day] ?? "").trim();
      return code === "HDR"
        ? /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(value)
        : value === code;
    }).length;
  });
  return next;
};
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
  const [unitFilter, setUnitFilter] = useState("all");
  const [tableSearch, setTableSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const endpoint = useMemo(
    () =>
      appliedPeriod
        ? buildPivotEndpoint({ ...appliedPeriod, page: 1, limit: 500 })
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
    select: (response) =>
      (Array.isArray(response?.data) ? response.data : []).map(
        addLeaveTypeTotals,
      ),
  });

  const { data: masterUnitKerja = [] } = useMaster(
    api,
    ["attendance-unit-options"],
    MASTERENDPOINT.lokasiKerja,
    {
      enabled: isLoaded && isSignedIn,
      select: (response) =>
        Array.isArray(response?.data) ? response.data : [],
    },
  );
  const unitOptions = useMemo(() => {
    const options = new Map();
    masterUnitKerja.forEach((unit) => {
      UNIT_FILTER_FIELDS.forEach((field) => {
        const relation = unit?.[field.relation] ?? {};
        const code = String(
          relation?.id ?? unit?.[`kode_${field.relation}`] ?? "",
        ).trim();
        if (!isValidUnitValue(code)) return;
        const name = String(relation?.nama ?? relation?.name ?? code).trim();
        options.set(`${field.key}:${code}`, {
          key: `${field.key}:${code}`,
          label: `${field.label}: ${name || code}`,
        });
      });
    });
    return Array.from(options.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, [masterUnitKerja]);
  const dayColumns = useMemo(() => getDayColumns(rows), [rows]);
  const filteredRows = useMemo(() => {
    const query = tableSearch.trim().toLocaleLowerCase("id-ID");

    if (!query) return rows;

    return rows.filter((row) =>
      [row?.nik, row?.nama_lengkap].some((value) =>
        String(value ?? "")
          .toLocaleLowerCase("id-ID")
          .includes(query),
      ),
    );
  }, [rows, tableSearch]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ROWS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);
  const displayedRows = filteredRows.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );
  const applyPeriod = () => {
    if (!startDate || !endDate || startDate > endDate) return;
    setAppliedPeriod({
      start: startDate,
      end: endDate,
      unitFilter,
    });
    setPage(1);
  };
  const columns = buildColumns(rows);
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
  const exportDirectly = async () => {
    if (!startDate || !endDate || startDate > endDate) return;

    setIsExporting(true);
    try {
      const request = { start: startDate, end: endDate, unitFilter };
      const response = await api.get(buildPivotEndpoint(request), {
        // Pivot untuk ribuan karyawan membutuhkan waktu lebih lama daripada
        // request tabel biasa. Jangan gunakan timeout default 15 detik.
        timeout: 120_000,
      });
      const exportRows = (
        Array.isArray(response?.data?.data) ? response.data.data : []
      ).map(addLeaveTypeTotals);

      if (exportRows.length === 0) {
        addToast({
          title: "Tidak ada data",
          description: "Tidak ada data absensi sesuai filter yang dipilih.",
          color: "warning",
        });
        return;
      }

      const blob = await buildAttendanceExportXlsx(
        buildColumns(exportRows),
        exportRows,
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DATA-ABSENSI-${startDate}-${endDate}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      addToast({
        title: "Gagal export Excel",
        description: getErrorMessage(err),
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
        <div className="personalia-card grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
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
            label="Unit Kerja"
            selectedKeys={[unitFilter]}
            onSelectionChange={(keys) => {
              setUnitFilter(getSelectedKey(keys));
              setAppliedPeriod(null);
            }}
          >
            <SelectItem key="all">Semua unit kerja</SelectItem>
            {unitOptions.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
          <div className="flex flex-wrap gap-2">
            <Button
              color="primary"
              isDisabled={!startDate || !endDate || startDate > endDate}
              onPress={applyPeriod}
            >
              Tampilkan
            </Button>
            <Button
              color="success"
              isDisabled={!startDate || !endDate || startDate > endDate}
              isLoading={isExporting}
              onPress={exportDirectly}
            >
              Export Langsung
            </Button>
            <Button
              variant="bordered"
              onPress={() => {
                setUnitFilter("all");
                setAppliedPeriod(null);
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
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className="text-sm text-default-500">
                  {filteredRows.length} data karyawan
                </p>
                <Input
                  aria-label="Cari NIK atau nama karyawan"
                  className="w-64"
                  placeholder="Cari NIK atau nama"
                  size="sm"
                  value={tableSearch}
                  onValueChange={(value) => {
                    setTableSearch(value);
                    setPage(1);
                  }}
                />
              </div>
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
