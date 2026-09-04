import { useAuth } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { useDisclosure } from "@heroui/react";

import { apiClient } from "../../../service/api";
import Loading from "../../../components/common/Loading";
import { useMaster } from "../../../hooks/useMaster";
import { DETAILENDPOINT } from "../../../constants/api";
import Modals from "../components/modals";
import { PROPERTIES } from "../constant";

const MAX_CONTRACT_ROWS = 5;
const FALLBACK_CONTRACT = {
  kontrak: "-",
  tanggal_mulai: "-",
  tanggal_berakhir: "-",
};

const EMPTY_FORM_ROW = {
  id: null,
  ukk_id: null,
  kontrak: "",
  tanggal_mulai: "",
  tanggal_berakhir: "",
};

const pickFirst = (obj, keys) => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return undefined;
};

const toDateInput = (value) => {
  if (!value) return "";

  const raw = String(value).trim();
  if (!raw || raw === "-") return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeDate = (value) => {
  if (!value) return "-";

  const raw = String(value).trim();
  if (!raw || raw === "-") return "-";

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  return parsed
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .replace(",", "");
};

const normalizeRow = (item) => {
  const kontrak =
    pickFirst(item, [
      "kontrak",
      "nama_kontrak",
      "kode_kontrak",
      "file_kontrak",
      "status_kontrak",
      "jenis_kontrak",
    ]) ?? "-";

  const tanggalMulai = normalizeDate(
    pickFirst(item, ["tanggal_mulai", "tgl_mulai", "mulai", "start_date"]),
  );
  const tanggalBerakhir = normalizeDate(
    pickFirst(item, ["tanggal_berakhir", "tgl_berakhir", "akhir", "end_date"]),
  );
  const tanggalMulaiRaw = toDateInput(
    pickFirst(item, ["tanggal_mulai", "tgl_mulai", "mulai", "start_date"]),
  );
  const tanggalBerakhirRaw = toDateInput(
    pickFirst(item, ["tanggal_berakhir", "tgl_berakhir", "akhir", "end_date"]),
  );

  return {
    id: pickFirst(item, ["id", "kontrak_id"]) ?? null,
    ukk_id: pickFirst(item, ["ukk_id"]) ?? null,
    kontrak: String(kontrak || "-"),
    tanggal_mulai: tanggalMulai,
    tanggal_berakhir: tanggalBerakhir,
    tanggal_mulai_raw: tanggalMulaiRaw,
    tanggal_berakhir_raw: tanggalBerakhirRaw,
  };
};

const extractSlotRows = (obj) => {
  if (!obj || typeof obj !== "object") return [];

  const rows = [];

  for (let i = 1; i <= MAX_CONTRACT_ROWS; i += 1) {
    const kontrak = pickFirst(obj, [
      `kontrak${i}`,
      `kontrak_${i}`,
      `nama_kontrak${i}`,
      `nama_kontrak_${i}`,
      `kode_kontrak${i}`,
      `kode_kontrak_${i}`,
      `file_kontrak${i}`,
      `file_kontrak_${i}`,
    ]);

    const tanggalMulai = pickFirst(obj, [
      `tanggal_mulai${i}`,
      `tanggal_mulai_${i}`,
      `tgl_mulai${i}`,
      `tgl_mulai_${i}`,
      `mulai${i}`,
      `mulai_${i}`,
    ]);

    const tanggalBerakhir = pickFirst(obj, [
      `tanggal_berakhir${i}`,
      `tanggal_berakhir_${i}`,
      `tgl_berakhir${i}`,
      `tgl_berakhir_${i}`,
      `akhir${i}`,
      `akhir_${i}`,
    ]);

    if (kontrak || tanggalMulai || tanggalBerakhir) {
      rows.push(
        normalizeRow({
          kontrak,
          tanggal_mulai: tanggalMulai,
          tanggal_berakhir: tanggalBerakhir,
        }),
      );
    }
  }

  return rows;
};

const extractContractRows = (payload) => {
  const root = payload?.data ?? payload;
  if (!root) return [];

  if (Array.isArray(root)) {
    return root.map(normalizeRow);
  }

  const slotRows = extractSlotRows(root);
  if (slotRows.length > 0) return slotRows;

  const nestedRows = [];

  if (Array.isArray(root?.kontrak)) {
    nestedRows.push(...root.kontrak.map(normalizeRow));
  }

  const unitKerjaLists = [
    root?.unitkerja_karyawan,
    root?.unit_kerja_karyawan,
    root?.unit_kerja,
  ].filter(Array.isArray);

  unitKerjaLists.forEach((unitKerjaList) => {
    unitKerjaList.forEach((unit) => {
      if (Array.isArray(unit?.kontrak)) {
        nestedRows.push(...unit.kontrak.map(normalizeRow));
      } else if (unit?.kontrak && typeof unit.kontrak === "object") {
        nestedRows.push(normalizeRow(unit.kontrak));
      }
    });
  });

  if (nestedRows.length > 0) return nestedRows;

  if (Array.isArray(root?.unit_kerja) && root.unit_kerja.length > 0) {
    const fallbackRows = root.unit_kerja
      .map((item) =>
        normalizeRow({
          id: item?.id ?? null,
          ukk_id: item?.id ?? null,
          kontrak: item?.lokasi_kerja?.name ?? "-",
          tanggal_mulai: root?.tgl_join_penabur_jkt ?? null,
          tanggal_berakhir: root?.tanggal_inactive ?? null,
        }),
      )
      .filter(
        (row) =>
          row.kontrak !== "-" ||
          row.tanggal_mulai !== "-" ||
          row.tanggal_berakhir !== "-",
      );

    if (fallbackRows.length > 0) return fallbackRows;
  }

  return [normalizeRow(root)];
};

const buildEditableRows = (rows) => {
  const mapped = (Array.isArray(rows) ? rows : []).map((row) => ({
    id: row?.id ?? null,
    ukk_id: row?.ukk_id ?? null,
    kontrak: row?.kontrak && row.kontrak !== "-" ? row.kontrak : "",
    tanggal_mulai: row?.tanggal_mulai_raw ?? "",
    tanggal_berakhir: row?.tanggal_berakhir_raw ?? "",
  }));

  while (mapped.length < MAX_CONTRACT_ROWS) {
    mapped.push({ ...EMPTY_FORM_ROW });
  }

  return mapped.slice(0, MAX_CONTRACT_ROWS);
};

export default function Contract() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);
  const queryClient = useQueryClient();
  const { state } = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEdit, setSelectedEdit] = useState(0);

  const { data: kontrak, isFetching: kontrakFetching } = useMaster(
    api,
    [`kontrak-${state.id}`],
    DETAILENDPOINT.get.contract(state.id),
  );

  const { data: ukkList = [] } = useMaster(
    api,
    [`kontrak-ukk-${state.id}`],
    DETAILENDPOINT.get.location(state.id),
    {
      select: (res) => {
        const payload = res?.data ?? res;
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.unit_kerja)
            ? payload.unit_kerja
            : Array.isArray(payload?.unit_kerja_karyawan)
              ? payload.unit_kerja_karyawan
              : Array.isArray(payload?.unitkerja_karyawan)
                ? payload.unitkerja_karyawan
                : [];

        return rows
          .map((item) => item?.id ?? item?.ukk_id ?? null)
          .filter(Boolean);
      },
    },
  );

  const contractRows = useMemo(() => extractContractRows(kontrak), [kontrak]);
  const primaryUkkId = useMemo(() => ukkList[0] ?? null, [ukkList]);
  const editableRows = useMemo(
    () => buildEditableRows(contractRows),
    [contractRows],
  );

  const hasKontrak = editableRows.some((item) => {
    return item.kontrak || item.tanggal_mulai || item.tanggal_berakhir;
  });

  const displayedRows = useMemo(() => {
    const rows = editableRows.map((row) => ({
      ...row,
      kontrak: row.kontrak || "-",
      tanggal_mulai: normalizeDate(row.tanggal_mulai),
      tanggal_berakhir: normalizeDate(row.tanggal_berakhir),
    }));

    while (rows.length < MAX_CONTRACT_ROWS) {
      rows.push({
        ...FALLBACK_CONTRACT,
        ...EMPTY_FORM_ROW,
      });
    }

    return rows.slice(0, MAX_CONTRACT_ROWS);
  }, [editableRows]);

  const selectedRow = editableRows[selectedEdit] || EMPTY_FORM_ROW;
  const modalData = useMemo(
    () =>
      PROPERTIES.kontrak.map((field) => ({
        ...field,
        value: selectedRow[field.properties] ?? "",
      })),
    [selectedRow],
  );

  const onUpdate = async (value, onClose) => {
    const merged = {
      ...selectedRow,
      ...value,
    };

    if (!merged.kontrak || !merged.tanggal_mulai || !merged.tanggal_berakhir) {
      addToast({
        title: "Data belum lengkap",
        description:
          "Kontrak, Tanggal Mulai, dan Tanggal Berakhir wajib diisi.",
        color: "danger",
      });
      return;
    }

    const resolvedUkkId = merged.ukk_id || primaryUkkId;
    if (!resolvedUkkId && !merged.id) {
      addToast({
        title: "Gagal menyimpan",
        description:
          "Unit kerja karyawan belum ditemukan. Lengkapi data Lokasi Kerja terlebih dahulu.",
        color: "danger",
      });
      return;
    }

    const payload = {
      ukk_id: resolvedUkkId,
      file_kontrak: merged.kontrak,
      tanggal_mulai: merged.tanggal_mulai,
      tanggal_berakhir: merged.tanggal_berakhir,
    };

    try {
      if (merged.id) {
        await api.put(DETAILENDPOINT.update.contract(merged.id), payload);
      } else {
        await api.post(DETAILENDPOINT.create.contract(), payload);
      }

      await queryClient.invalidateQueries({
        queryKey: [`kontrak-${state.id}`],
      });

      addToast({
        title: "Berhasil",
        description: "Data kontrak berhasil disimpan.",
        color: "success",
      });
      onClose?.();
    } catch (err) {
      addToast({
        title: "Gagal menyimpan",
        description:
          err?.message || "Terjadi kesalahan saat menyimpan kontrak.",
        color: "danger",
      });
    }
  };

  if (kontrakFetching) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-5">
      {!hasKontrak ? (
        <div className="flex justify-center items-center flex-1 flex-col gap-10">
          <p className="font-Poppins">Tidak ada data kontrak</p>

          <button
            type="button"
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedEdit(0);
              onOpen();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="#344561"
                d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
              />
            </svg>

            <p className="font-Poppins font-semibold text-primary">
              Tambah Data Kontrak
            </p>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSelectedEdit(0);
                onOpen();
              }}
              aria-label="Edit kontrak"
              className="opacity-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#344561"
                  d="M5 19h1.425l9.275-9.275l-1.4-1.4L5 17.575zm-2 2v-4.25L15.7 4.075q.3-.275.675-.425T17.125 3t.738.15t.662.45l1.275 1.275q.3.3.45.675t.15.75t-.15.738t-.45.662L7.25 21zM18.4 6.35l-1.4-1.4z"
                />
              </svg>
            </button>
          </div>

          {displayedRows.map((row, index) => (
            <button
              type="button"
              key={`kontrak-${index}`}
              className="grid grid-cols-3 gap-8 text-left"
              onClick={() => {
                setSelectedEdit(index);
                onOpen();
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="font-Poppins font-semibold opacity-40 text-2sm">
                  Lokasi Kerja {index + 1}
                </p>
                <p className="font-Poppins font-semibold text-primary text-lg">
                  {row.kontrak}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="font-Poppins font-semibold opacity-40 text-2sm">
                  Tanggal Join PENABUR Jakarta
                </p>
                <p className="font-Poppins font-semibold text-primary text-lg">
                  {row.tanggal_mulai}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="font-Poppins font-semibold opacity-40 text-2sm">
                  Tanggal Inactive
                </p>
                <p className="font-Poppins font-semibold text-primary text-lg">
                  {row.tanggal_berakhir}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modals
        data={modalData}
        title={`${selectedRow?.id ? "Edit" : "Tambah"} Kontrak Kerja`}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdate={onUpdate}
        allowSubmitWithoutChange={!selectedRow?.id}
      />
    </div>
  );
}
