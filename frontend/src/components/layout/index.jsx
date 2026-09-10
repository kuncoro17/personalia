import { useState } from "react";

import { Navbar } from "./navbar";
import { SideBar } from "./sidebar";

export default function Layout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="personalia-app min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="min-h-screen">
        <SideBar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {isMobileSidebarOpen ? (
          <button
            type="button"
            aria-label="Tutup sidebar"
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        ) : null}

        <Navbar onOpenSidebar={() => setIsMobileSidebarOpen(true)}>
          {children}
        </Navbar>
      </div>
    </div>
  );
}
