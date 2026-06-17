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
      <section className="container min-w-0 flex-1 flex-grow px-4 flex flex-col gap-4">
        <div className="grid min-h-44 w-full min-w-0 grid-cols-1 overflow-hidden rounded-2xl bg-primary px-5 pt-6 sm:px-7 md:min-h-48 md:grid-cols-[minmax(0,1fr)_minmax(180px,28%)] md:items-center md:pt-0">
          <div className="z-10 flex min-w-0 max-w-full flex-col gap-3">
            <p className="break-words font-Poppins text-2xl font-[600] text-white sm:text-3xl lg:text-[32px]">
              Hi, {displayName}
            </p>
            <p className="break-words font-Poppins text-sm text-white sm:text-base">
              Ready to start your date with some pitch desk?
            </p>
          </div>

          <img
            src="/homeIllustrator.svg"
            alt="Home Illustrator"
            className="pointer-events-none mt-4 w-full max-w-[220px] justify-self-end self-end md:mt-0 md:max-w-[280px] lg:max-w-[320px]"
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
