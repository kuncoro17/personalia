import { useState } from "react";

import Footer from "../components/footer";
import { HEADER } from "../constant";

export default function Detail({ employeeData }) {
  const [selectedHeader, setSelectedHeader] = useState(0);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col">
        <div className="flex min-h-14 w-full gap-2 overflow-x-auto scrollbar-hide">
          {HEADER.map((item, index) => (
            <button
              className={`flex min-h-11 shrink-0 items-center justify-center rounded-md border px-3 text-sm transition ${
                selectedHeader === index
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              }`}
              key={item.title}
              onClick={() => setSelectedHeader(index)}
              disabled={item.disable}
            >
              <p
                className={`${item.disable ? "line-through opacity-20" : ""} ${selectedHeader === index ? "font-semibold" : "font-medium"}`}
              >
                {item.title}
              </p>
            </button>
          ))}
        </div>

        <div className="personalia-card mt-3 flex flex-1 p-4">
          {HEADER[selectedHeader].content}
        </div>
      </div>

      {/* Pass employeeData ke Footer */}
      <Footer
        employeeId={employeeData?.id_karyawan}
        employeeName={employeeData?.nama_lengkap}
        employeeStatus={employeeData?.status}
      />
    </div>
  );
}
