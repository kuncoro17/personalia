import { useUser } from "@clerk/clerk-react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
  User,
} from "@heroui/react";
import { useLocation } from "react-router-dom";
import moment from "moment";

import { capitalizeWords } from "../../utils/format";

export const Navbar = ({ children }) => {
  const location = useLocation();
  const title = location.state?.title || "New Employee";
  let { pathname } = useLocation();
  const { user } = useUser();

  return (
    <div
      className={`flex flex-1 flex-col ${pathname !== "/detailEmployee" && "pl-52"}`}
    >
      <HeroUINavbar
        maxWidth="full"
        position="static"
        height={"4rem"}
        isBlurred={false}
      >
        <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full">
          <NavbarItem className="hidden sm:flex flex-col">
            <p className="font-Poppins font-[700] text-xl text-primary">
              {title}
            </p>
            <p className="font-Poppins text-primary">
              {moment().format("dddd, MMMM DD YYYY")}
            </p>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <User
            avatarProps={{
              src: "/assets/images/profile.jpg",
            }}
            name={capitalizeWords(user.fullName)}
            className="font-Poppins font-[600]"
          />
        </NavbarContent>
      </HeroUINavbar>

      <div className="flex flex-1 mt-5">{children}</div>
    </div>
  );
};
