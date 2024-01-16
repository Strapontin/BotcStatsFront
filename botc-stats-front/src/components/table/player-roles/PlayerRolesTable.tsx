import { getUserRole } from "@/components/ui/image-role-name";
import { Role } from "@/entities/Role";
import {
  CharacterType,
  getCharacterTypeTextById,
} from "@/entities/enums/characterType";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  Selection,
  Spacer,
} from "@nextui-org/react";
import { useState } from "react";
import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "../generic-table/GenericTable";
import {
  getListboxItemRoleDetails,
  getListboxItemRoleWikiLink,
} from "../generic-table/popover/listbox-items";

type RowType = GenericTableRowsExtendedProps & {
  name: string;
  total: number | string;
  wins: number | string;
  loses: number | string;
};

export function PlayerRolesTable({ playerRoles }: { playerRoles: Role[] }) {
  const characterTypeOptions = [
    { name: "Villageois", uid: CharacterType.Townsfolk },
    { name: "Etranger", uid: CharacterType.Outsider },
    { name: "Sbire", uid: CharacterType.Minion },
    { name: "Démon", uid: CharacterType.Demon },
    { name: "Voyageur", uid: CharacterType.Traveller },
  ];
  const [characterTypeFilter, setCharacterTypeFilter] = useState<Selection>(
    new Set(characterTypeOptions.map((type) => type.uid.toString()))
  );

  const genericTableColumns: GenericTableColumnProps[] = [
    {
      key: "name",
      name: "Nom",
      allowSorting: true,
      isFilterable: true,
      isDefaultVisible: true,
    },
    {
      key: "total",
      name: "Total",
      allowSorting: true,
      isDefaultSort: true,
      isDefaultVisible: true,
    },
    {
      key: "wins",
      name: "Victoires",
      allowSorting: true,
      isDefaultVisible: true,
    },
    { key: "loses", name: "Défaites", allowSorting: true },
  ];

  function tableRowPopover(role: Role): JSX.Element {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemRoleDetails(role)}
        {getListboxItemRoleWikiLink(role)}
      </Listbox>
    );
  }

  const tableRows = playerRoles.map((role: Role) => {
    const result: RowType = {
      id: "role" + role.id,
      name: role.name,
      total: role.timesPlayedTotal,

      wins: role.timesWonTotal,
      loses: role.timesLostTotal,

      renderJSX: {
        characterType: getCharacterTypeTextById(role.characterType),
        name: getUserRole(role),
      },

      popoverContent: tableRowPopover(role),
    };
    return result;
  });

  function computePercentage(
    total: number | string,
    value: number | string
  ): string {
    if (typeof total === "string" || typeof value === "string") return "-";
    return total === 0
      ? "-"
      : ((value / total) * 100).toFixed() + `% (${value})`;
  }

  const tableRowsPercentage = tableRows.map((player) => {
    const result: RowType = {
      ...player,
      total: player.total,
      wins: computePercentage(player.total, player.wins),
      loses: computePercentage(player.total, player.loses),
    };
    return result;
  });

  return (
    <>
      <div className="flex">
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
      <Spacer y={3} />
      <GenericTable
        columns={genericTableColumns}
        rows={tableRows}
        rowsPercentage={tableRowsPercentage}
      />
    </>
  );
}
