import { Modal, Tooltip, useDisclosure } from "@heroui/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const dataTable = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        no: index + 1,
        __isSelected: selected.includes(String(item.id_karyawan ?? "")),
      })),
    [data, selected],
  );

  if (isTable)
    return (
      <div className="w-full min-w-0">
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
    <div className={`grid grid-cols-${gridCols} gap-5`}>
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
            className={`flex flex-col justify-between items-center p-5 shadow-md rounded-lg gap-3 ${
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
            <div className="flex justify-center">
              <img
                src="/assets/images/profile.jpg"
                alt="logo"
                className="h-full aspect-square rounded-md"
              />
            </div>

            <Tooltip
              content={item.nama_lengkap}
              showArrow={true}
              className="font-Poppins text-xs"
              isDismissable={true}
            >
              <p className="font-Poppins font-[600] text-center text-primary truncate w-full">
                {item.nama_lengkap}
              </p>
            </Tooltip>

            <div className="w-2/3 bg-red rounded-full flex items-center justify-center h-8">
              <p className="font-Poppins font-[600] text-white">
                {item.status_karyawan}
              </p>
            </div>

            <p className="font-Poppins font-[500] truncate w-full text-center">
              {item.jabatan}
            </p>

            <p className="font-Poppins font-[500]">{item.nik}</p>

            {!isSelect && (
              <button
                className="flex items-center bg-primary px-5 rounded-full py-2 gap-2 z-10"
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
