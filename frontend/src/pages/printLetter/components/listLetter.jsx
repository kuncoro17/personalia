import { Card, CardBody, useDisclosure } from "@heroui/react";
import { useState } from "react";
import Modals from "./modals";

export default function ListLetter({ data, isTable, setIsTable }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedSurat, setSelectedSurat] = useState(null);

  const handleSelectSurat = (surat) => {
    setSelectedSurat(surat);
    onOpen();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.map((item, index) => (
          <Card
            key={item.key || index}
            isPressable
            onPress={() => handleSelectSurat(item)}
            className="personalia-card cursor-pointer transition-transform"
          >
            <CardBody className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>

                {/* Badge untuk status endpoint */}
                {item.hasEndpoint ? (
                  <span className="ml-2 whitespace-nowrap rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                    API Siap
                  </span>
                ) : (
                  <span className="ml-2 whitespace-nowrap rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                    Segera Hadir
                  </span>
                )}
              </div>

              {/* Info allowed status */}
              {item.allowedStatus && item.allowedStatus.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.allowedStatus.includes("ALL") ? (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                      Semua Status
                    </span>
                  ) : (
                    item.allowedStatus.slice(0, 3).map((status, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200"
                      >
                        {status}
                      </span>
                    ))
                  )}
                  {item.allowedStatus.length > 3 &&
                    !item.allowedStatus.includes("ALL") && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                        +{item.allowedStatus.length - 3}
                      </span>
                    )}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Modal cetak surat */}
      <Modals
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedSurat={selectedSurat}
      />
    </>
  );
}
