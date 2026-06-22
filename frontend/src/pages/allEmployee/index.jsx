import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Spinner,
  Input,
  useDisclosure,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

import Layout from "../../components/layout";
import { apiClient } from "../../service/api";
import Employees from "../../features/userManagement/employees";
import EmployeeStatus from "../../features/userManagement/employeeStatus";
import { capitalizeWords } from "../../utils/format";
import { useMaster } from "../../hooks/useMaster";
import { EMPLOYEEENDPOINT, MASTERENDPOINT } from "../../constants/api";
import { LIMITPAGE, PROPFORM } from "../../constants/ui";
import {
  buildEmployeeImportTemplateXlsx,
  parseEmployeeXlsxFile,
} from "../../utils/xlsxEmployeeImport";
import AddEmployeeModal from "./components/AddEmployeeModal";

const STATUS_AKTIF_OPTIONS = [
  { key: "Aktif", label: "Aktif" },
  { key: "Tidak Aktif", label: "Tidak Aktif" },
];

const UNIT_FILTER_FIELDS = [
  { key: "kode_direktur", relation: "direktur", label: "Direktur" },
  { key: "kode_deputi", relation: "deputi", label: "Deputi" },
  { key: "kode_divisi", relation: "divisi", label: "Divisi" },
  { key: "kode_bagian", relation: "bagian", label: "Bagian" },
];

const UNIT_FILTER_PRIORITY = [...UNIT_FILTER_FIELDS].reverse();

const getUnitRelationValue = (unit, field) => {
  const relation = unit?.[field.relation] ?? {};
  return relation?.id ?? unit?.[field.key] ?? null;
};

const getUnitRelationLabel = (unit, field) => {
  const relation = unit?.[field.relation] ?? {};
  return relation?.nama ?? relation?.name ?? getUnitRelationValue(unit, field);
};

const isValidUnitValue = (value) => {
  const clean = String(value ?? "").trim();
  const normalized = clean.toLowerCase();
  return clean && normalized !== "none" && normalized !== "nnn";
};

const getDeepestUnitFilterOption = (unit) => {
  for (const field of UNIT_FILTER_PRIORITY) {
    const value = getUnitRelationValue(unit, field);
    if (!isValidUnitValue(value)) continue;

    const cleanValue = String(value).trim();
    const label = String(
      getUnitRelationLabel(unit, field) || cleanValue,
    ).trim();

    return {
      key: `${field.key}:${cleanValue}`,
      fieldKey: field.key,
      value: cleanValue,
      label: label || cleanValue,
    };
  }

  return null;
};

const getEmptyUnitFilters = () =>
  Object.fromEntries(UNIT_FILTER_FIELDS.map((field) => [field.key, "all"]));

export default function AllKaryawan() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const api = apiClient(getToken);
  const queryClient = useQueryClient();
  const importInputRef = useRef(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [limitPage, setLimitPage] = useState(new Set(["10"]));
  const [selectedSetempat, setSelectedSetempat] = useState(new Set(["all"]));
  const [selectedStatusAktif, setSelectedStatusAktif] = useState(
    new Set(["Aktif"]),
  );
  const [unitFilters, setUnitFilters] = useState(getEmptyUnitFilters);
  const [unitFilterSearch, setUnitFilterSearch] = useState("");
  const [isUnitFilterOpen, setIsUnitFilterOpen] = useState(false);
  const [isTable, setIsTable] = useState(false);
  const [page, setPage] = useState({ initial: 1, total: 1 });
  const [search, setSearch] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const selectedLimit = useMemo(
    () => Array.from(limitPage).join(", ").replace(/_/g, ""),
    [limitPage],
  );

  const selectedStatusAktifValue = useMemo(
    () => Array.from(selectedStatusAktif)[0] ?? "Aktif",
    [selectedStatusAktif],
  );

  const selectedUnitFilterValues = useMemo(() => {
    return Object.fromEntries(
      Object.entries(unitFilters).filter(([, value]) => value !== "all"),
    );
  }, [unitFilters]);

  const { data: setempatAccess, error: setempatAccessError } = useMaster(
    api,
    ["karyawan-setempat-access"],
    EMPLOYEEENDPOINT.access,
    {
      enabled: isLoaded && isSignedIn,
      returnEmptyOnError: false,
      select: (response) => response?.data ?? null,
    },
  );

  const userSetempatId = useMemo(() => {
    const id = Number(setempatAccess?.id_master_setempat);
    return Number.isInteger(id) && id > 0 ? id : null;
  }, [setempatAccess]);

  const canViewAllSetempat = useMemo(() => {
    return Boolean(setempatAccess?.can_view_all_setempat);
  }, [setempatAccess]);

  const hasSetempatAccess = Boolean(setempatAccess) && !setempatAccessError;

  const isSetempatRestricted = useMemo(() => {
    return hasSetempatAccess && !canViewAllSetempat;
  }, [canViewAllSetempat, hasSetempatAccess]);

  const selectedSetempatId = useMemo(() => {
    if (isSetempatRestricted) return userSetempatId;
    const raw = Array.from(selectedSetempat)[0] ?? "all";
    if (raw === "all") return null;
    const asNumber = Number(raw);
    return Number.isInteger(asNumber) && asNumber > 0 ? asNumber : null;
  }, [isSetempatRestricted, selectedSetempat, userSetempatId]);

  useEffect(() => {
    if (!isSetempatRestricted) return;
    if (!userSetempatId) return;
    setSelectedSetempat(new Set([String(userSetempatId)]));
  }, [isSetempatRestricted, userSetempatId]);

  const { data: masterSetempatOptions } = useMaster(
    api,
    ["master-setempat-options"],
    MASTERENDPOINT.setempat,
    {
      enabled: isLoaded && isSignedIn && hasSetempatAccess,
      select: (resp) => {
        const list = Array.isArray(resp?.data) ? resp.data : [];
        return list
          .map((item) => ({
            id: item?.id ?? null,
            kota_setempat: item?.kota_setempat ?? "",
          }))
          .filter((item) => item.id != null && item.kota_setempat);
      },
    },
  );

  const { data: masterUnitKerjaOptions = [] } = useMaster(
    api,
    ["master-unit-kerja-options"],
    MASTERENDPOINT.lokasiKerja,
    {
      enabled: isLoaded && isSignedIn && hasSetempatAccess,
      select: (resp) => (Array.isArray(resp?.data) ? resp.data : []),
    },
  );

  const combinedUnitFilterOptions = useMemo(() => {
    const rows = Array.isArray(masterUnitKerjaOptions)
      ? masterUnitKerjaOptions
      : [];
    const optionMap = new Map();

    rows.forEach((unit) => {
      const option = getDeepestUnitFilterOption(unit);
      if (!option || optionMap.has(option.key)) return;
      optionMap.set(option.key, option);
    });

    return Array.from(optionMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, [masterUnitKerjaOptions]);

  const selectedCombinedUnitFilter = useMemo(() => {
    const selectedEntry = Object.entries(unitFilters).find(
      ([, value]) => value !== "all",
    );
    if (!selectedEntry) return "all";

    const [fieldKey, value] = selectedEntry;
    return `${fieldKey}:${value}`;
  }, [unitFilters]);

  const selectedCombinedUnitFilterLabel = useMemo(() => {
    if (selectedCombinedUnitFilter === "all") return "Unit Kerja";
    return (
      combinedUnitFilterOptions.find(
        (item) => item.key === selectedCombinedUnitFilter,
      )?.label || "Unit Kerja"
    );
  }, [combinedUnitFilterOptions, selectedCombinedUnitFilter]);

  const filteredUnitFilterOptions = useMemo(() => {
    const keyword = unitFilterSearch.trim().toLowerCase();
    if (!keyword) return combinedUnitFilterOptions;

    return combinedUnitFilterOptions.filter((item) =>
      item.label.toLowerCase().includes(keyword),
    );
  }, [combinedUnitFilterOptions, unitFilterSearch]);

  const handleUnitFilterChange = (keys) => {
    const selectedValue =
      keys == null
        ? "all"
        : typeof keys === "string" || typeof keys === "number"
          ? String(keys)
          : (Array.from(keys)[0] ?? "all");

    if (selectedValue === "all") {
      setUnitFilters(getEmptyUnitFilters());
      setUnitFilterSearch("");
      setIsUnitFilterOpen(false);
      return;
    }

    const selectedOption = combinedUnitFilterOptions.find(
      (item) => item.key === selectedValue,
    );
    if (!selectedOption) return;

    setUnitFilters({
      ...getEmptyUnitFilters(),
      [selectedOption.fieldKey]: selectedOption.value,
    });
    setUnitFilterSearch("");
    setIsUnitFilterOpen(false);
  };

  const employeesUrl = useMemo(() => {
    return EMPLOYEEENDPOINT.getAll(
      page.initial,
      selectedLimit,
      selectedStatusAktifValue,
      selectedUnitFilterValues,
      canViewAllSetempat ? selectedSetempatId : undefined,
    );
  }, [
    canViewAllSetempat,
    page.initial,
    selectedLimit,
    selectedSetempatId,
    selectedStatusAktifValue,
    selectedUnitFilterValues,
  ]);

  const { data, isFetching, refetch, error } = useMaster(
    api,
    [
      "allKaryawan",
      page,
      limitPage,
      selectedSetempatId,
      userSetempatId,
      canViewAllSetempat,
      selectedStatusAktifValue,
      selectedUnitFilterValues,
    ],
    employeesUrl,
    {
      enabled: isLoaded && isSignedIn && hasSetempatAccess,
      returnEmptyOnError: false,
      select: (data) => {
        const rows = data?.data?.data ?? [];
        const pagination = data?.data?.pagination ?? {};

        const filteredItem = rows.map((item) => ({
          id_karyawan: item?.id_karyawan || "",
          nama_lengkap: capitalizeWords(item?.nama_lengkap || ""),
          nik: item?.nik || "",
          foto: item?.foto || "",
          status_karyawan: item?.status_karyawan?.stat_karyawan_gp.trim() || "",
          jabatan: item?.unit_kerja_karyawan[0]?.jabatan?.jabatan || "",
          email_penabur: item?.email_penabur || "",
        }));

        return {
          data: filteredItem,
          pagination: {
            page: pagination.page ?? 1,
            totalPages: pagination.totalPages ?? 1,
          },
        };
      },
    },
  );

  const {
    data: searchData,
    isFetching: searchFetching,
    refetch: searchRefetch,
    error: searchError,
  } = useMaster(
    api,
    [
      "search",
      search,
      selectedSetempatId,
      selectedStatusAktifValue,
      selectedUnitFilterValues,
    ],
    EMPLOYEEENDPOINT.search(
      search,
      undefined,
      selectedSetempatId,
      selectedStatusAktifValue,
      selectedUnitFilterValues,
    ),
    {
      enabled: false,
      returnEmptyOnError: false,
      select: (data) => {
        const rows = data?.data?.data ?? [];

        const filteredItem = rows.map((item) => ({
          id_karyawan: item?.id_karyawan || "",
          nama_lengkap: capitalizeWords(item?.nama_lengkap || ""),
          nik: item?.nik || "",
          foto: item?.foto || "",
          status_karyawan: item?.status_karyawan.trim() || "",
          jabatan: item?.jabatan || "",
          email_penabur: item?.email_penabur || "",
        }));

        return {
          data: filteredItem,
          pagination: {
            page: data?.data?.page ?? 1,
            totalPages: data?.data?.total_pages ?? 1,
          },
        };
      },
    },
  );

  useEffect(() => {
    if (search === "")
      queryClient.removeQueries({ queryKey: ["search"], exact: false });
  }, [search]);

  useEffect(() => {
    setPage((prev) => ({ ...prev, initial: 1 }));
  }, [
    selectedSetempatId,
    selectedLimit,
    selectedStatusAktifValue,
    selectedUnitFilterValues,
  ]);

  useEffect(() => {
    if (search.trim() !== "") searchRefetch();
  }, [selectedSetempatId, selectedStatusAktifValue, selectedUnitFilterValues]);

  useEffect(() => {
    if (searchData || data) {
      let dataPagination = searchData ?? data;
      setPage({
        initial: dataPagination?.pagination?.page ?? 1,
        total: dataPagination?.pagination?.totalPages ?? 1,
      });
    }
  }, [data, searchData]);

  const selectedSetempatLabel = useMemo(() => {
    if (!selectedSetempatId) return "Semua Kota";
    const options = Array.isArray(masterSetempatOptions)
      ? masterSetempatOptions
      : [];
    const found = options.find(
      (item) => Number(item.id) === selectedSetempatId,
    );
    return found?.kota_setempat || String(selectedSetempatId);
  }, [masterSetempatOptions, selectedSetempatId]);

  const downloadTemplate = async () => {
    try {
      const templatePath = "/assets/FORMAT IMPORT.xlsx";
      const res = await fetch(encodeURI(templatePath));
      const blob = res.ok ? await res.blob() : null;

      // Fallback: generate template dynamically when the static file isn't available.
      const resolvedBlob =
        blob ??
        (await buildEmployeeImportTemplateXlsx().catch(() => {
          throw new Error(
            `Template tidak ditemukan di "${templatePath}". Tambahkan file "FORMAT IMPORT.xlsx" ke frontend/public/assets.`,
          );
        }));

      const url = URL.createObjectURL(resolvedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "FORMAT IMPORT.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      addToast({
        title: "Gagal",
        description: err?.message || "Gagal membuat template Excel",
        color: "danger",
      });
    }
  };

  const normalizeImportPayload = (raw) => {
    const payload = { ...raw };

    const numericKeys = [
      "agama",
      "tinggi_badan",
      "berat_badan",
      "id_master_setempat",
    ];
    for (const key of numericKeys) {
      if (payload[key] == null) continue;
      const value = String(payload[key]).trim();
      if (!value) {
        delete payload[key];
        continue;
      }
      const n = Number(value);
      if (!Number.isNaN(n)) payload[key] = n;
    }

    return payload;
  };

  const toFormData = (payload) => {
    const formData = new FormData();
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (value == null) return;
      formData.append(key, String(value));
    });
    return formData;
  };

  const handleImportSelectedFile = async (e) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;

    const isXlsx = /\.xlsx$/i.test(file.name);
    if (!isXlsx) {
      addToast({
        title: "File tidak valid",
        description: "Harus file .xlsx",
        color: "warning",
      });
      return;
    }

    setIsImporting(true);
    try {
      const records = await parseEmployeeXlsxFile(file);
      if (!Array.isArray(records) || records.length === 0) {
        addToast({
          title: "Tidak ada data",
          description: "File Excel tidak memiliki baris data.",
          color: "warning",
        });
        return;
      }

      let success = 0;
      const errors = [];
      const isValidEmail = (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());

      for (let i = 0; i < records.length; i += 1) {
        const row = records[i];
        const payload = normalizeImportPayload(row);
        const nik = String(payload?.nik ?? "").trim();
        const noKtp = String(payload?.no_ktp ?? "").trim();
        const emailPribadi = String(payload?.email_pribadi ?? "").trim();
        const emailPenabur = String(payload?.email_penabur ?? "").trim();

        if (!nik) {
          errors.push({ row: i + 2, message: "NIK wajib diisi" });
          continue;
        }

        if (!/^[0-9]{7,16}$/.test(nik)) {
          errors.push({
            row: i + 2,
            message: "NIK harus berupa angka minimal 7 digit",
          });
          continue;
        }

        if (!noKtp) {
          errors.push({ row: i + 2, message: "No KTP wajib diisi" });
          continue;
        }

        if (!/^[0-9]{16}$/.test(noKtp)) {
          errors.push({
            row: i + 2,
            message: "No KTP harus berupa angka 16 digit",
          });
          continue;
        }

        if (!emailPribadi) {
          errors.push({ row: i + 2, message: "Email pribadi wajib diisi" });
          continue;
        }

        if (!isValidEmail(emailPribadi)) {
          errors.push({
            row: i + 2,
            message: "Format email pribadi tidak valid",
          });
          continue;
        }

        if (!emailPenabur) {
          errors.push({ row: i + 2, message: "Email PENABUR wajib diisi" });
          continue;
        }

        if (!isValidEmail(emailPenabur)) {
          errors.push({
            row: i + 2,
            message: "Format email PENABUR tidak valid",
          });
          continue;
        }

        try {
          await api.post(EMPLOYEEENDPOINT.create(), toFormData(payload));
          success += 1;
        } catch (err) {
          const message =
            err?.payload?.message ||
            err?.message ||
            err?.response?.data?.message ||
            "Gagal insert";
          errors.push({ row: i + 2, message });
        }
      }

      if (success > 0) {
        addToast({
          title: "Import selesai",
          description: `Berhasil: ${success}. Gagal: ${errors.length}.`,
          color: errors.length > 0 ? "warning" : "success",
        });
        await queryClient.invalidateQueries({ queryKey: ["allKaryawan"] });
        await queryClient.invalidateQueries({ queryKey: ["search"] });
      } else {
        addToast({
          title: "Import gagal",
          description: `Tidak ada data yang berhasil diinsert. Gagal: ${errors.length}.`,
          color: "danger",
        });
      }

      if (errors.length > 0) {
        console.error("Import errors:", errors);
      }
    } catch (err) {
      addToast({
        title: "Gagal import",
        description: err?.message || "Gagal memproses file Excel",
        color: "danger",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Layout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <section className="flex min-w-0 flex-1 flex-col gap-4 px-3 pb-6 sm:gap-6 sm:px-6">
        <EmployeeStatus />

        <div className="flex min-w-0 flex-1 flex-col gap-5 rounded-2xl border border-[#00000010] bg-[#FBFCFE] p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div>
                <p className="font-Poppins text-xl font-semibold text-primary">
                  All Employee
                </p>
                <p className="font-Poppins text-sm text-primary/60">
                  Kelola data karyawan berdasarkan kota dan status aktif.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:items-center">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="w-full justify-center rounded-md border-1 border-primary font-Poppins md:w-auto md:min-w-[72px]"
                      variant="bordered"
                    >
                      {selectedLimit}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Single selection example"
                    selectedKeys={limitPage}
                    selectionMode="single"
                    variant="flat"
                    onSelectionChange={setLimitPage}
                  >
                    {LIMITPAGE.map((item) => (
                      <DropdownItem key={item} className="font-Poppins">
                        {item}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="w-full justify-center rounded-md border-1 border-primary font-Poppins md:w-auto md:min-w-[140px]"
                      variant="bordered"
                      isDisabled={
                        !isLoaded ||
                        !isSignedIn ||
                        !hasSetempatAccess ||
                        isSetempatRestricted
                      }
                    >
                      {selectedSetempatLabel}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Filter master setempat"
                    selectedKeys={selectedSetempat}
                    selectionMode="single"
                    variant="flat"
                    onSelectionChange={setSelectedSetempat}
                  >
                    {!isSetempatRestricted ? (
                      <>
                        <DropdownItem key="all" className="font-Poppins">
                          Semua Kota
                        </DropdownItem>
                        {(Array.isArray(masterSetempatOptions)
                          ? masterSetempatOptions
                          : []
                        ).map((item) => (
                          <DropdownItem
                            key={String(item.id)}
                            className="font-Poppins"
                          >
                            {item.kota_setempat}
                          </DropdownItem>
                        ))}
                      </>
                    ) : (
                      (Array.isArray(masterSetempatOptions)
                        ? masterSetempatOptions
                        : []
                      )
                        .filter((item) => Number(item.id) === userSetempatId)
                        .map((item) => (
                          <DropdownItem
                            key={String(item.id)}
                            className="font-Poppins"
                          >
                            {item.kota_setempat}
                          </DropdownItem>
                        ))
                    )}
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      className="w-full justify-center rounded-md border-1 border-primary font-Poppins md:w-auto md:min-w-[112px]"
                      variant="bordered"
                    >
                      {selectedStatusAktifValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Filter status aktif karyawan"
                    selectedKeys={selectedStatusAktif}
                    selectionMode="single"
                    variant="flat"
                    onSelectionChange={setSelectedStatusAktif}
                  >
                    {STATUS_AKTIF_OPTIONS.map((item) => (
                      <DropdownItem key={item.key} className="font-Poppins">
                        {item.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <Popover
                  isOpen={isUnitFilterOpen}
                  placement="bottom-start"
                  onOpenChange={setIsUnitFilterOpen}
                >
                  <PopoverTrigger>
                    <Button
                      className="col-span-2 w-full justify-between rounded-md border-1 border-primary bg-white font-Poppins md:col-span-1 md:w-auto md:min-w-[220px]"
                      endContent={
                        <span className="text-xs text-default-500">▾</span>
                      }
                      isDisabled={combinedUnitFilterOptions.length === 0}
                      variant="bordered"
                    >
                      <span className="truncate">
                        {selectedCombinedUnitFilterLabel}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-3">
                    <div className="flex w-full flex-col gap-2">
                      <Input
                        aria-label="Cari unit kerja"
                        classNames={{
                          input: "font-Poppins text-small",
                          inputWrapper:
                            "rounded-md border-1 border-default-300 bg-white shadow-none",
                        }}
                        placeholder="Search for an item..."
                        size="sm"
                        value={unitFilterSearch}
                        variant="bordered"
                        onChange={(event) =>
                          setUnitFilterSearch(event.target.value)
                        }
                      />
                      <div className="max-h-72 overflow-y-auto pr-1">
                        <button
                          className={`w-full rounded-md px-3 py-2 text-left font-Poppins text-sm transition-colors hover:bg-default-100 ${
                            selectedCombinedUnitFilter === "all"
                              ? "bg-primary text-white hover:bg-primary"
                              : ""
                          }`}
                          type="button"
                          onClick={() => handleUnitFilterChange("all")}
                        >
                          Semua Unit Kerja
                        </button>
                        {filteredUnitFilterOptions.length === 0 ? (
                          <p className="px-3 py-2 font-Poppins text-sm text-default-400">
                            Tidak ada data
                          </p>
                        ) : (
                          filteredUnitFilterOptions.map((item) => (
                            <button
                              key={item.key}
                              className={`w-full rounded-md px-3 py-2 text-left font-Poppins text-sm transition-colors hover:bg-default-100 ${
                                selectedCombinedUnitFilter === item.key
                                  ? "bg-primary text-white hover:bg-primary"
                                  : ""
                              }`}
                              type="button"
                              onClick={() => handleUnitFilterChange(item.key)}
                            >
                              {item.label}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Input
                  {...PROPFORM}
                  className="col-span-2 min-w-0 md:max-w-xs md:flex-1"
                  classNames={{
                    input: "text-small",
                    inputWrapper:
                      "font-DMSans border-1 shadow-sm bg-white rounded-md",
                  }}
                  placeholder="Cari"
                  type="search"
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#0B345E"
                        d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"
                      />
                    </svg>
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search !== "") searchRefetch();
                  }}
                  onClear={() => {
                    setSearch("", () => refetch());
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center xl:justify-end">
              <input
                ref={importInputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleImportSelectedFile}
              />

              <Button
                className="col-span-2 w-full whitespace-nowrap font-Poppins sm:col-span-1 sm:w-auto"
                color="primary"
                isDisabled={!isLoaded || !isSignedIn || isImporting}
                onPress={onOpen}
              >
                Tambah Karyawan
              </Button>

              <Button
                className="col-span-2 w-full whitespace-nowrap rounded-md border-1 border-primary font-Poppins sm:col-span-1 sm:w-auto"
                variant="bordered"
                isDisabled={!isLoaded || !isSignedIn || isImporting}
                onPress={downloadTemplate}
              >
                Download Template Excel
              </Button>

              <Button
                className="col-span-2 w-full whitespace-nowrap rounded-md border-1 border-primary font-Poppins sm:col-span-1 sm:w-auto"
                variant="bordered"
                isDisabled={!isLoaded || !isSignedIn || isImporting}
                isLoading={isImporting}
                onPress={() => importInputRef.current?.click?.()}
              >
                Import File Excel
              </Button>

              <button
                className={`flex h-10 w-full items-center justify-center rounded-md shadow-sm transition sm:aspect-square sm:w-auto ${!isTable ? "bg-primary" : "bg-white"}`}
                onClick={() => setIsTable(false)}
                type="button"
              >
                <i
                  className={`fi fi-rr-apps ${!isTable ? "text-white" : ""}`}
                />
              </button>

              <button
                className={`flex h-10 w-full items-center justify-center rounded-md shadow-sm transition sm:aspect-square sm:w-auto ${isTable ? "bg-primary" : "bg-white"}`}
                onClick={() => setIsTable(true)}
                type="button"
              >
                <i
                  className={`fi fi-rr-list ${isTable ? "text-white" : "text-primary"}`}
                />
              </button>
            </div>
          </div>

          {isFetching || searchFetching ? (
            <div className="flex min-h-48 w-full items-center justify-center rounded-2xl bg-white">
              <Spinner size="md" color="primary" />
            </div>
          ) : error || searchError || setempatAccessError ? (
            <div className="flex min-h-48 w-full items-center justify-center rounded-2xl bg-white px-4">
              <p className="font-Poppins text-primary opacity-70 text-center">
                {setempatAccessError?.message ||
                  searchError?.message ||
                  error?.message ||
                  "Gagal memuat data karyawan"}
              </p>
            </div>
          ) : (data?.data?.length ?? 0) === 0 ||
            ((searchData?.data?.length ?? 0) === 0 &&
              search !== "" &&
              searchData) ? (
            <div className="flex min-h-48 w-full items-center justify-center rounded-2xl bg-white px-4">
              <p className="font-Poppins text-primary opacity-70">
                Tidak ada data karyawan
              </p>
            </div>
          ) : (
            <Employees
              isTable={isTable}
              data={
                searchData && search !== ""
                  ? (searchData?.data ?? [])
                  : (data?.data ?? [])
              }
            />
          )}

          <Pagination
            showControls
            initialPage={page.initial}
            onChange={(e) => setPage({ ...page, initial: e })}
            total={page.total}
            className="self-center font-Poppins"
          />
        </div>
      </section>

      <AddEmployeeModal api={api} isOpen={isOpen} onOpenChange={onOpenChange} />
    </Layout>
  );
}
