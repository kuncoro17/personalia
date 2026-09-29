import { Button, Card, CardBody, Input } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

import Layout from "../../components/layout";
import { LEAVEENDPOINT } from "../../constants/api";
import { apiClient } from "../../service/api";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.payload?.message ||
  error?.message ||
  "Sinkronisasi cuti dan izin gagal dijalankan.";

const getJakartaToday = () => {
  const values = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
};

export default function LeaveSyncPage() {
  const { getToken } = useAuth();
  const api = apiClient(getToken);
  const [isSyncing, setIsSyncing] = useState(false);
  const [startDate, setStartDate] = useState(getJakartaToday);
  const [endDate, setEndDate] = useState(getJakartaToday);

  const handleSync = async () => {
    setIsSyncing(true);

    try {
      const response = await api.post(
        `${LEAVEENDPOINT.sync}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
      );
      const result = response?.data?.data;

      addToast({
        title: "Sinkronisasi selesai",
        description: `${result?.synced ?? 0} data cuti/izin disinkronkan.`,
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Sinkronisasi gagal",
        description: getErrorMessage(error),
        color: "danger",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Layout>
      <section className="flex min-w-0 flex-1 flex-col gap-5">
        <Card className="personalia-card max-w-2xl">
          <CardBody className="gap-4 p-5 sm:p-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Sinkron Cuti &amp; Izin
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Ambil pengajuan cuti dan izin yang telah disetujui dari sistem
                IZI.
              </p>
            </div>
            <Input
              type="date"
              label="Tanggal mulai"
              value={startDate}
              onValueChange={setStartDate}
              description="Data cuti dan izin yang disetujui sejak tanggal ini akan diambil dari IZI."
            />
            <Input
              type="date"
              label="Tanggal akhir"
              value={endDate}
              min={startDate}
              onValueChange={setEndDate}
              description="Data disinkronkan sampai tanggal ini."
            />
            <Button
              color="primary"
              isDisabled={!startDate || !endDate || endDate < startDate}
              isLoading={isSyncing}
              onPress={handleSync}
            >
              Mulai Sinkronisasi
            </Button>
          </CardBody>
        </Card>
      </section>
    </Layout>
  );
}
