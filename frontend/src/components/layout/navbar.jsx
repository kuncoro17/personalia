import { useAuth, useUser } from "@clerk/clerk-react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
  User,
} from "@heroui/react";
import { useLocation } from "react-router-dom";
import moment from "moment";

import { EMPLOYEEENDPOINT } from "../../constants/api";
import { useMaster } from "../../hooks/useMaster";
import { apiClient, resolveApiAssetUrl } from "../../service/api";
import { capitalizeWords } from "../../utils/format";

const DEFAULT_AVATAR = "/image/1.svg";

export const Navbar = ({ children }) => {
  const location = useLocation();
  const title = location.state?.title || "New Employee";
  let { pathname } = useLocation();
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
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

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col ${pathname !== "/detailEmployee" ? "lg:pl-72" : ""}`}
    >
      <HeroUINavbar
        maxWidth="full"
        position="static"
        height={"4rem"}
        isBlurred={false}
        className="px-2 sm:px-6"
      >
        <NavbarContent className="basis-1/2 sm:flex sm:basis-full">
          <NavbarItem className="hidden sm:flex flex-col">
            <p className="font-Poppins font-[700] text-xl text-primary">
              {title}
            </p>
            <p className="font-Poppins text-primary">
              {moment().format("dddd, MMMM DD YYYY")}
            </p>
          </NavbarItem>
          <NavbarItem className="flex flex-col sm:hidden">
            <p className="max-w-[150px] truncate font-Poppins text-base font-[700] text-primary">
              {title}
            </p>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end" className="min-w-0">
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
