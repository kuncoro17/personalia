import { useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import Layout from "../../components/layout";
import { Button } from "../../components/ui";
import { apiClient } from "../../service/api";
import MasterProvinsiSection from "./components/MasterProvinsiSection";
import MasterKotaSection from "./components/MasterKotaSection";
import MasterKecamatanSection from "./components/MasterKecamatanSection";
import MasterRiwPendidikanSection from "./components/MasterRiwPendidikanSection";
import MasterOrganisasiSection from "./components/MasterOrganisasiSection";
import MasterTipeDokumenSection from "./components/MasterTipeDokumenSection";
import MasterJabatanSection from "./components/MasterJabatanSection";

const TABS = [
  { key: "provinsi", label: "Provinsi" },
  { key: "kota", label: "Kota/Kabupaten" },
  { key: "kecamatan", label: "Kecamatan" },
  { key: "pendidikan", label: "Riwayat Pendidikan" },
  { key: "tipe-dokumen", label: "Tipe Dokumen" },
  { key: "direktur", label: "Direktur" },
  { key: "deputi", label: "Deputi" },
  { key: "divisi", label: "Divisi" },
  { key: "bagian", label: "Bagian" },
  { key: "seksi", label: "Seksi" },
  { key: "jabatan", label: "Jabatan" },
];

const ORGANISASI_CONFIG = {
  direktur: {
    label: "Direktur",
    name: "direktur",
    level: "direktur",
    queryKey: "master-direktur",
    endpoint: "master-direktur",
    idField: "dir_id",
    codeField: "kode",
    nameField: "nama_dir",
    example: "Direktur Pelaksana",
  },
  deputi: {
    label: "Deputi",
    name: "deputi",
    level: "deputi",
    queryKey: "master-deputi",
    endpoint: "master-deputi",
    listEndpoint: "master-deputi/getAllDeputi",
    createEndpoint: "master-deputi/create-deputi",
    updateEndpoint: (id) => `master-deputi/update-deputi/${id}`,
    deleteEndpoint: (id) => `master-deputi/delete-deputi/${id}`,
    idField: "dep_id",
    codeField: "kode",
    nameField: "nama_dep",
    example: "Deputi Operasional",
  },
  divisi: {
    label: "Divisi",
    name: "divisi",
    level: "divisi",
    queryKey: "master-divisi",
    endpoint: "personalia/divisi",
    idField: "div_id",
    codeField: "kode",
    nameField: "nama_div",
    example: "SDM",
  },
  bagian: {
    label: "Bagian",
    name: "bagian",
    level: "bagian",
    queryKey: "master-bagian",
    endpoint: "personalia/bagian",
    idField: "bag_id",
    codeField: "kode",
    nameField: "nama_bag",
    example: "PPKSDM",
  },
  seksi: {
    label: "Seksi",
    name: "seksi",
    level: "seksi",
    queryKey: "master-seksi",
    endpoint: "seksi",
    idField: "sek_id",
    codeField: "kode",
    nameField: "nama_sek",
    example: "Administrasi",
  },
};

export default function MasterWilayahPendidikanPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const api = apiClient(getToken);
  const isReady = isLoaded && isSignedIn;

  const [active, setActive] = useState("provinsi");

  const activeLabel = useMemo(
    () => TABS.find((t) => t.key === active)?.label || "Master",
    [active],
  );

  return (
    <Layout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <section className="flex flex-1 flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Master Wilayah & Pendidikan
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kelola data wilayah, pendidikan, dan struktur organisasi.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={active === tab.key ? "default" : "outline"}
              onPress={() => setActive(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {activeLabel}
          </p>

          {active === "provinsi" && (
            <MasterProvinsiSection api={api} isReady={isReady} />
          )}
          {active === "kota" && (
            <MasterKotaSection api={api} isReady={isReady} />
          )}
          {active === "kecamatan" && (
            <MasterKecamatanSection api={api} isReady={isReady} />
          )}
          {active === "pendidikan" && (
            <MasterRiwPendidikanSection api={api} isReady={isReady} />
          )}
          {active === "tipe-dokumen" && (
            <MasterTipeDokumenSection api={api} isReady={isReady} />
          )}
          {active === "jabatan" && (
            <MasterJabatanSection api={api} isReady={isReady} />
          )}
          {ORGANISASI_CONFIG[active] && (
            <MasterOrganisasiSection
              api={api}
              isReady={isReady}
              config={ORGANISASI_CONFIG[active]}
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
