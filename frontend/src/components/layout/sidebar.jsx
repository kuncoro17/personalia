import { useLocation, useNavigate } from "react-router-dom";

import { SIDEBARMENU } from "../../constants/routes";

export const SideBar = ({ isOpen = false, onClose }) => {
  let { pathname } = useLocation();
  const navigate = useNavigate();

  const handlePress = (label, title) => {
    if (label !== pathname) {
      navigate(label, { state: { title } });
    }
    onClose?.();
  };

  return (
    <aside
      className={`personalia-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex min-h-[76px] shrink-0 items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <img
          src="/assets/images/logo_penabur.png"
          alt="Logo BPK PENABUR"
          className="h-12 w-12 shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-bold uppercase leading-5 text-slate-950 dark:text-slate-100">
            SDM
          </p>
          <p className="break-words text-sm font-bold uppercase leading-5 text-slate-950 dark:text-slate-100">
            Personalia
          </p>
          <p className="mt-1 whitespace-nowrap text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
            Dashboard Personalia
          </p>
        </div>
        <button
          type="button"
          className="hidden h-8 w-8 items-center justify-center text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 lg:inline-flex"
          aria-label="Sidebar aktif"
        >
          <i className="fi fi-rr-sidebar-flip text-sm" />
        </button>
        <button
          type="button"
          className="personalia-icon-button h-8 w-8 lg:hidden"
          aria-label="Tutup sidebar"
          onClick={onClose}
        >
          <i className="fi fi-rr-cross-small text-sm" />
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-5 pr-4 [scrollbar-width:thin]">
        <div className="mb-3 flex min-h-8 items-center gap-2 px-1.5 text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-slate-400">
          <i className="fi fi-rr-apps text-xs" />
          <span>Menu Utama</span>
        </div>
        <div className="flex flex-col gap-1">
          {SIDEBARMENU.map((item) => (
            <button
              key={item.name}
              className={`personalia-sidebar-item ${
                pathname === item.path
                  ? "personalia-sidebar-item-active"
                  : "personalia-sidebar-item-idle"
              }`}
              onClick={() => handlePress(item.path, item.name)}
              title={item.name}
              type="button"
            >
              <img
                src={item.icon}
                alt={item.name}
                className="h-5 w-5 shrink-0"
              />
              <p
                className={`min-w-0 flex-1 break-words text-left text-sm font-medium leading-6 ${
                  item.name === "Logout" ? "text-red-700" : ""
                }`}
              >
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-slate-200 px-3 pb-4 pt-3 dark:border-slate-800">
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-semibold leading-5 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900">
          <i className="fi fi-rr-shield-check text-xs" />
          <span className="truncate">UI Standard Active</span>
        </div>
      </div>
    </aside>
  );
};
