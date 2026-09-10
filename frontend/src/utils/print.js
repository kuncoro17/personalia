// PrintButton.tsx
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import CardPrintDocument from "./CardPrintDocument";

export default function PrintCardButton({ item }) {
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Kartu-${item.nik}`,
    preserveAfterPrint: true, // biarkan tetap di DOM setelah selesai print
    // onBeforePrint: () => document.body.classList.add('printing'),
    // onAfterPrint: () => document.body.classList.remove('printing'),
  });

  return (
    <>
      <div ref={contentRef} aria-hidden className="hidden print:block">
        <CardPrintDocument item={item} />
      </div>

      <button
        className="px-3 py-2 rounded bg-primary text-white shadow"
        onClick={handlePrint}
      >
        Cetak Kartu
      </button>
    </>
  );
}
