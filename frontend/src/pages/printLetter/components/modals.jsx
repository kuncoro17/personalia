import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Form,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Document, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useAuth } from "@clerk/clerk-react";
import JSZip from "jszip";

import { apiService } from "../../../service/api";
import { apiClient } from "../../../service/api";
import Employees from "../../../features/userManagement/employees";
import { DEFAULT_QUERY_OPTIONS } from "../../../hooks/useMaster";
import { capitalizeWords } from "../../../utils/format";
import { EMPLOYEEENDPOINT, LETTERENDPOINT } from "../../../constants/api";
import { PROPFORM } from "../../../constants/ui";

const LETTER_TYPES = [
  { value: "ttp", label: "Surat Karyawan TTP (Tetap)" },
  { value: "kwt", label: "Surat Karyawan KWT (Kontrak Waktu Tertentu)" },
  { value: "tkl", label: "Surat Karyawan TKL (Tenaga Kerja Lepas)" },
  { value: "wtt", label: "Surat Karyawan WTT (Waktu Tidak Tertentu)" },
  { value: "bipartit", label: "Surat Bipartit" },
  { value: "cutiPanjang", label: "Surat Cuti Panjang" },
  { value: "suratPHKById", label: "Surat PHK" },
  { value: "cutiDiluarTanggungan", label: "Surat Cuti Diluar Tanggungan" },
];

const FormRender = ({ item }) => {
  const DEFAULTPROP = {
    ...PROPFORM,
    label: item.label,
    className: "w-full h-12 text-sm font-Poppins text-primary",
    labelPlacement: "outside",
    placeholder: item.placeholder,
    isClearable: true,
    isRequired: true,
  };

  if (item.type === "number")
    return (
      <Input
        {...DEFAULTPROP}
        validate={(value) => {
          if (value.trim() !== "" && !/^\d+$/.test(value.trim())) {
            return "Harus berupa angka!";
          }
        }}
      />
    );

  if (item.type === "select") {
    const options = Array.isArray(item.listSelect) ? item.listSelect : [];

    return (
      <Select {...DEFAULTPROP}>
        {options.map((option) => (
          <SelectItem key={option} className="font-Poppins text-primary">
            {option}
          </SelectItem>
        ))}
      </Select>
    );
  }

  return <Input {...DEFAULTPROP} />;
};

export default function Modals({ isOpen, onOpenChange, selectedSurat }) {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const [search, setSearch] = useState("");
  const [isTable, setIsTable] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState([]);
  const [isLoading, setIsLoading] = useState({ pdf: false, print: false });
  const [selectedLetterType, setSelectedLetterType] = useState("");
  const [letterData, setLetterData] = useState(null);

  const title = selectedSurat?.title ?? "Surat";
  const LetterComponent = selectedSurat?.letter;
  const formFields = Array.isArray(selectedSurat?.form)
    ? selectedSurat.form
    : [];
  const hasForm = formFields.length > 0;

  useEffect(() => {
    setSearch("");
    setSelectedKaryawan([]);
    setSelectedLetterType("");
    setLetterData(null);
  }, [isOpen]);

  const handleLoading = (key, value) => {
    setIsLoading((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch letter data from API when employee and letter type are selected
  const fetchLetterData = async (employeeId, letterType) => {
    if (!employeeId || !letterType) return;

    try {
      const endpoint = LETTERENDPOINT[letterType];
      if (!endpoint) {
        alert("Jenis surat tidak valid");
        return;
      }

      const url =
        typeof endpoint === "function" ? endpoint(employeeId) : endpoint;
      const response = await apiService("get", api, url);

      if (response?.data) {
        setLetterData(response.data);
      }
    } catch (error) {
      console.error("Error fetching letter data:", error);
      alert("Gagal mengambil data surat");
    }
  };

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["listEmployeeLetter"],
      queryFn: ({ pageParam = `?page=1&limit=10` }) =>
        apiService("get", api, `personalia/karyawan/employee${pageParam}`),
      getNextPageParam: (lastPage) => {
        return lastPage.data.pagination.page <
          lastPage.data.pagination.totalPages
          ? `?page=${lastPage.data.pagination.page + 1}&limit=10`
          : undefined;
      },
      select: (data) => {
        const rows = data.pages
          .flatMap((p) => p?.data?.data ?? [])
          .map((item) => ({
            id_karyawan: item?.id_karyawan ?? "",
            nama_lengkap: capitalizeWords(item?.nama_lengkap) ?? "",
            nik: item?.nik ?? "",
            status_karyawan:
              item?.status_karyawan?.stat_karyawan_gp?.trim?.() ?? "",
            jabatan: item?.unit_kerja_karyawan[0]?.jabatan?.jabatan || "",
            email_penabur: item?.email_penabur ?? "",
          }));

        const last = data.pages[data.pages.length - 1];

        return {
          data: rows,
          pagination: {
            page: last?.data?.pagination?.page ?? 1,
            totalPages: last?.data?.pagination?.totalPages ?? 1,
          },
        };
      },
      ...DEFAULT_QUERY_OPTIONS,
    });

  const {
    data: searchEmployee,
    refetch: refetchSearch,
    isFetching: isFetchingSearch,
  } = useInfiniteQuery({
    queryKey: ["listEmployeeSearchLetter", search],
    enabled: false,
    queryFn: ({ pageParam = `page=1&limit=10` }) =>
      apiService("get", api, EMPLOYEEENDPOINT.search(search, pageParam)),
    getNextPageParam: (lastPage) => {
      return lastPage.data.page < lastPage.data.total_pages
        ? `page=${lastPage.data.page + 1}&limit=10`
        : undefined;
    },
    select: (data) => {
      const rows = data.pages
        .flatMap((p) => p?.data?.data ?? [])
        .map((item) => ({
          id_karyawan: item?.id_karyawan ?? "",
          nama_lengkap: capitalizeWords(item?.nama_lengkap) ?? "",
          nik: item?.nik ?? "",
          status_karyawan:
            item?.status_karyawan?.stat_karyawan_gp?.trim?.() ?? "",
          jabatan: item?.unit_kerja_karyawan[0]?.jabatan?.jabatan || "",
          email_penabur: item?.email_penabur ?? "",
        }));

      const last = data.pages[data.pages.length - 1];

      return {
        data: rows,
        pagination: {
          page: last?.data?.page ?? 1,
          totalPages: last?.data?.totalPages ?? 1,
        },
      };
    },
    ...DEFAULT_QUERY_OPTIONS,
  });

  const handleSelectKaryawan = (karyawan) => {
    if (selectedKaryawan.includes(karyawan)) {
      setSelectedKaryawan(selectedKaryawan.filter((item) => item !== karyawan));
    } else {
      setSelectedKaryawan((prev) => [...prev, karyawan]);
    }
  };

  const generatePDFBlob = async () => {
    if (!LetterComponent) {
      throw new Error("Template surat tidak tersedia.");
    }

    const pdfBlob = await pdf(
      <Document title="Surat">
        <LetterComponent data={letterData} />
      </Document>,
    ).toBlob();
    return pdfBlob;
  };

  const handlePreviewPDF = async () => {
    if (!selectedKaryawan.length) {
      alert("Pilih karyawan terlebih dahulu");
      return;
    }

    if (!selectedLetterType) {
      alert("Pilih jenis surat terlebih dahulu");
      return;
    }

    try {
      handleLoading("pdf", true);

      // Fetch data untuk karyawan pertama (atau bisa loop untuk multiple)
      await fetchLetterData(selectedKaryawan[0], selectedLetterType);

      // Generate dan buka PDF preview
      if (!LetterComponent) {
        return;
      }

      const blob = await generatePDFBlob();
      const blobURL = URL.createObjectURL(blob);

      // Buka di tab baru
      window.open(blobURL, "_blank");
    } catch (err) {
      console.error(err);
      alert("Gagal membuat preview PDF");
    } finally {
      handleLoading("pdf", false);
    }
  };

  const handleExportPDF = async () => {
    try {
      handleLoading("pdf", true);
      if (!LetterComponent || !selectedKaryawan.length || !selectedLetterType) {
        alert("Pilih karyawan dan jenis surat terlebih dahulu");
        return;
      }

      const zip = new JSZip();

      for (const karyawanId of selectedKaryawan) {
        await fetchLetterData(karyawanId, selectedLetterType);
        const blob = await generatePDFBlob();
        zip.file(`${title}_${karyawanId}.pdf`, blob);
      }

      zip.generateAsync({ type: "blob" }).then((zipBlob) => {
        saveAs(zipBlob, `${title}.zip`);
      });

      setSelectedKaryawan([]);
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading("pdf", false);
    }
  };

  const handlePrint = async () => {
    try {
      handleLoading("print", true);
      if (!LetterComponent || !selectedKaryawan.length || !selectedLetterType) {
        alert("Pilih karyawan dan jenis surat terlebih dahulu");
        return;
      }

      // Fetch data dan generate PDF untuk semua karyawan terpilih
      const pdfPromises = selectedKaryawan.map(async (karyawanId) => {
        await fetchLetterData(karyawanId, selectedLetterType);
        return <LetterComponent key={karyawanId} data={letterData} />;
      });

      const letterComponents = await Promise.all(pdfPromises);

      const blob = await pdf(<Document>{letterComponents}</Document>).toBlob();

      const blobURL = URL.createObjectURL(blob);

      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      iframe.src = blobURL;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.print();
      };

      setSelectedKaryawan([]);
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading("print", false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <p className="font-Poppins font-medium">{title}</p>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-5">
              <div className="w-full">
                <Select
                  {...PROPFORM}
                  label="Jenis Surat"
                  placeholder="Pilih jenis surat yang akan dicetak"
                  selectedKeys={selectedLetterType ? [selectedLetterType] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setSelectedLetterType(selected);
                  }}
                  className="w-full"
                  labelPlacement="outside"
                  classNames={{
                    trigger: "h-12",
                  }}
                >
                  {LETTER_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      className="font-Poppins text-primary"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* SECTION 2: Form Fields (jika ada) & Employee List */}
              <div className="flex flex-row gap-10">
                {hasForm && (
                  <div className="basis-1/3 shrink-0">
                    <Form className="flex flex-col gap-5 overflow-y-auto scrollbar-hide">
                      {formFields.map((item) => (
                        <FormRender key={item.properties} item={item} />
                      ))}
                    </Form>
                  </div>
                )}

                <div
                  className={`flex flex-col ${
                    hasForm ? "basis-2/3" : "basis-full"
                  } gap-5 overflow-y-auto scrollbar-hide`}
                >
                  {/* Search Karyawan */}
                  <div className="flex gap-2">
                    <Input
                      {...PROPFORM}
                      className="w-full"
                      type="search"
                      placeholder="Cari Karyawan"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        if (e.target.value.trim()) {
                          refetchSearch();
                        }
                      }}
                    />
                    <Button
                      isIconOnly
                      className={`${isTable ? "bg-primary text-white" : "bg-gray-200"}`}
                      onClick={() => setIsTable(!isTable)}
                    >
                      <i className="fi fi-rr-list" />
                    </Button>
                  </div>

                  {/* Loading Spinner */}
                  {(isFetchingNextPage || isFetchingSearch) && (
                    <div className="flex justify-center">
                      <Spinner />
                    </div>
                  )}

                  {/* Employee List */}
                  <Employees
                    dataEmployee={search ? searchEmployee : data}
                    isTable={isTable}
                    onClickData={(item) =>
                      handleSelectKaryawan(item.id_karyawan)
                    }
                    selectedKaryawan={selectedKaryawan}
                    onLoadMore={fetchNextPage}
                    hasNextPage={hasNextPage}
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onOpenChange(false);
                  setSelectedKaryawan([]);
                  setSelectedLetterType("");
                  setLetterData(null);
                }}
              >
                Close
              </Button>
              <Button
                color="primary"
                variant="bordered"
                onPress={handlePreviewPDF}
                isLoading={isLoading.pdf}
                isDisabled={!selectedKaryawan.length || !selectedLetterType}
              >
                Preview PDF
              </Button>
              <Button
                color="primary"
                onPress={handleExportPDF}
                isLoading={isLoading.pdf}
                isDisabled={!selectedKaryawan.length || !selectedLetterType}
              >
                Download PDF
              </Button>
              <Button
                color="success"
                onPress={handlePrint}
                isLoading={isLoading.print}
                isDisabled={!selectedKaryawan.length || !selectedLetterType}
              >
                Print
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
