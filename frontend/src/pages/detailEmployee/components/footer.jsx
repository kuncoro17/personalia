import { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import PrintLetterModalSingle from "./modalsPrintLetter";
import { getAvailableLetters } from "../../../constants/letterConfig";

export default function Footer({ employeeId, employeeName, employeeStatus }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedLetterType, setSelectedLetterType] = useState("");
  const [availableLetters, setAvailableLetters] = useState([]);

  useEffect(() => {
    const letters = getAvailableLetters(employeeStatus);
    setAvailableLetters(letters);
  }, [employeeStatus]);

  const handleSelectSurat = (letterType) => {
    console.log("🔍 Employee ID dari props:", employeeId);
    setSelectedLetterType(letterType);
    onOpen();
  };

  return (
    <>
      <div className="bg-primary rounded-lg h-40 flex relative w-full">
        <div className="flex flex-col flex-1 justify-center gap-3 pl-14">
          <p className="font-Poppins text-white text-4xl font-bold">
            Pilih surat yang mau dicetak
          </p>

          <select
            className="flex items-center bg-white rounded-md w-3/5 h-9 pl-2 font-Poppins text-primary text-sm font-medium cursor-pointer"
            onChange={(e) => {
              if (e.target.value) {
                handleSelectSurat(e.target.value);
              }
            }}
            value={selectedLetterType || ""}
          >
            <option value="" disabled>
              Pilih Jenis Surat {employeeStatus ? `(${employeeStatus})` : ""}
            </option>
            {availableLetters.map((letter) => (
              <option key={letter.value} value={letter.value}>
                {letter.title}
              </option>
            ))}
          </select>

          {/* Info jika tidak ada surat yang tersedia */}
          {availableLetters.length === 0 && employeeStatus && (
            <p className="font-Poppins text-white text-xs italic">
              Tidak ada surat yang tersedia untuk status: {employeeStatus}
            </p>
          )}

          {/* Info jika employee status tidak ada */}
          {!employeeStatus && (
            <p className="font-Poppins text-white text-xs italic">
              Status karyawan tidak tersedia
            </p>
          )}
        </div>

        <div className="absolute overflow-hidden rounded-lg bottom-0 right-0">
          <img
            src="/assets/images/printMail.png"
            className="object-contain relative top-1 left-1"
            alt="Print Mail"
          />
        </div>
      </div>

      {/* Modal Print Letter */}
      <PrintLetterModalSingle
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        employeeId={employeeId}
        employeeName={employeeName}
        employeeStatus={employeeStatus}
        selectedLetterType={selectedLetterType}
      />
    </>
  );
}
