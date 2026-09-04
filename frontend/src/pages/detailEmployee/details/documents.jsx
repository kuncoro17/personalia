import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";

import { DOCSENDPOINT } from "../../../constants/api";
import { useMaster } from "../../../hooks/useMaster";
import {
  apiClient,
  apiService,
  resolveApiAssetUrl,
} from "../../../service/api";

const getErrorMessage = (error, fallback) =>
  error?.payload?.message ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getFileName = (path) => {
  if (!path) return "Dokumen";
  try {
    return decodeURIComponent(
      String(path).split("/").pop() || "Dokumen",
    ).replace(/^\d+-/, "");
  } catch {
    return String(path).split("/").pop() || "Dokumen";
  }
};

const getDocumentUrl = (path) => {
  if (!path) return "";

  try {
    const parsed = new URL(path);
    if (
      ["localhost", "127.0.0.1"].includes(parsed.hostname) &&
      parsed.port === "3000"
    ) {
      return resolveApiAssetUrl(parsed.pathname);
    }
  } catch {
    // Relative paths are resolved by the shared asset URL helper.
  }

  return resolveApiAssetUrl(path);
};

export default function Documents() {
  const { getToken } = useAuth();
  const { state } = useLocation();
  const queryClient = useQueryClient();
  const api = apiClient(getToken);
  const employeeId = state?.id ?? state?.id_karyawan ?? null;
  const queryKey = [`dokumen-${employeeId}`];

  const {
    data: rowsRaw,
    isFetching,
    error,
  } = useMaster(api, queryKey, DOCSENDPOINT.byEmployee(employeeId), {
    enabled: Boolean(employeeId),
    returnEmptyOnError: false,
  });

  const rows = useMemo(() => {
    const list = Array.isArray(rowsRaw?.data)
      ? rowsRaw.data
      : Array.isArray(rowsRaw)
        ? rowsRaw
        : [];

    return list.map((item) => ({
      id: item.id,
      type: item?.tipe_dokumen?.tipe_dokumen || "LAINNYA",
      fileName: getFileName(item.dokumen_path),
      url: getDocumentUrl(item.dokumen_path),
      createdAt: item.created_at,
    }));
  }, [rowsRaw]);

  useEffect(() => {
    if (!error) return;
    addToast({
      title: "Gagal memuat dokumen",
      description: getErrorMessage(error, "Dokumen karyawan gagal dimuat"),
      color: "danger",
    });
  }, [error]);

  const deleteMutation = useMutation({
    mutationFn: (id) => apiService("delete", api, DOCSENDPOINT.delete(id)),
    onSuccess: async () => {
      addToast({
        title: "Berhasil",
        description: "Dokumen berhasil dihapus",
        color: "success",
      });
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (mutationError) => {
      addToast({
        title: "Gagal menghapus dokumen",
        description: getErrorMessage(mutationError, "Dokumen gagal dihapus"),
        color: "danger",
      });
    },
  });

  if (isFetching) {
    return (
      <div className="flex min-h-40 w-full items-center justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table aria-label="Daftar dokumen karyawan">
        <TableHeader>
          <TableColumn>TIPE DOKUMEN</TableColumn>
          <TableColumn>NAMA FILE</TableColumn>
          <TableColumn>TANGGAL UPLOAD</TableColumn>
          <TableColumn align="center">AKSI</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Belum ada dokumen" items={rows}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-primary dark:text-slate-100">
                {item.type}
              </TableCell>
              <TableCell>{item.fileName}</TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    as="a"
                    href={item.url || undefined}
                    isDisabled={!item.url}
                    rel="noreferrer"
                    size="sm"
                    target="_blank"
                    variant="bordered"
                  >
                    Buka
                  </Button>
                  <Button
                    color="danger"
                    isDisabled={deleteMutation.isPending}
                    size="sm"
                    variant="bordered"
                    onPress={() => deleteMutation.mutate(item.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
