import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useMemo, useState } from "react";

interface Column {
  key: string;
  name: string;
  allowSorting?: boolean;
}

export interface GenericTableRowProps {
  column: Column;
  id: string | number;
  value: string;
}

export interface GenericTableProps {
  rows: GenericTableRowProps[];
}

interface GroupedColumns {
  [key: string]: Column[];
}

export function groupColumns(columns: Column[]): GroupedColumns {
  return columns.reduce((acc: GroupedColumns, current: Column) => {
    const key = current.key;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(current);
    return acc;
  }, {});
}

export function GenericTable({ rows }: GenericTableProps) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: rows[0].column.key,
    direction: "descending",
  });

  const sortedItems = useMemo(() => {
    return [...rows].sort(
      (a: GenericTableRowProps, b: GenericTableRowProps) => {
        const first = a[sortDescriptor.column as keyof GenericTableRowProps];
        const second = b[sortDescriptor.column as keyof GenericTableRowProps];
        let cmp =
          first === second
            ? 0
            : (parseInt(first.toString()) || first) <
              (parseInt(second.toString()) || second)
            ? -1
            : 1;

        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }

        return cmp;
      }
    );
  }, [rows, sortDescriptor]);

  console.log(groupColumns(rows.map((r) => r.column)));

  return (
    <Table
      aria-label="table"
      removeWrapper
      sortDescriptor={sortDescriptor}
      onSortChange={(sort) => {
        setSortDescriptor({
          ...sort,
          direction:
            sort.column === sortDescriptor.column
              ? sort.direction
              : "descending",
        });
      }}
    >
      <TableHeader>
        {Object.keys(groupColumns(rows.map((r) => r.column))).map(
          (columnKey: string) => (
            <TableColumn
              key={columnKey}
              allowsSorting={
                rows.find((r) => r.column.key === columnKey)!.column
                  .allowSorting
              }
            >
              {rows.find((r) => r.column.key === columnKey)!.column.name}
            </TableColumn>
          )
        )}
      </TableHeader>
      <TableBody items={sortedItems}>
        {(row: GenericTableRowProps) => {
          return (
            <TableRow key={row.id}>
              {(columnKey) => <TableCell>{row.value}</TableCell>}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
}
