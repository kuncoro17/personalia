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
      <section className="container px-4 flex-grow flex-1 pr-16 flex flex-col gap-4 py-8 md:py-10">
        <div className="flex justify-between bg-primary items-end relative h-36 rounded-lg mt-20">
          <p className="text-white font-Poppins text-4xl font-[700] ml-5 mb-5">
            Pilih surat yang mau dicetak
          </p>

          <img src="/cetakSurat.svg" className="absolute right-0 -bottom-10" />
        </div>

        <div className="mt-10 flex flex-col gap-5">
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <p className="font-Poppins text-xl font-[600] text-primary">
                All Mail ({ALL_LETTERS.length} Surat)
              </p>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="font-Poppins border-primary border-1 rounded-md h-10"
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
              classNames={{
                inputWrapper: "w-96 h-10",
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
