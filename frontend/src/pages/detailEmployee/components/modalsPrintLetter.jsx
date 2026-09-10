import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Document, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useAuth } from "@clerk/clerk-react";

import { apiService } from "../../../service/api";
import { apiClient } from "../../../service/api";
import {
  getLetterComponent,
  getLetterLabel,
  getLetterEndpoint,
  isValidLetterKey,
  hasLetterEndpoint,
} from "../../../constants/letterConfig";

export default function PrintLetterModalSingle({
  isOpen,
  onOpenChange,
  employeeId,
  employeeName,
  selectedLetterType,
}) {
  const { getToken } = useAuth();
  const api = apiClient(getToken);

  const [letterData, setLetterData] = useState(null);
  const [isLoading, setIsLoading] = useState({
    fetch: false,
    pdf: false,
    print: false,
  });

  const title = getLetterLabel(selectedLetterType);
  const LetterComponent = getLetterComponent(selectedLetterType);

  useEffect(() => {
    setLetterData(null);

    console.log("🔍 Modal opened with:", {
      isOpen,
      selectedLetterType,
      employeeId,
      employeeName,
    });

    if (isOpen && selectedLetterType && employeeId) {
      if (!isValidLetterKey(selectedLetterType)) {
        console.error("❌ Invalid letter key:", selectedLetterType);
        alert("Jenis surat tidak valid");
        return;
      }

      if (!hasLetterEndpoint(selectedLetterType)) {
        console.error("❌ No endpoint for:", selectedLetterType);
        alert("API endpoint untuk surat ini belum tersedia");
        return;
      }

      console.log("✅ Validation passed, fetching data...");
      fetchLetterData();
    }
  }, [isOpen, selectedLetterType, employeeId]);

  const handleLoading = (key, value) => {
    setIsLoading((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch letter data from API
  const fetchLetterData = async () => {
    if (!employeeId || !selectedLetterType) return;

    try {
      handleLoading("fetch", true);

      const endpoint = getLetterEndpoint(selectedLetterType, employeeId);

      console.log("📡 Fetching from endpoint:", endpoint);

      if (!endpoint) {
        console.error("❌ Endpoint is null!");
        alert("Endpoint untuk jenis surat ini tidak ditemukan");
        return;
      }

      const response = await apiService("get", api, endpoint);

      console.log("📦 API Response:", response);

      if (response?.data) {
        const payload = response.data?.data ?? response.data;

        console.log("🧩 PAYLOAD TO PDF:", payload); // DEBUG PENTING

        setLetterData(payload);
        return payload;
      } else {
        console.warn("⚠️ No data in response:", response);
      }
    } catch (error) {
      console.error("❌ Error fetching letter data:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
      });

      // Handle different error types
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        console.error(`API Error ${status}:`, message);

        if (status === 404) {
          alert(
            `Data surat tidak ditemukan. Pastikan karyawan memiliki status yang sesuai.`,
          );
        } else if (status === 403) {
          alert(
            `Akses ditolak. Anda tidak memiliki izin untuk mengakses data ini.`,
          );
        } else {
          alert(`Gagal mengambil data surat: ${message}`);
        }
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
        );
      } else {
        alert(`Terjadi kesalahan: ${error.message}`);
      }
    } finally {
      handleLoading("fetch", false);
    }
  };

  // Generate PDF blob
  const generatePDFBlob = async (data) => {
    if (!LetterComponent) {
      throw new Error("Komponen surat tidak ditemukan");
    }

    return await pdf(
      <Document>
        <LetterComponent data={data} />
      </Document>,
    ).toBlob();
  };

  // Unduh PDF
  const handleDownload = async () => {
    if (!letterData) {
      alert("Data surat belum tersedia");
      return;
    }

    try {
      handleLoading("pdf", true);

      // ✅ pastikan payload ada (pakai state kalau sudah ada, kalau belum fetch lagi)
      const payload = letterData ?? (await fetchLetterData());
      if (!payload) {
        alert("Data surat belum tersedia");
        return;
      }

      // ✅ generate PDF dengan payload yang pasti valid
      const blob = await generatePDFBlob(payload);
      const fileName = `${title}_${employeeName || "karyawan"}_${Date.now()}.pdf`;
      saveAs(blob, fileName);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Gagal download PDF");
    } finally {
      handleLoading("pdf", false);
    }
  };

  // Cetak PDF
  const handlePrint = async () => {
    if (!letterData) {
      alert("Data surat belum tersedia");
      return;
    }

    try {
      handleLoading("print", true);

      const payload = letterData ?? (await fetchLetterData());
      const blob = await generatePDFBlob(payload);
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

        // Cleanup iframe after print
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobURL);
        }, 1000);
      };
    } catch (err) {
      console.error("Error printing PDF:", err);
      alert("Gagal print PDF");
    } finally {
      handleLoading("print", false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setLetterData(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="border-b border-slate-200 dark:border-slate-800">
              <p className="text-base font-semibold text-slate-950 dark:text-slate-100">
                {title}
              </p>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-5 py-6">
              {/* Info Karyawan */}
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Karyawan:
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-100">
                  {employeeName || "Nama tidak tersedia"}
                </p>
              </div>

              {/* Loading State */}
              {isLoading.fetch && (
                <div className="flex items-center justify-center py-10">
                  <Spinner size="lg" color="primary" />
                  <p className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    Memuat data surat...
                  </p>
                </div>
              )}

              {/* Preview or Message */}
              {!isLoading.fetch && !letterData && (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Data surat tidak tersedia
                  </p>
                </div>
              )}

              {!isLoading.fetch && letterData && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Data surat berhasil dimuat
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Siap untuk di-download atau print
                  </p>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="border-t border-slate-200 dark:border-slate-800">
              <Button
                className="personalia-action-button personalia-action-button-light"
                color="danger"
                variant="light"
                onPress={handleClose}
              >
                Tutup
              </Button>
              <Button
                className="personalia-action-button personalia-action-button-light"
                color="primary"
                variant="flat"
                onPress={handleDownload}
                isDisabled={!letterData || isLoading.pdf || isLoading.print}
                isLoading={isLoading.pdf}
              >
                Unduh PDF
              </Button>
              <Button
                className="personalia-action-button personalia-action-button-primary"
                color="primary"
                onPress={handlePrint}
                isDisabled={!letterData || isLoading.pdf || isLoading.print}
                isLoading={isLoading.print}
              >
                Cetak
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
