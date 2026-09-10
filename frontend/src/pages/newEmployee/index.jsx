import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useUser } from "@clerk/clerk-react";
import { useMemo, useState } from "react";

import Layout from "../../components/layout";
import { Button, Card } from "../../components/ui";
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
      <section className="flex min-w-0 flex-1 flex-col gap-5">
        <Card className="personalia-hero-card grid min-h-44 w-full min-w-0 grid-cols-1 overflow-hidden px-5 pt-6 sm:px-7 md:min-h-48 md:grid-cols-[minmax(0,1fr)_minmax(180px,28%)] md:items-center md:pt-0">
          <div className="z-10 flex min-w-0 max-w-full flex-col gap-3">
            <p className="break-words text-2xl font-semibold text-white sm:text-3xl lg:text-[32px]">
              Hi, {displayName}
            </p>
            <p className="break-words text-sm text-white/80 sm:text-base">
              Selamat datang di Dashboard Personalia SAS BPK PENABUR.
            </p>
          </div>

          <img
            src="/homeIllustrator.svg"
            alt="Home Illustrator"
            className="pointer-events-none mt-4 w-full max-w-[220px] justify-self-end self-end md:mt-0 md:max-w-[280px] lg:max-w-[320px]"
          />
        </Card>

        <div>
          <EmployeeStatus />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              New Employee
            </p>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="outline"
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
