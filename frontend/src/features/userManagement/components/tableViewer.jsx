import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";

const renderCell = (data, columnKey, isSelect, selected = []) => {
  const cellValue = data[columnKey];
  const itemId = String(data.id_karyawan ?? "");
  const derivedSelected =
    typeof data.__isSelected === "boolean" ? data.__isSelected : undefined;
  const isItemSelected =
    derivedSelected ?? (isSelect && itemId ? selected.includes(itemId) : false);

  switch (columnKey) {
    case "action":
      return (
        <button
          className="inline-flex h-4 w-4 items-center justify-center rounded border border-slate-400 p-0.5"
          type="button"
        >
          <div
            className={`h-full w-full rounded-[2px] ${isItemSelected ? "bg-blue-600" : "bg-transparent"}`}
          />
        </button>
      );
    default:
      return (
        <p className="font-medium text-slate-700 dark:text-slate-200">
          {cellValue}
        </p>
      );
  }
};

export const TableViewer = ({
  isSelect,
  dataTable,
  selected,
  onSelect,
  header,
}) => {
  const navigate = useNavigate();

  return (
    <Table
      aria-label="Example table with custom cells"
      className="w-full min-w-0"
      classNames={{
        wrapper: "border border-slate-200 shadow-none rounded-lg p-0",
        th: "bg-slate-50 text-slate-500 uppercase tracking-wider font-bold",
        td: "text-slate-700",
      }}
      onRowAction={(item) => {
        isSelect
          ? onSelect(item)
          : navigate(`/detailEmployee/${item}`, {
              state: { id: item, title: "Detail Karyawan" },
            });
      }}
    >
      <TableHeader columns={header}>
        {(column) => (
          <TableColumn key={column.uid} align="start">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={dataTable}>
        {(item) => (
          <TableRow key={item.id_karyawan} className="cursor-pointer">
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey, isSelect, selected)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
