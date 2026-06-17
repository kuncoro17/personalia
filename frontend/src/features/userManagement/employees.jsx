import { Modal, Tooltip, useDisclosure } from "@heroui/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { resolveApiAssetUrl } from "../../service/api";
import { TableViewer } from "./components/tableViewer";
import { CardViewer } from "./components/cardViewer";
import {
  EMPLOYEEHEADER,
  EMPLOYEESELECTHEADER,
} from "../../constants/headerTable/employee";

export default function Employees({
  isTable,
  data,
  onSelect,
  selected = [],
  isSelect = false,
  gridCols = 5,
}) {
  const navigate = useNavigate();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedPrint, setSelectedPrint] = useState(null);

  const getEmployeeImageSrc = (item) => {
    if (item?.foto) {
      return resolveApiAssetUrl(item.foto);
    }

    return "/image/1.svg";
  };

  const dataTable = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        no: index + 1,
        __isSelected: selected.includes(String(item.id_karyawan ?? "")),
      })),
    [data, selected],
  );

  const gridClassByCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  };
  const gridClass = gridClassByCols[gridCols] ?? gridClassByCols[5];

  if (isTable)
    return (
      <div className="w-full min-w-0 overflow-x-auto rounded-2xl border border-[#00000010] bg-white p-2 shadow-sm">
        <TableViewer
          dataTable={dataTable}
          isSelect={isSelect}
          selected={selected}
          onSelect={onSelect}
          header={isSelect ? EMPLOYEESELECTHEADER : EMPLOYEEHEADER}
        />
      </div>
    );

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {data.map((item) => {
        const handleActivate = () =>
          isSelect
            ? onSelect(String(item.id_karyawan))
            : navigate("/detailEmployee", {
                state: { id: item.id_karyawan, title: "Detail Karyawan" },
              });

        return (
          <div
            key={item.id_karyawan}
            role="button"
            tabIndex={0}
            className={`group flex min-w-0 flex-col items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
              isSelect && selected.includes(String(item.id_karyawan))
                ? "border-primary border-2"
                : "border-[#00000010] border-1"
            }`}
            onClick={handleActivate}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleActivate();
              }
            }}
          >
            <div className="flex h-24 w-24 justify-center rounded-2xl bg-[#F5F7FA] p-1">
              <img
                src={getEmployeeImageSrc(item)}
                alt={item.nama_lengkap || "Foto karyawan"}
                className="h-full w-full rounded-xl object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/image/1.svg";
                }}
              />
            </div>

            <Tooltip
              content={item.nama_lengkap}
              showArrow={true}
              className="font-Poppins text-xs"
              isDismissable={true}
            >
              <p className="w-full truncate text-center font-Poppins font-[600] text-primary">
                {item.nama_lengkap}
              </p>
            </Tooltip>

            <div className="flex h-8 max-w-full items-center justify-center rounded-full bg-red px-4">
              <p className="truncate font-Poppins text-sm font-[600] text-white">
                {item.status_karyawan}
              </p>
            </div>

            <p className="w-full truncate text-center font-Poppins text-sm font-[500] text-[#0B345E]/80">
              {item.jabatan}
            </p>

            <p className="font-Poppins text-sm font-[500] text-[#0B345E]/60">
              {item.nik}
            </p>

            {!isSelect && (
              <button
                className="z-10 flex items-center gap-2 rounded-full bg-primary px-5 py-2 transition group-hover:bg-[#092c4f]"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedPrint(item);
                  onOpen();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ffffff70"
                    d="M17 7.846H7v-3.23h10zm.616 4.27q.425 0 .712-.288t.288-.712t-.288-.713t-.712-.288t-.713.288t-.287.713t.287.712t.713.288M16 19v-4.538H8V19zm1 1H7v-4H3.577v-5.384q0-.85.577-1.425t1.423-.576h12.846q.85 0 1.425.576t.575 1.424V16H17z"
                  />
                </svg>

                <p className="font-Poppins text-xs text-white">Cetak Kartu</p>
              </button>
            )}
          </div>
        );
      })}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        backdrop="blur"
        scrollBehavior="inside"
      >
        <CardViewer item={selectedPrint} />
      </Modal>
    </div>
  );
}
