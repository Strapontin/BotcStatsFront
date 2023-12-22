import { Role } from "@/entities/Role";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { Key, useCallback } from "react";
import {
  getCssClassesFromCharacterType,
  getRoleIconPath,
} from "../ui/image-role-name";

export function PlayerRolesTable({ playerRoles }: { playerRoles: Role[] }) {
  let list = useAsyncList({
    load() {
      if (!playerRoles) return { items: [] };

      return {
        items: playerRoles,
      };
    },
    async sort({ items, sortDescriptor }) {
      sortDescriptor.direction =
        list.sortDescriptor?.column === sortDescriptor.column
          ? sortDescriptor.direction
          : sortDescriptor.direction === "descending"
          ? "ascending"
          : "descending";

      return {
        items: items.sort((a: Role, b: Role) => {
          const first = a[sortDescriptor.column as keyof Role];
          const second = b[sortDescriptor.column as keyof Role];
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
        }),
      };
    },
  });

  const renderCell = useCallback((role: Role, columnKey: Key) => {
    const cellValue: string = role[columnKey as keyof Role] as string;

    switch (columnKey) {
      case "name":
        return (
          <div className="flex justify-left text-left">
            <User
              name={cellValue}
              classNames={{ wrapper: "flex-1" }}
              avatarProps={{
                src: getRoleIconPath(cellValue),
                size: "sm",
                radius: "sm",
                isBordered: true,
                classNames: {
                  base:
                    getCssClassesFromCharacterType(role.characterType)
                      .ringColorClass + " w-8 ",
                },
              }}
            />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      aria-label="Player role list"
      removeWrapper
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
    >
      <TableHeader>
        <TableColumn key="name" align="end" className="px-0 pl-3 ">
          Role
        </TableColumn>
        <TableColumn key="timesPlayedByPlayer" className="px-0" allowsSorting>
          Total
        </TableColumn>
        <TableColumn key="timesWonByPlayer" className="px-0" allowsSorting>
          Wins
        </TableColumn>
        <TableColumn key="timesLostByPlayer" className="px-0" allowsSorting>
          Loses
        </TableColumn>
      </TableHeader>
      <TableBody items={list.items}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => (
              <TableCell className="">{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
