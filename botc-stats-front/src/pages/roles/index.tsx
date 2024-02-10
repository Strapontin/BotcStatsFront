import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import {
  getListboxItemRoleDetails,
  getListboxItemRoleWikiLink,
  getListboxItemUpdateRole,
} from "@/components/table/generic-table/popover/listbox-items";
import { getUserRole } from "@/components/ui/image-role-name";
import Title from "@/components/ui/title";
import { useUserHasStoryTellerRights } from "@/data/back-api/back-api-auth";
import { useGetRoles } from "@/data/back-api/back-api-role";
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
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Plus } from "react-feather";

type RowType = GenericTableRowsExtendedProps & {
  characterType: number | string;
  name: string;
  total: number | string;
  wins: number | string;
  loses: number | string;
};

export default function RolesPage() {
  const { data: roles, isLoading } = useGetRoles();
  const router = useRouter();
  const user = useUserHasStoryTellerRights();

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

  const title = <Title>Liste des rôles</Title>;

  if (isLoading) {
    return (
      <>
        {title}
        <Spacer y={3} />
        <Spinner />
      </>
    );
  }

  const genericTableColumns: GenericTableColumnProps[] = [
    {
      key: "characterType",
      name: "Type de personnage",
      allowSorting: true,
      isDefaultSort: true,
      reverseDefaultSort: true,
    },
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
        {getListboxItemUpdateRole(role, user.isStoryTeller)}
        {getListboxItemRoleWikiLink(role)}
      </Listbox>
    );
  }

  const tableRows = roles
    .filter((role: Role) =>
      Array.from(characterTypeFilter).includes(role.characterType.toString())
    )
    .map((role: Role) => {
      const result: RowType = {
        id: "role" + role.id,
        characterType: role.characterType,
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

  const tableRowsPercentage = tableRows.map((role: RowType) => {
    const result: RowType = {
      ...role,
      total: role.total,
      wins: computePercentage(role.total, role.wins),
      loses: computePercentage(role.total, role.loses),
    };
    return result;
  });

  return (
    <>
      {title}
      <Spacer y={1} />
      <div className={user.isStoryTeller ? "" : "hidden"}>
        <Button
          className="flex"
          color="success"
          startContent={<Plus className="h-4" />}
          onPress={() => router.push(`/create/role`)}
        >
          Ajouter un nouveau rôle
        </Button>
        <Spacer y={3} />
      </div>
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
