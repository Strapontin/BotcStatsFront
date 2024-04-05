import { Player } from "@/entities/Player";
import { PlayerRole, getNewEmptyPlayerRole } from "@/entities/PlayerRole";
import { Role, getDefaultAlignmentFromRole } from "@/entities/Role";
import { Alignment } from "@/entities/enums/alignment";
import {
  Button,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { Menu } from "react-feather";
import AutocompletePlayer from "../autocompletes/AutocompletePlayer";
import AutocompleteRoles from "../autocompletes/AutocompleteRoles";
import {
  getListboxItemPlayerDetails,
  getListboxItemRoleDetails,
  getListboxItemRoleWikiLink,
} from "../table/generic-table/popover/listbox-items";
import IconAlignment from "../ui/icon-alignment";
import { RoleImageName } from "../ui/image-role-name";

export function PlayerRoleItem({
  playerRole: propsPlayerRole,
  playerRoleSelected,
  deleteLine,
  propRoles,
}: {
  playerRole?: PlayerRole;
  playerRoleSelected?: (playerRole: PlayerRole) => void;
  deleteLine?: () => void;
  propRoles?: Role[];
}) {
  const playerRole = useMemo(
    () => propsPlayerRole ?? getNewEmptyPlayerRole(),
    [propsPlayerRole]
  );
  const [autocompletePlayerKey, setAutocompletePlayerKey] = useState(0);
  const [autocompleteRoleKey, setAutocompleteRoleKey] = useState(0);

  const RoleAlignment = () => {
    return (
      (playerRoleSelected && (
        <Button
          variant="light"
          onClick={() => {
            const newAlignment =
              playerRole.finalAlignment === Alignment.Evil
                ? Alignment.Good
                : Alignment.Evil;

            playerRoleSelected({
              ...playerRole,
              finalAlignment: newAlignment,
            });
          }}
          disableRipple={false}
          isIconOnly
        >
          <IconAlignment editable alignment={playerRole.finalAlignment} />
        </Button>
      )) || <IconAlignment editable alignment={playerRole.finalAlignment} />
    );
  };

  const PopoverPlayerRoleItem = () => (
    <Popover showArrow>
      <PopoverTrigger>
        <Button
          className="ml-1"
          aria-label="delete"
          color="primary"
          variant="flat"
          isIconOnly
        >
          <Menu />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Listbox
          aria-label="popover-items"
          disabledKeys={[
            playerRole.player ? "" : "delete-player",
            playerRole.role ? "" : "delete-role",
          ]}
        >
          <ListboxItem
            key="delete-player"
            textValue="delete-player"
            color="warning"
            onClick={() => {
              playerRoleSelected!({ ...playerRole, player: undefined });
            }}
          >
            Supprimer le joueur
          </ListboxItem>
          <ListboxItem
            key="delete-role"
            textValue="delete-role"
            color="warning"
            onClick={() => {
              playerRoleSelected!({ ...playerRole, role: undefined });
            }}
          >
            Supprimer le rôle
          </ListboxItem>
          <ListboxItem
            className={deleteLine ? "" : "hidden"}
            key="delete-line"
            textValue="delete-line"
            color="danger"
            showDivider={!!(playerRole.player || playerRole.role)}
            onClick={() => {
              deleteLine!();
            }}
          >
            Supprimer la ligne
          </ListboxItem>
          {getListboxItemPlayerDetails(playerRole.player)}
          {getListboxItemRoleDetails(playerRole.role)}
          {getListboxItemRoleWikiLink(playerRole.role)}
        </Listbox>
      </PopoverContent>
    </Popover>
  );

  return (
    <div
      className={[
        "flex",
        "items-center",
        "justify-between",
        "px-1.5",
        "py-0.5",
        "cursor-pointer",
        "[&:not(:last-child)]:border-b-1 border-zinc-800",
        "gap-2",
      ].join(" ")}
    >
      {playerRole.player ? (
        <div className="flex flex-col items-start text-left">
          <span>{playerRole.player.name}</span>
          <span className="text-default-400 text-sm">
            {playerRole.player.pseudo}
          </span>
        </div>
      ) : (
        playerRoleSelected && (
          <div className={propsPlayerRole ? "max-w-[40%]" : ""}>
            <AutocompletePlayer
              key={`player_${autocompletePlayerKey}`}
              setSelectedPlayer={(p: Player) => {
                playerRoleSelected!({ ...playerRole, player: p });
                setAutocompletePlayerKey((prev) => ++prev);
              }}
              autocompleteLabel="Joueur"
              canAddNewPlayer
              autocompleteSize="sm"
            />
          </div>
        )
      )}

      <div
        className={[
          "flex",
          "flex-auto",
          "justify-end",
          "items-center",
          playerRole.role ? "" : "max-w-[50%]",
        ].join(" ")}
      >
        {playerRole.role ? (
          <div className="flex items-center">
            {playerRole.role && <RoleImageName role={playerRole?.role} />}
            <RoleAlignment />
          </div>
        ) : (
          playerRoleSelected && (
            <div className={propsPlayerRole ? "" : ""}>
              <AutocompleteRoles
                key={`role_${autocompleteRoleKey}`}
                selectedRoles={[]}
                setSelectedRoles={(r: Role) => {
                  playerRoleSelected!({
                    player: playerRole.player,
                    role: r,
                    finalAlignment: getDefaultAlignmentFromRole(r),
                  });
                  setAutocompleteRoleKey((prev) => ++prev);
                }}
                autocompleteLabel="Rôle"
                autocompleteSize="sm"
                propRoles={propRoles}
              />
            </div>
          )
        )}
        {propsPlayerRole && playerRoleSelected && <PopoverPlayerRoleItem />}
      </div>
    </div>
  );
}
