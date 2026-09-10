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
      <div className="personalia-hero-card relative flex min-h-28 w-full overflow-hidden p-4 sm:p-5">
        <div className="z-10 flex flex-1 flex-col justify-center gap-3">
          <p className="text-lg font-semibold text-white sm:text-xl">
            Pilih surat yang mau dicetak
          </p>

          <select
            className="h-10 w-full max-w-xl cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900"
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
            <p className="text-xs italic leading-5 text-white/80">
              Tidak ada surat yang tersedia untuk status: {employeeStatus}
            </p>
          )}

          {/* Info jika employee status tidak ada */}
          {!employeeStatus && (
            <p className="text-xs italic leading-5 text-white/80">
              Status karyawan tidak tersedia
            </p>
          )}
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
