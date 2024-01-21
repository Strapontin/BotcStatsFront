import {
  GenericTable,
  GenericTableColumnProps,
  GenericTableRowsExtendedProps,
} from "@/components/table/generic-table/GenericTable";
import {
  getListboxItemRoleDetails,
  getListboxItemRoleWikiLink,
} from "@/components/table/generic-table/popover/listbox-items";
import { getUserRole } from "@/components/ui/image-role-name";
import { useGetEditions } from "@/data/back-api/back-api-edition";
import { useGetRoles } from "@/data/back-api/back-api-role";
import {
  WikiType,
  useGetOfficialNightSheet,
  useGetWikiTbaRoles,
} from "@/data/wiki-api";
import { Role } from "@/entities/Role";
import { CharacterType } from "@/entities/enums/characterType";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  Spacer,
  Spinner,
} from "@nextui-org/react";
import { useCallback, useRef, useState } from "react";

type RowType = GenericTableRowsExtendedProps & {
  firstNight: string;
  otherNight: string;
  notWaking: string;
};

type RoleTranslated = {
  role?: Role;
  name: string;
};

const keywords = {
  DUSK: "Crépuscule",
  MINION: "Réveil des Sbires",
  DEMON: "Réveil du Démon",
  DAWN: "Aube",
};

export default function NighsheetPage() {
  const { data: officialNightSheet, isLoading: isLoadingOfficialNightSheet } =
    useGetOfficialNightSheet();
  const { data: wikiTbaRoles, isLoading: isLoadingWikiRoles } =
    useGetWikiTbaRoles();
  const { data: allRoles, isLoading: isLoadingRoles } = useGetRoles();
  const { data: editions, isLoading: isLoadingEditions } = useGetEditions();
  const [selectedEdition, setSelectedEdition] = useState<string | number>(
    "all"
  );

  const officialNightSheetRef = useRef(officialNightSheet);
  if (officialNightSheet !== officialNightSheetRef.current)
    officialNightSheetRef.current = officialNightSheet;

  const wikiTbaRolesRef = useRef(wikiTbaRoles);
  if (wikiTbaRoles !== wikiTbaRolesRef.current)
    wikiTbaRolesRef.current = wikiTbaRoles;

  const getRoleFromTextTranslation = useCallback(
    (name: string, wikiType: WikiType[], roles: Role[]): RoleTranslated => {
      const wikiTypeRole: WikiType | undefined = wikiType.find(
        (wt) => wt.originalName === name
      );
      const role: Role | undefined = roles.find(
        (role: Role) => role.name === wikiTypeRole?.name
      );
      if (wikiTypeRole?.name && !role?.name) {
        // Log role in case it's a new one that isn't added yet
        console.log(name, wikiTypeRole?.name, role?.name);
      }

      if (role !== undefined) {
        return { role, name: role.name };
      }

      return { name: (keywords as any)[name] || wikiTypeRole?.name || name };
    },
    []
  );

  if (isLoadingOfficialNightSheet || isLoadingWikiRoles || isLoadingRoles) {
    return <Spinner />;
  }

  if (!wikiTbaRoles) {
    return <p>{"Les rôles de la TBA n'ont pas chargé correctement"}</p>;
  }
  if (!allRoles) {
    return <p>{"Les roles n'ont pas chargé correctement"}</p>;
  }

  function getPopoverContent(role: Role): JSX.Element {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemRoleDetails(role)}
        {getListboxItemRoleWikiLink(role)}
      </Listbox>
    );
  }

  function filterRolesFromEdition(roleTranslated: RoleTranslated) {
    return (
      roleTranslated.role ||
      Object.values(keywords).includes(roleTranslated.name)
    );
  }

  function getNightSheet(
    firstNightNames: string[],
    otherNightNames: string[]
  ): RowType[] {
    const roles =
      selectedEdition === "all"
        ? allRoles
        : editions.find((e) => e.id === +selectedEdition)?.roles;
    if (roles == null) return [];

    const firstNightRoles = firstNightNames
      .map((fn: string) => getRoleFromTextTranslation(fn, wikiTbaRoles!, roles))
      .filter(filterRolesFromEdition);
    const otherNightRoles = otherNightNames
      .map((fn: string) => getRoleFromTextTranslation(fn, wikiTbaRoles!, roles))
      .filter(filterRolesFromEdition);
    const rolesNotWaking = roles.filter(
      (role) =>
        role.characterType !== CharacterType.Traveller &&
        !firstNightRoles.find((r: RoleTranslated) => r.role?.id === role.id) &&
        !otherNightRoles.find((r: RoleTranslated) => r.role?.id === role.id)
    );

    const length = Math.max(
      firstNightRoles.length,
      otherNightRoles.length,
      rolesNotWaking.length
    );
    const result: RowType[] = [];

    for (let i = 0; i < length; i++) {
      const firstNightRole = firstNightRoles[i];
      const otherNightRole = otherNightRoles[i];
      const firstNightRoleName = firstNightRole?.role
        ? firstNightRole?.role.name
        : firstNightRole?.name;
      const otherNightRoleName = otherNightRole?.role
        ? otherNightRole?.role.name
        : otherNightRole?.name;

      const roleNotWaking = rolesNotWaking[i];

      const row: RowType = {
        id: "fn-" + firstNightRoleName + "-" + otherNightRoleName,
        firstNight: firstNightRoleName,
        otherNight: otherNightRoleName,
        notWaking: roleNotWaking?.name,

        renderJSX: {
          firstNight: firstNightRole?.role
            ? getUserRole(firstNightRole.role)
            : null,
          otherNight: otherNightRole?.role
            ? getUserRole(otherNightRole.role)
            : null,
          notWaking: roleNotWaking ? getUserRole(roleNotWaking) : null,
        },
        popoverContent: {
          firstNight: firstNightRole?.role
            ? getPopoverContent(firstNightRole.role)
            : null,
          otherNight: otherNightRole?.role
            ? getPopoverContent(otherNightRole.role)
            : null,
          notWaking: roleNotWaking ? getPopoverContent(roleNotWaking) : null,
        },
      };
      result.push(row);
    }
    return result;
  }

  const colNightSheet: GenericTableColumnProps[] = [
    { key: "firstNight", name: "Première nuit", isDefaultVisible: true },
    { key: "otherNight", name: "Autres nuits", isDefaultVisible: true },
    { key: "notWaking", name: "Ne se réveillent pas" },
  ];

  const DropdownEditions = isLoadingEditions
    ? () => <Spinner />
    : () => (
        <div className="flex">
          <Dropdown type="menu">
            <DropdownTrigger>
              <Button className="w-auto" variant="flat">
                {selectedEdition === "all"
                  ? "Tous les rôles"
                  : editions.find((e) => e.id === +selectedEdition)?.name}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              onAction={(key: string | number) => setSelectedEdition(key)}
            >
              {[{ id: "all", name: "--Tous les rôles--" }, ...editions].map(
                (edition: { id: string | number; name: string }) => (
                  <DropdownItem key={edition.id}>{edition.name}</DropdownItem>
                )
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      );

  return (
    <div className="flex flex-col text-start">
      <DropdownEditions />
      <Spacer y={2} />
      <GenericTable
        columns={colNightSheet}
        rows={getNightSheet(
          officialNightSheet?.firstNight,
          officialNightSheet?.otherNight
        )}
      />
    </div>
  );
}
