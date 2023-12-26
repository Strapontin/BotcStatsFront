import { Role } from "@/entities/Role";
import { CharacterType } from "@/entities/enums/characterType";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  SortDescriptor,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import { Key, useCallback, useMemo, useState } from "react";
import {
  getCssClassesFromCharacterType,
  getRoleIconPath,
} from "../../ui/image-role-name";

export function PlayerRolesTable({ playerRoles }: { playerRoles: Role[] }) {
  const [characterTypeFilter, setCharacterTypeFilter] =
    useState<Selection>("all");
  const characterTypeOptions = [
    { name: "Villageois", uid: CharacterType.Townsfolk },
    { name: "Etranger", uid: CharacterType.Outsider },
    { name: "Sbire", uid: CharacterType.Minion },
    { name: "Démon", uid: CharacterType.Demon },
    { name: "Voyageur", uid: CharacterType.Traveller },
  ];
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "timesPlayedByPlayer",
    direction: "descending",
  });

  const filteredPlayerRoles = playerRoles.filter(
    (role) =>
      characterTypeFilter === "all" ||
      Array.from(characterTypeFilter).includes(role.characterType.toString())
  );

  const sortedPlayerRoles = useMemo(() => {
    return [...filteredPlayerRoles].sort((a: Role, b: Role) => {
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
    });
  }, [filteredPlayerRoles, sortDescriptor]);

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
    <>
      <div className="flex gap-3">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat">Type de rôle</Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Type de rôle"
            closeOnSelect={false}
            selectedKeys={characterTypeFilter}
            selectionMode="multiple"
            onSelectionChange={setCharacterTypeFilter}
          >
            {characterTypeOptions.map((characterType) => (
              <DropdownItem key={characterType.uid}>
                {characterType.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <Spacer y={5} />
      <Table
        aria-label="Player role list"
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
        <TableBody items={sortedPlayerRoles}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell className="">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
