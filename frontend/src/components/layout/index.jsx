import { useLocation } from "react-router-dom";

import { Navbar } from "./navbar";
import { SideBar } from "./sidebar";

export default function Layout({ children }) {
  let { pathname } = useLocation();
  const isEmployeeDetail = pathname.startsWith("/detailEmployee/");

  return (
    <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div
        className={`flex flex-1 ${!isEmployeeDetail ? "pb-20 lg:pb-0" : ""}`}
      >
        {!isEmployeeDetail && <SideBar />}

        <Navbar>{children}</Navbar>
      </div>

      <footer
        className={`flex w-full flex-col items-center justify-between gap-1 bg-primary px-4 py-2 dark:bg-slate-900 sm:flex-row ${
          !isEmployeeDetail ? "lg:pl-72" : ""
        }`}
      >
        <p className="font-Poppins text-white text-xs">
          © 2024 BPK PENABUR Jakarta
        </p>
        <p className="font-Poppins text-white text-xs">Developed by SIM</p>
      </footer>
    </div>
  );
}
