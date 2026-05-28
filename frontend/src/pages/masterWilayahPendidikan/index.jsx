import { Button } from "@heroui/react";
import { useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import Layout from "../../components/layout";
import { apiClient } from "../../service/api";
import MasterProvinsiSection from "./components/MasterProvinsiSection";
import MasterKotaSection from "./components/MasterKotaSection";
import MasterKecamatanSection from "./components/MasterKecamatanSection";
import MasterRiwPendidikanSection from "./components/MasterRiwPendidikanSection";

const TABS = [
  { key: "provinsi", label: "Provinsi" },
  { key: "kota", label: "Kota/Kabupaten" },
  { key: "kecamatan", label: "Kecamatan" },
  { key: "pendidikan", label: "Riwayat Pendidikan" },
];

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

      <section className="flex flex-col gap-6 flex-1 px-6 pb-5">
        <div className="flex items-center justify-between">
          <p className="font-Poppins text-xl font-semibold text-primary">
            Master Wilayah & Pendidikan
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={active === tab.key ? "solid" : "bordered"}
              color={active === tab.key ? "primary" : "default"}
              onPress={() => setActive(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-Poppins text-base font-semibold text-primary">
            {activeLabel}
          </p>

          {active === "provinsi" && <MasterProvinsiSection api={api} isReady={isReady} />}
          {active === "kota" && <MasterKotaSection api={api} isReady={isReady} />}
          {active === "kecamatan" && (
            <MasterKecamatanSection api={api} isReady={isReady} />
          )}
          {active === "pendidikan" && (
            <MasterRiwPendidikanSection api={api} isReady={isReady} />
          )}
        </div>
      </section>
    </Layout>
  );
}

