import { Player } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Role } from "@/entities/Role";
import { Alignment } from "@/entities/enums/alignment";
import {
  Button,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { X } from "react-feather";
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
  playerRole,
  playerRoleSelected,
  showBtnDelete,
  deleteClicked,
}: {
  playerRole: PlayerRole;
  playerRoleSelected?: (playerRole: PlayerRole) => void;
  showBtnDelete: boolean;
  deleteClicked?: () => void;
}) {
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

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={[
            "flex",
            "items-center",
            "justify-between",
            "px-1.5",
            "py-0.5",
            "cursor-pointer",
            //   index < playerRoles.length - 1 && "border-b-1",
            "border-zinc-800",
          ].join(" ")}
        >
          {playerRole.player ? (
            <div className="flex flex-col items-start flex-auto basis-0">
              <span>{playerRole.player.name}</span>
              <span className="text-default-400 text-sm">
                {playerRole.player.pseudo}
              </span>
            </div>
          ) : (
            <AutocompletePlayer
              setSelectedPlayer={(p: Player) => {
                playerRoleSelected!({ ...playerRole, player: p });
              }}
              autocompleteLabel="Joueur"
              canAddNewPlayer
            />
          )}

          {playerRole.role ? (
            <div className="flex items-center">
              {playerRole.role ? (
                <RoleImageName role={playerRole?.role} />
              ) : (
                <></>
              )}
              <RoleAlignment />
              {showBtnDelete ? (
                <Button
                  className="ml-1"
                  onClick={() => {
                    deleteClicked && deleteClicked();
                  }}
                  isIconOnly
                  color="danger"
                  aria-label="delete"
                  variant="flat"
                >
                  <X />
                </Button>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <AutocompleteRoles
              selectedRoles={[]}
              setSelectedRoles={(r: Role) => {
                playerRoleSelected!({ ...playerRole, role: playerRole.role });
              }}
              autocompleteLabel="Rôle"
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Listbox aria-label="popover-items">
          <ListboxItem
            key="delete-player"
            textValue="delete-player"
            onClick={() => {
              console.log("deletePlayer", { ...playerRole, player: undefined });
              playerRoleSelected!({ ...playerRole, player: undefined });
            }}
          >
            Supprimer le joueur
          </ListboxItem>
          <ListboxItem key="delete-role" textValue="delete-role" showDivider>
            Supprimer le rôle
          </ListboxItem>
          {getListboxItemPlayerDetails(playerRole.player)}
          {getListboxItemRoleDetails(playerRole.role)}
          {getListboxItemRoleWikiLink(playerRole.role)}
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}
