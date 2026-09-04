import { useState } from "react";

import Footer from "../components/footer";
import { HEADER } from "../constant";

export default function Detail({ employeeData }) {
  const [selectedHeader, setSelectedHeader] = useState(0);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col">
        <div className="h-14 flex gap-2 overflow-x-hidden scrollbar-hide w-full">
          {HEADER.map((item, index) => (
            <button
              className="flex flex-1 h-full justify-center items-center"
              key={item.title}
              onClick={() => setSelectedHeader(index)}
              disabled={item.disable}
            >
              <p
                className={`font-Poppins ${item.disable ? "line-through opacity-20" : ""} ${selectedHeader === index ? "font-semibold text-primary" : "font-normal opacity-40 text-sm"}`}
              >
                {item.title}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-1 bg-white rounded-lg shadow-lg border-1 border-[#00000010] p-4">
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
