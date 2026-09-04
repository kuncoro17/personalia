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
          style={{
            height: "1rem",
            aspectRatio: 1,
            borderRadius: "0.2rem",
            border: "1px solid rgba(0, 0, 0, 0.5)",
            padding: "0.1rem",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "0.1rem",
              backgroundColor: isItemSelected ? "#0B345E" : "transparent",
            }}
          />
        </button>
      );
    default:
      return (
        <p className="font-Poppins font-[500] text-primary dark:text-slate-200">
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
          <TableColumn key={column.uid} align="center">
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
