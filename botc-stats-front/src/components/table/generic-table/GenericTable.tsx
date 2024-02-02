import Filter from "@/components/filter/Filter";
import { SliderX } from "@/components/slider/slider-x";
import { stringContainsString } from "@/helper/string";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Selection,
  SortDescriptor,
  Spacer,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Key, useEffect, useMemo, useRef, useState } from "react";

export type GenericTableColumnProps = {
  key: string;
  name: string;
  isFilterable?: boolean;
  allowSorting?: boolean;
  isDefaultSort?: boolean;
  reverseDefaultSort?: boolean;
  isDefaultVisible?: boolean;
};

export type GenericTableRowsExtendedProps = {
  id: string | number;
  popoverContent?: any;
  renderJSX?: any;
};

export type GenericTableProps<T> = {
  columns: GenericTableColumnProps[];
  rows: T[];
  rowsPercentage?: T[];
};

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

export function GenericTable<T extends GenericTableRowsExtendedProps>({
  columns,
  rows,
  rowsPercentage,
}: GenericTableProps<T>) {
  const [filters, setFilters] = useState<{ key: string; value: string }[]>([]);
  const [showPercentage, setShowPercentage] = useState<boolean>(false);
  const [keyTable, setKeyTable] = useState<number>(0);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(
      columns
        .filter((column) => column.isDefaultVisible)
        .map((column) => column.key)
    )
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: columns.find((column) => column.isDefaultSort)?.key,
    direction: columns.find((column) => column.isDefaultSort)
      ?.reverseDefaultSort
      ? "ascending"
      : "descending",
  });
  const columnsRef = useRef(columns);

  useEffect(() => {
    setFilters([]);
    columnsRef.current
      .filter((column) => column.isFilterable)
      .forEach((column) => {
        setFilters((prev) => [...prev, { key: column.key, value: "" }]);
      });
  }, []);

  const [tempRows, setTempRows] = useState(rows);
  const [tempRowsPercentage, setTempRowsPercentage] = useState(rowsPercentage);

  const sortedItems = useMemo(() => {
    const filteredRows = (
      showPercentage && tempRowsPercentage ? tempRowsPercentage : tempRows
    ).filter((row) => {
      return filters.every((filter) => {
        return stringContainsString(
          row[filter.key as keyof T] as string,
          filter.value
        );
      });
    });

    function replacePercentageValue(value: T[keyof T]) {
      if (showPercentage && typeof value === "string") {
        const regex = / \(|\)/g;
        const result = (value as string)
          .replace("%", ".")
          .replace("-", "-Infinity")
          .replaceAll(regex, "");
        return Number(result);
      }
      return value;
    }

    const result = [...filteredRows].sort((a: T, b: T) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];

      let cmp =
        first === second
          ? 0
          : (Number(first) || replacePercentageValue(first)) <
            (Number(second) || replacePercentageValue(second))
          ? -1
          : 1;

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });

    if (showPercentage && tempRowsPercentage) {
      setTempRowsPercentage(result);
    } else {
      setTempRows(result);
    }TODO : From the backend, order by the fetched data to have a good looking first result in the table (ie: players = total.then(wins).then(name))

    return result;
  }, [rows, rowsPercentage, showPercentage, sortDescriptor, filters]);

  useEffect(() => {
    // Shows the table correctly after changing the ref of <SliderX />
    setKeyTable((prev) => prev + 1);
  }, [sortedItems]);

  function renderCell(row: T, columnKey: Key): JSX.Element {
    const cell =
      row.renderJSX &&
      Object.hasOwn(row.renderJSX, columnKey as PropertyKey) &&
      (row.renderJSX[columnKey as PropertyKey] as string) !== null
        ? (row.renderJSX[columnKey as PropertyKey] as string)
        : (row[columnKey as keyof T] as string);

    if (row.popoverContent) {
      const popContent =
        Object.hasOwn(row.popoverContent, columnKey as PropertyKey) &&
        (row.popoverContent[columnKey as PropertyKey] as string) !== null
          ? (row.popoverContent[columnKey as PropertyKey] as string)
          : row.popoverContent;

      return (
        <Popover showArrow>
          <PopoverTrigger>
            <div className={`cursor-pointer`}>{cell}</div>
          </PopoverTrigger>
          <PopoverContent>{popContent}</PopoverContent>
        </Popover>
      );
    } else {
      return <>{cell}</>;
    }
  }

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        {filters
          .sort((a, b) => {
            return (
              columns.findIndex((column) => column.key === a.key) -
              columns.findIndex((column) => column.key === b.key)
            );
          })
          .map((filter) => (
            <div key={filter.key}>
              <Filter
                filterValue={filter.value}
                size="sm"
                setFilter={(value) => {
                  setFilters((prev) => [
                    ...prev.filter((p) => p.key !== filter.key),
                    { key: filter.key, value: value },
                  ]);
                }}
                placeholder={`${
                  columns.find((c) => c.key === filter.key)?.name
                }`}
              />
              <Spacer y={3} />
            </div>
          ))}
      </div>
      <div className="flex justify-between">
        <Dropdown>
          <DropdownTrigger className="flex">
            <Button variant="flat">Colonnes</Button>
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
        {rowsPercentage && (
          <Switch
            size="sm"
            isSelected={showPercentage}
            onValueChange={setShowPercentage}
          >
            Pourcentage
          </Switch>
        )}
      </div>
      <Spacer y={2.5} />
      <SliderX>
        <Table
          key={keyTable}
          className="w-auto"
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
                    className="text-center"
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
      </SliderX>
    </>
  );
}
