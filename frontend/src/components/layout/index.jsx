import { useLocation } from "react-router-dom";

import { Navbar } from "./navbar";
import { SideBar } from "./sidebar";

export default function Layout({ children }) {
  let { pathname } = useLocation();

  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-x-hidden">
      <div className="flex flex-1">
        {pathname !== "/detailEmployee" && <SideBar />}

        <Navbar>{children}</Navbar>
      </div>

      <footer className="w-full flex items-center justify-between px-4 bg-primary">
        <p className="font-Poppins text-white text-xs">
          © 2024 BPK PENABUR Jakarta
        </p>
        <p className="font-Poppins text-white text-xs">Developed by SIM</p>
      </footer>
    </div>
  );
}
