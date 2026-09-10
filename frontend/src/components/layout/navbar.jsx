import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from "@heroui/react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { useEffect, useState } from "react";

import { EMPLOYEEENDPOINT } from "../../constants/api";
import { Button } from "../ui/button";
import { useMaster } from "../../hooks/useMaster";
import { apiClient, resolveApiAssetUrl } from "../../service/api";
import { capitalizeWords } from "../../utils/format";
import { getSasSdmUrl, hasSasEntry } from "../../utils/sasSession";
import {
  applyTheme,
  getPreferredTheme,
  listenThemeChange,
  THEME,
} from "../../utils/theme";

const DEFAULT_AVATAR = "/image/1.svg";
const SAS_HOME_URL = "https://sas.bpkpenabur.or.id/halaman-utama";

export const Navbar = ({ children, onOpenSidebar }) => {
  const location = useLocation();
  const title = location.state?.title || "New Employee";
  let { pathname } = useLocation();
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [theme, setTheme] = useState(getPreferredTheme);
  const api = apiClient(getToken);
  const { data: accessProfile } = useMaster(
    api,
    ["navbar-karyawan-access"],
    EMPLOYEEENDPOINT.access,
    {
      enabled: isLoaded && isSignedIn,
      select: (response) => response?.data ?? null,
    },
  );
  const avatarSrc = accessProfile?.foto
    ? resolveApiAssetUrl(accessProfile.foto)
    : DEFAULT_AVATAR;
  const isDark = theme === THEME.DARK;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const displayName = capitalizeWords(
    accessProfile?.nama_lengkap ||
      accessProfile?.nama ||
      user?.fullName ||
      user?.primaryEmailAddress?.emailAddress ||
      "User Personalia",
  );
  const displayRole =
    accessProfile?.role?.nama ||
    accessProfile?.role ||
    accessProfile?.jabatan ||
    accessProfile?.akses ||
    "Personalia";
  const displayPlacement =
    accessProfile?.kode_penempatan ||
    accessProfile?.kode_setempat ||
    accessProfile?.id_master_setempat ||
    accessProfile?.setempat?.kota_setempat ||
    accessProfile?.unit_kerja ||
    "-";
  const displayEmail =
    accessProfile?.email_penabur ||
    accessProfile?.email ||
    user?.primaryEmailAddress?.emailAddress ||
    "-";

  useEffect(() => listenThemeChange(setTheme), []);
  useEffect(() => setIsUserMenuOpen(false), [pathname]);

  const handleToggleTheme = () => {
    const nextTheme = isDark ? THEME.LIGHT : THEME.DARK;
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
      <HeroUINavbar
        maxWidth="full"
        position="sticky"
        height="76px"
        isBlurred={false}
        className="personalia-navbar border-b border-slate-200 bg-white/90 px-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6"
      >
        <NavbarContent className="basis-1/2 sm:flex sm:basis-full">
          <NavbarItem className="flex items-center lg:hidden">
            <Button
              aria-label="Buka sidebar"
              className="personalia-icon-button shrink-0"
              size="icon"
              variant="outline"
              onPress={onOpenSidebar}
            >
              <i className="fi fi-rr-menu-burger" />
            </Button>
          </NavbarItem>
          <NavbarItem className="hidden flex-col sm:flex">
            <p className="text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">
              {title}
            </p>
            <p className="text-sm leading-5 text-slate-500 dark:text-slate-400">
              {moment().format("dddd, MMMM DD YYYY")}
            </p>
          </NavbarItem>
          <NavbarItem className="flex flex-col sm:hidden">
            <p className="max-w-[150px] truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </p>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="min-w-0">
          {hasSasEntry() ? (
            <Button
              as="a"
              href={getSasSdmUrl()}
              aria-label="Kembali ke halaman SDM SAS"
              className="hidden shrink-0 sm:inline-flex"
              size="sm"
              variant="outline"
            >
              <i className="fi fi-rr-arrow-left" />
              <span className="hidden sm:inline">Kembali ke SAS</span>
            </Button>
          ) : null}

          <Tooltip
            content={isDark ? "Gunakan light mode" : "Gunakan dark mode"}
            showArrow
          >
            <Button
              aria-label={isDark ? "Gunakan light mode" : "Gunakan dark mode"}
              className="personalia-icon-button shrink-0"
              size="icon"
              variant="outline"
              onPress={handleToggleTheme}
            >
              <i className={`fi ${isDark ? "fi-rr-sun" : "fi-rr-moon"}`} />
            </Button>
          </Tooltip>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-blue-600 bg-white p-0.5 text-blue-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-white dark:hover:bg-white"
              aria-label="Buka menu user"
              aria-expanded={isUserMenuOpen}
            >
              <img
                src={avatarSrc}
                alt={displayName}
                className="h-full w-full rounded-full bg-white object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </button>

            {isUserMenuOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  aria-label="Tutup menu user"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="personalia-user-dropdown absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-lg border border-slate-200 border-t-4 border-t-blue-600 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 sm:w-96">
                  <div className="px-4 py-4">
                    <p className="truncate text-sm font-bold uppercase leading-6 text-slate-950 dark:text-slate-100">
                      {displayName} - {displayRole}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
                      {displayPlacement}
                    </p>
                    <p className="mt-1 truncate text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {displayEmail}
                    </p>
                  </div>
                  <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
                    <a
                      href={SAS_HOME_URL}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      <i className="fi fi-rr-arrow-left text-sm" />
                      <span>Kembali Halaman SAS</span>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </NavbarContent>
      </HeroUINavbar>

      <main className="personalia-page-shell flex min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
};
