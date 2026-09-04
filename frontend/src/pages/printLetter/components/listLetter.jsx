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
            className="hover:scale-105 transition-transform cursor-pointer"
          >
            <CardBody className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between">
                <p className="font-Poppins text-sm font-semibold text-primary line-clamp-2">
                  {item.title}
                </p>

                {/* Badge untuk status endpoint */}
                {item.hasEndpoint ? (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full whitespace-nowrap ml-2">
                    API Ready
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full whitespace-nowrap ml-2">
                    Coming Soon
                  </span>
                )}
              </div>

              {/* Info allowed status */}
              {item.allowedStatus && item.allowedStatus.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.allowedStatus.includes("ALL") ? (
                    <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">
                      Semua Status
                    </span>
                  ) : (
                    item.allowedStatus.slice(0, 3).map((status, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded"
                      >
                        {status}
                      </span>
                    ))
                  )}
                  {item.allowedStatus.length > 3 &&
                    !item.allowedStatus.includes("ALL") && (
                      <span className="px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded">
                        +{item.allowedStatus.length - 3}
                      </span>
                    )}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Modal for printing */}
      <Modals
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        selectedSurat={selectedSurat}
      />
    </>
  );
}
