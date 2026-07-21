import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Button,
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
  Tooltip,
  User,
} from "@heroui/react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { useEffect, useState } from "react";

import { EMPLOYEEENDPOINT } from "../../constants/api";
import { useMaster } from "../../hooks/useMaster";
import { apiClient, resolveApiAssetUrl } from "../../service/api";
import { capitalizeWords } from "../../utils/format";
import {
  applyTheme,
  getPreferredTheme,
  listenThemeChange,
  THEME,
} from "../../utils/theme";

const DEFAULT_AVATAR = "/image/1.svg";

export const Navbar = ({ children }) => {
  const location = useLocation();
  const title = location.state?.title || "New Employee";
  let { pathname } = useLocation();
  const isEmployeeDetail = pathname.startsWith("/detailEmployee/");
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

  useEffect(() => listenThemeChange(setTheme), []);

  const handleToggleTheme = () => {
    const nextTheme = isDark ? THEME.LIGHT : THEME.DARK;
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col ${!isEmployeeDetail ? "lg:pl-72" : ""}`}
    >
      <HeroUINavbar
        maxWidth="full"
        position="static"
        height={"4rem"}
        isBlurred={false}
        className="border-b border-transparent bg-transparent px-2 dark:border-slate-800 sm:px-6"
      >
        <NavbarContent className="basis-1/2 sm:flex sm:basis-full">
          <NavbarItem className="hidden sm:flex flex-col">
            <p className="font-Poppins text-xl font-[700] text-primary dark:text-slate-100">
              {title}
            </p>
            <p className="font-Poppins text-primary/80 dark:text-slate-400">
              {moment().format("dddd, MMMM DD YYYY")}
            </p>
          </NavbarItem>
          <NavbarItem className="flex flex-col sm:hidden">
            <p className="max-w-[150px] truncate font-Poppins text-base font-[700] text-primary dark:text-slate-100">
              {title}
            </p>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="min-w-0">
          <Tooltip
            content={isDark ? "Gunakan light mode" : "Gunakan dark mode"}
            showArrow
          >
            <Button
              isIconOnly
              aria-label={isDark ? "Gunakan light mode" : "Gunakan dark mode"}
              className="shrink-0 border border-default-200 bg-white text-primary shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-yellow"
              radius="full"
              size="sm"
              variant="flat"
              onPress={handleToggleTheme}
            >
              <i className={`fi ${isDark ? "fi-rr-sun" : "fi-rr-moon"}`} />
            </Button>
          </Tooltip>

          <User
            avatarProps={{
              src: avatarSrc,
              imgProps: {
                onError: (event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = DEFAULT_AVATAR;
                },
              },
            }}
            name={capitalizeWords(user?.fullName || "")}
            className="max-w-[170px] font-Poppins font-[600] sm:max-w-none"
          />
        </NavbarContent>
      </HeroUINavbar>

      <div className="mt-4 flex min-w-0 flex-1 sm:mt-5">{children}</div>
    </div>
  );
};
