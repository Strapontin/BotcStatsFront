import { Player } from "@/entities/Player";
import { PlayerRole } from "@/entities/PlayerRole";
import { Alignment } from "@/entities/enums/alignment";
import {
  Button,
  Listbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { X } from "react-feather";
import {
  getListboxItemPlayerDetails,
  getListboxItemRoleDetails,
  getListboxItemRoleWikiLink,
} from "../table/generic-table/popover/listbox-items";
import IconAlignment from "../ui/icon-alignment";
import { RoleImageName } from "../ui/image-role-name";

export default function ListboxPlayerRolesComponent({
  playerRoles,
  setSelectedPlayerRoles,
  showBtnDelete,
}: {
  playerRoles: PlayerRole[];
  setSelectedPlayerRoles?: any;
  showBtnDelete?: boolean;
}) {
  const router = useRouter();

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

  const ListboxItemStartContent = ({ player }: { player: Player }) => (
    <div className="flex flex-col items-start">
      <span>{player.name}</span>
      <span className="text-default-400 text-sm">{player.pseudo}</span>
    </div>
  );

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

  function getPopoverContent(playerRole: PlayerRole) {
    return (
      <Listbox aria-label="popover-items">
        {getListboxItemPlayerDetails(playerRole.player, router)}
        {getListboxItemRoleDetails(playerRole.role, router)}
        {getListboxItemRoleWikiLink(playerRole.role, router)}
      </Listbox>
    );
  }

  return (
    <div className="px-1">
      {playerRoles.map((playerRole: PlayerRole, index) => {
        const iconAlignment = (
          <IconAlignment
            editable={true}
            alignment={playerRole.finalAlignment}
          />
        );

        return (
          <Popover
            key={`${playerRole.player.id}-${playerRole.role.id}-${index}`}
            showArrow
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
                <ListboxItemStartContent player={playerRole.player} />
                <div className="flex items-center">
                  <RoleImageName
                    name={playerRole.role.name}
                    characterType={playerRole.role.characterType}
                  />
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
            <PopoverContent>{getPopoverContent(playerRole)}</PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
}
