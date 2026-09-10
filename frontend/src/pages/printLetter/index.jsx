import { useMemo, useState } from "react";
import {
  Pagination,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Button,
  Input,
} from "@heroui/react";

import ListLetter from "./components/listLetter";
import Layout from "../../components/layout";
import { getAllLettersForMenu } from "../../constants/letterConfig";
import { LIMITPAGE, PROPFORM } from "../../constants/ui";

export default function PrintLetterPage() {
  const [limitPage, setLimitPage] = useState(new Set(["10"]));
  const [isTable, setIsTable] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Get all letters from centralized config
  const ALL_LETTERS = getAllLettersForMenu();

  const selectedLimit = useMemo(
    () => Array.from(limitPage).join(", ").replace(/_/g, ""),
    [limitPage],
  );

  const searchSurat = useMemo(() => {
    let listSurat = [...ALL_LETTERS];

    if (search) {
      listSurat = listSurat.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return listSurat;
  }, [search, ALL_LETTERS]);

  const totalPagination = useMemo(() => {
    return Math.ceil(searchSurat.length / selectedLimit);
  }, [selectedLimit, searchSurat]);

  const paginatedSurat = useMemo(() => {
    const start = (page - 1) * selectedLimit;
    const end = start + parseInt(selectedLimit);
    return searchSurat.slice(start, end);
  }, [searchSurat, page, selectedLimit]);

  return (
    <Layout>
      <section className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="personalia-hero-card flex min-h-24 min-w-0 items-center overflow-hidden px-5 py-4">
          <p className="z-10 max-w-full break-words text-lg font-semibold text-white sm:text-xl">
            Pilih surat yang mau dicetak
          </p>
        </div>

        <div className="personalia-card flex flex-col gap-5 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Daftar Surat ({ALL_LETTERS.length} Surat)
              </p>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="personalia-action-button personalia-action-button-light h-10"
                    variant="bordered"
                  >
                    {selectedLimit}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Limit page"
                  selectedKeys={limitPage}
                  selectionMode="single"
                  onSelectionChange={setLimitPage}
                >
                  {LIMITPAGE.map((item) => (
                    <DropdownItem key={item}>{item}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            <Input
              {...PROPFORM}
              isClearable
              className="w-full md:max-w-sm"
              classNames={{
                inputWrapper: "w-full h-10",
              }}
              placeholder="Cari nama surat..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to first page on search
              }}
              onClear={() => {
                setSearch("");
                setPage(1);
              }}
            />
          </div>

          <ListLetter
            data={paginatedSurat}
            isTable={isTable}
            setIsTable={setIsTable}
          />

          {totalPagination > 1 && (
            <Pagination
              className="flex justify-center"
              total={totalPagination}
              page={page}
              onChange={setPage}
              showControls
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
