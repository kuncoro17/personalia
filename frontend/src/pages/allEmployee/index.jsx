import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Button,
  Spinner,
  Input,
  useDisclosure,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
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

const ALL_SETEMPAT_ACCESS_EMAILS = new Set(
  [
    "kuncoro.kinasih@bpkpenaburjakarta.or.id",
    "antoni.wijaya@bpkpenaburjakarta.or.id",
    "eka.muliawan@bpkpenaburjakarta.or.id",
  ].map((email) => email.toLowerCase()),
);

export default function AllKaryawan() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const api = apiClient(getToken);
  const queryClient = useQueryClient();
  const importInputRef = useRef(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [limitPage, setLimitPage] = useState(new Set(["10"]));
  const [selectedSetempat, setSelectedSetempat] = useState(new Set(["all"]));
  const [isTable, setIsTable] = useState(false);
  const [page, setPage] = useState({ initial: 1, total: 1 });
  const [search, setSearch] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const selectedLimit = useMemo(
    () => Array.from(limitPage).join(", ").replace(/_/g, ""),
    [limitPage],
  );

  const loggedInEmail = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    return typeof email === "string" ? email.trim().toLowerCase() : "";
  }, [user]);

  const canViewAllSetempat = useMemo(() => {
    if (ALL_SETEMPAT_ACCESS_EMAILS.has(loggedInEmail)) return true;

    const metadata =
      user?.publicMetadata ??
      user?.unsafeMetadata ??
      user?.privateMetadata ??
      null;

    const statusAktif =
      metadata && typeof metadata.status_aktif === "string"
        ? metadata.status_aktif.trim()
        : "";

    const idMasterSetempatRaw =
      metadata && metadata.id_master_setempat != null
        ? Number(metadata.id_master_setempat)
        : NaN;

    return statusAktif === "Aktif" && Number.isInteger(idMasterSetempatRaw);
  }, [loggedInEmail, user]);

  const isSetempatRestricted = useMemo(() => {
    return isLoaded && isSignedIn && !canViewAllSetempat;
  }, [canViewAllSetempat, isLoaded, isSignedIn]);

  const selectedSetempatId = useMemo(() => {
    if (isSetempatRestricted) return 1;
    const raw = Array.from(selectedSetempat)[0] ?? "all";
    if (raw === "all") return null;
    const asNumber = Number(raw);
    return Number.isInteger(asNumber) && asNumber > 0 ? asNumber : null;
  }, [isSetempatRestricted, selectedSetempat]);

  useEffect(() => {
    if (!isSetempatRestricted) return;
    setSelectedSetempat(new Set(["1"]));
  }, [isSetempatRestricted]);

  const { data: masterSetempatOptions } = useMaster(
    api,
    ["master-setempat-options"],
    MASTERENDPOINT.setempat,
    {
      enabled: isLoaded && isSignedIn,
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

  const employeesUrl = useMemo(() => {
    if (selectedSetempatId) {
      return EMPLOYEEENDPOINT.getAllBySetempat(
        selectedSetempatId,
        page.initial,
        selectedLimit,
      );
    }

    return EMPLOYEEENDPOINT.getAll(page.initial, selectedLimit);
  }, [page.initial, selectedLimit, selectedSetempatId]);

  const { data, isFetching, refetch, error } = useMaster(
    api,
    ["allKaryawan", page, limitPage, selectedSetempatId],
    employeesUrl,
    {
      enabled: isLoaded && isSignedIn,
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
  } = useMaster(api, ["search"], EMPLOYEEENDPOINT.search(search), {
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
  });

  useEffect(() => {
    if (search === "")
      queryClient.removeQueries({ queryKey: ["search"], exact: true });
  }, [search]);

  useEffect(() => {
    setPage((prev) => ({ ...prev, initial: 1 }));
  }, [selectedSetempatId, selectedLimit]);

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
    if (isSetempatRestricted) {
      const options = Array.isArray(masterSetempatOptions)
        ? masterSetempatOptions
        : [];
      const found = options.find((item) => Number(item.id) === 1);
      return found?.kota_setempat || "1";
    }

    if (!selectedSetempatId) return "Semua Kota";
    const options = Array.isArray(masterSetempatOptions)
      ? masterSetempatOptions
      : [];
    const found = options.find(
      (item) => Number(item.id) === selectedSetempatId,
    );
    return found?.kota_setempat || String(selectedSetempatId);
  }, [isSetempatRestricted, masterSetempatOptions, selectedSetempatId]);

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
        /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(value ?? "").trim());

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
      <section className="flex flex-col gap-10 flex-1 px-6 pb-5">
        <EmployeeStatus />

        <div className="flex flex-col justify-between flex-1 gap-5">
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <p className="font-Poppins text-xl font-semibold text-primary">
                All Employee
              </p>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="font-Poppins border-primary border-1 rounded-md whitespace-nowrap min-w-[72px] justify-center"
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
                    className="font-Poppins border-primary border-1 rounded-md whitespace-nowrap min-w-[140px] justify-center"
                    variant="bordered"
                    isDisabled={
                      !isLoaded || !isSignedIn || isSetempatRestricted
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
                      .filter((item) => Number(item.id) === 1)
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

              <Input
                {...PROPFORM}
                classNames={{
                  input: "text-small",
                  inputWrapper: "font-DMSans border-1 shadow-sm",
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

            <div className="flex gap-5 items-center">
              <input
                ref={importInputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleImportSelectedFile}
              />

              <Button
                className="font-Poppins whitespace-nowrap"
                color="primary"
                isDisabled={!isLoaded || !isSignedIn || isImporting}
                onPress={onOpen}
              >
                Tambah Karyawan
              </Button>

              <Button
                className="font-Poppins border-primary border-1 rounded-md whitespace-nowrap"
                variant="bordered"
                isDisabled={!isLoaded || !isSignedIn || isImporting}
                onPress={downloadTemplate}
              >
                Download Template Excel
              </Button>

              <Button
                className="font-Poppins border-primary border-1 rounded-md whitespace-nowrap"
                variant="bordered"
                isDisabled={!isLoaded || !isSignedIn || isImporting}
                isLoading={isImporting}
                onPress={() => importInputRef.current?.click?.()}
              >
                Import File Excel
              </Button>

              <button
                className={`h-10 shadow-md aspect-square flex items-center justify-center rounded-md ${!isTable && "bg-primary"}`}
                onClick={() => setIsTable(false)}
              >
                <i
                  className={`fi fi-rr-apps ${!isTable ? "text-white" : ""}`}
                />
              </button>

              <button
                className={`h-10 shadow-md aspect-square flex items-center justify-center rounded-md ${isTable && "bg-primary"}`}
                onClick={() => setIsTable(true)}
              >
                <i
                  className={`fi fi-rr-list ${isTable ? "text-white" : "text-primary"}`}
                />
              </button>
            </div>
          </div>

          {isFetching || searchFetching ? (
            <div className="w-full flex items-center justify-center min-h-20">
              <Spinner size="md" color="primary" />
            </div>
          ) : error || searchError ? (
            <div className="w-full flex items-center justify-center min-h-20">
              <p className="font-Poppins text-primary opacity-70 text-center">
                {searchError?.message ||
                  error?.message ||
                  "Gagal memuat data karyawan"}
              </p>
            </div>
          ) : (data?.data?.length ?? 0) === 0 ||
            ((searchData?.data?.length ?? 0) === 0 &&
              search !== "" &&
              searchData) ? (
            <div className="w-full flex items-center justify-center min-h-20">
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
            className="font-Poppins"
          />
        </div>
      </section>

      <AddEmployeeModal api={api} isOpen={isOpen} onOpenChange={onOpenChange} />
    </Layout>
  );
}
