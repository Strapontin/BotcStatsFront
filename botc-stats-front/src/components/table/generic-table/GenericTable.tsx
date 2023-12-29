import AuthContext from "@/stores/authContext";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Selection,
  SortDescriptor,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Key, useContext, useEffect, useMemo, useState } from "react";
import { ChevronDown } from "react-feather";

interface GenericTableColumnProps {
  key: string;
  name: string;
  allowSorting?: boolean;
}

export interface GenericTableProps<T> {
  columns: GenericTableColumnProps[];
  rows: T[];
}

interface GroupedColumns {
  [key: string]: GenericTableColumnProps[];
}

export function groupColumns(
  columns: GenericTableColumnProps[]
): GroupedColumns {
  return columns.reduce(
    (acc: GroupedColumns, current: GenericTableColumnProps) => {
      const key = current.key;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(current);
      return acc;
    },
    {}
  );
}

export function GenericTable<
  T extends {
    id: string | number;
    popoverListboxContent?: JSX.Element;
    popoverListboxContentStoryTeller?: JSX.Element;
  }
>({ columns, rows }: GenericTableProps<T>) {
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((column) => column.key))
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: columns[0].key,
    direction: "descending",
  });
  const user = useContext(AuthContext);
  const [tableBodyKey, setTableBodyKey] = useState(0);

  useEffect(() => {
    setTableBodyKey((prev) => prev + 1);
  }, [user.isStoryTeller]);

  const sortedItems = useMemo(() => {
    return [...rows].sort((a: T, b: T) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];
      let cmp =
        first === second
          ? 0
          : (parseInt(first as string) || first) <
            (parseInt(second as string) || second)
          ? -1
          : 1;

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [rows, sortDescriptor]);

  function renderCell(row: T, columnKey: Key): JSX.Element {
    if (row.popoverListboxContent) {
      return (
        <Popover showArrow>
          <PopoverTrigger>
            <div className="cursor-pointer">
              {row[columnKey as keyof T] as string}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox aria-label="popover-items">
              {row.popoverListboxContent}
              {(user.isStoryTeller && row.popoverListboxContentStoryTeller) || (
                <ListboxItem className="hidden" key={""} />
              )}
            </Listbox>
          </PopoverContent>
        </Popover>
      );
    } else {
      return <>{row[columnKey as keyof T] as string}</>;
    }
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger className="flex">
          <Button endContent={<ChevronDown className="h-4" />}>Columns</Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Table Columns"
          closeOnSelect={false}
          selectedKeys={visibleColumns}
          selectionMode="multiple"
          onSelectionChange={setVisibleColumns}
        >
          {columns.map((column) => (
            <DropdownItem key={column.key} className="capitalize">
              {column.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Spacer y={2.5} />
      <Table
        key={tableBodyKey}
        className="overflow-auto"
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
          {Object.keys(groupColumns(columns))
            .filter((column) => Array.from(visibleColumns).includes(column))
            .map((columnKey: string) => {
              const column = columns.find((c) => c.key === columnKey)!;
              return (
                <TableColumn
                  key={columnKey}
                  allowsSorting={column.allowSorting}
                >
                  {column.name}
                </TableColumn>
              );
            })}
        </TableHeader>
        <TableBody items={sortedItems}>
          {(row: T) => (
            <TableRow key={row.id}>
              {(columnKey: Key) => (
                <TableCell>{renderCell(row, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
