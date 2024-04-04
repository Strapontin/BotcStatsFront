import { useGetPlayers } from "@/data/back-api/back-api-player";
import { Player } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Alignment } from "@/entities/enums/alignment";
import {
  Button,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@nextui-org/react";
import { X } from "react-feather";
import AutocompletePlayer from "../autocompletes/AutocompletePlayer";
import {
  getListboxItemPlayerDetails,
  getListboxItemRoleDetails,
  getListboxItemRoleWikiLink,
} from "../table/generic-table/popover/listbox-items";
import IconAlignment from "../ui/icon-alignment";
import { RoleImageName } from "../ui/image-role-name";

export function ListboxPlayerRoleComponent({
  playerRoles,
  setSelectedPlayerRoles,
  showBtnDelete,
}: {
  playerRoles: PlayerRole[];
  setSelectedPlayerRoles?: any;
  showBtnDelete?: boolean;
}) {
  const { data: players, isLoading: isPlayersLoading } = useGetPlayers();

  function onClickRemovePlayerRole(playerRole: PlayerRole) {
    setSelectedPlayerRoles(playerRoles.filter((pr) => pr !== playerRole));
  }

  function switchAlignment(playerRole: PlayerRole) {
    if (!setSelectedPlayerRoles) return;

    const newPlayerRoles = playerRoles.map((pr) => {
      if (pr === playerRole) {
        pr.finalAlignment =
          pr.finalAlignment === Alignment.Good
            ? Alignment.Evil
            : Alignment.Good;
      }
      return pr;
    });
    setSelectedPlayerRoles(newPlayerRoles);
  }

  const ListboxItemStartContent = ({
    player,
    index,
  }: {
    player?: Player;
    index: number;
  }) => {
    if (!player) {
      return(
        <AutocompletePlayer
          setSelectedPlayer={(p: Player) => {
            // addPlayerRole(p, role);
            // setAutoFocus("Role");
          }}
          autocompleteLabel="Joueur"
          canAddNewPlayer
        />
      );
    }

    return (
      <div className="flex flex-col items-start flex-auto basis-0">
        <span>{player.name}</span>
        <span className="text-default-400 text-sm">{player.pseudo}</span>
      </div>
    );
  };

  const ListboxItemEndContent = ({ playerRole }: { playerRole: PlayerRole }) =>
    showBtnDelete ? (
      <Button
        className="ml-1"
        onClick={() => onClickRemovePlayerRole(playerRole)}
        isIconOnly
        color="danger"
        aria-label="delete"
        variant="flat"
      >
        <X />
      </Button>
    ) : (
      <></>
    );

  function getPopoverContent(playerRole: PlayerRole, index: number) {
    return (
      <Listbox aria-label="popover-items">
        <ListboxItem
          key="edit-player"
          textValue="edit-player"
          onClick={() => {
            playerRoles.map((pRole: PlayerRole, i) => {
              if (index === i) pRole.player = undefined;
            });
            setSelectedPlayerRoles(playerRoles);
          }}
        >
          Supprimer le joueur
        </ListboxItem>
        <ListboxItem key="edit-role" textValue="edit-role" showDivider>
          Supprimer le rôle
        </ListboxItem>
        {getListboxItemPlayerDetails(playerRole.player)}
        {getListboxItemRoleDetails(playerRole.role)}
        {getListboxItemRoleWikiLink(playerRole.role)}
      </Listbox>
    );
  }

  return (
    <div className="px-1">
      {playerRoles.map((playerRole: PlayerRole, index) => {
        const iconAlignment = (
          <IconAlignment editable alignment={playerRole.finalAlignment} />
        );

        return (
          <Popover
            key={`${playerRole?.player?.id}-${playerRole?.role?.id}-${index}`}
            showArrow
            shouldCloseOnBlur
          >
            <PopoverTrigger>
              <div
                className={[
                  "flex",
                  "items-center",
                  "justify-between",
                  "px-1.5",
                  "py-0.5",
                  "cursor-pointer",
                  index < playerRoles.length - 1 && "border-b-1",
                  "border-zinc-800",
                ].join(" ")}
              >
                <ListboxItemStartContent
                  player={playerRole?.player}
                  index={index}
                />
                <div className="flex items-center">
                  {playerRole.role ? (
                    <RoleImageName role={playerRole?.role} />
                  ) : (
                    <></>
                  )}
                  {(setSelectedPlayerRoles && (
                    <Button
                      variant="light"
                      onClick={() => switchAlignment(playerRole)}
                      disableRipple={setSelectedPlayerRoles === undefined}
                      isIconOnly
                    >
                      {iconAlignment}
                    </Button>
                  )) || <>{iconAlignment}</>}
                  <ListboxItemEndContent playerRole={playerRole} />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              {getPopoverContent(playerRole, index)}
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
