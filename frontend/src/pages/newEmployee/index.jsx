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
        <Card className="personalia-hero-card flex min-h-28 w-full min-w-0 items-center overflow-hidden px-5 py-4 sm:px-6">
          <div className="z-10 flex min-w-0 max-w-full flex-col gap-2">
            <p className="break-words text-xl font-semibold text-black sm:text-2xl">
              Hi, {displayName}
            </p>
            <p className="break-words text-sm leading-6 text-black/80">
              Selamat datang di Dashboard Personalia SAS BPK PENABUR.
            </p>
          </div>
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
                <Button variant="outline">{selectedLimit}</Button>
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
