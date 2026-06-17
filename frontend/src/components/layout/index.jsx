import { useLocation } from "react-router-dom";

import { Navbar } from "./navbar";
import { SideBar } from "./sidebar";

export default function Layout({ children }) {
  let { pathname } = useLocation();

  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-x-hidden">
      <div
        className={`flex flex-1 ${pathname !== "/detailEmployee" ? "pb-20 lg:pb-0" : ""}`}
      >
        {pathname !== "/detailEmployee" && <SideBar />}

        <Navbar>{children}</Navbar>
      </div>

      <footer
        className={`flex w-full flex-col items-center justify-between gap-1 bg-primary px-4 py-2 sm:flex-row ${
          pathname !== "/detailEmployee" ? "lg:pl-72" : ""
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
