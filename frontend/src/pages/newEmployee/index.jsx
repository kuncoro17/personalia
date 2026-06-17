import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useUser } from "@clerk/clerk-react";
import { useMemo, useState } from "react";

import Layout from "../../components/layout";
import EmployeeStatus from "../../features/userManagement/employeeStatus";
import NewEmployees from "./components/userManagement/newEmployees";
import { LIMITPAGE } from "../../constants/ui";

export default function NewEmployeePage() {
  const { user } = useUser();
  const [limitPage, setLimitPage] = useState(new Set(["10"]));

  const selectedLimit = useMemo(
    () => Array.from(limitPage).join(", ").replace(/_/g, ""),
    [limitPage],
  );

  const displayName = useMemo(() => {
    const fullName = user?.fullName?.trim();
    const firstName = user?.firstName?.trim();
    const email = user?.primaryEmailAddress?.emailAddress?.trim();

    return fullName || firstName || email || "User";
  }, [user]);

  return (
    <Layout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <section className="container px-4 flex-grow flex-1 flex flex-col gap-4">
        <div className="flex items-center bg-primary min-h-52 w-full rounded-2xl px-7 relative">
          <div className="flex flex-col gap-3">
            <p className="font-Poppins text-white font-[600] text-2xl">
              Hi, {displayName}
            </p>
            <p className="font-Poppins text-white">
              Ready to start your date with some pitch desk?
            </p>
          </div>

          <img
            src="/homeIllustrator.svg"
            alt="Home Illustrator"
            className="absolute right-0 -bottom-28"
          />
        </div>

        <div>
          <EmployeeStatus />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <p className="font-Poppins font-[600] text-xl text-primary">
              New Employee
            </p>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="font-Poppins border-primary border-1 rounded-md"
                  variant="bordered"
                >
                  {selectedLimit}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Single selection example"
                selectedKeys={limitPage}
                selectionMode="single"
                variant="flat"
                onSelectionChange={setLimitPage}
              >
                {LIMITPAGE.map((item) => (
                  <DropdownItem key={item} className="font-Poppins">
                    {item}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          <NewEmployees limitPage={selectedLimit} />
        </div>
      </section>
    </Layout>
  );
}
