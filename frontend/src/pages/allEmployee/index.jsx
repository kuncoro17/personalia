import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Button,
  Spinner,
  Input,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

import Layout from "../../components/layout";
import { apiClient } from "../../service/api";
import Employees from "../../features/userManagement/employees";
import EmployeeStatus from "../../features/userManagement/employeeStatus";
import { capitalizeWords } from "../../utils/format";
import { useMaster } from "../../hooks/useMaster";
import { EMPLOYEEENDPOINT } from "../../constants/api";
import { LIMITPAGE, PROPFORM } from "../../constants/ui";

export default function AllKaryawan() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const api = apiClient(getToken);
  const queryClient = useQueryClient();

  const [limitPage, setLimitPage] = useState(new Set(["10"]));
  const [isTable, setIsTable] = useState(false);
  const [page, setPage] = useState({ initial: 1, total: 1 });
  const [search, setSearch] = useState("");

  const selectedLimit = useMemo(
    () => Array.from(limitPage).join(", ").replace(/_/g, ""),
    [limitPage],
  );

  const { data, isFetching, refetch, error } = useMaster(
    api,
    ["allKaryawan", page, limitPage],
    EMPLOYEEENDPOINT.getAll(page.initial, selectedLimit),
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
    if (searchData || data) {
      let dataPagination = searchData ?? data;
      setPage({
        initial: dataPagination?.pagination?.page ?? 1,
        total: dataPagination?.pagination?.totalPages ?? 1,
      });
    }
  }, [data, searchData]);

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
                    className="font-Poppins border-primary border-1 rounded-md"
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
    </Layout>
  );
}
