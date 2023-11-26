import { PlayerRole } from "@/entities/PlayerRole";
import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import IconAlignment from "../ui/icon-alignment";
import ImageIconName from "../ui/image-role-name";
import { X } from "react-feather";

export default function ListBoxPlayerRolesComponent({
  playerRoles,
  setSelectedPlayerRoles,
  showBtnDelete,
}: {
  playerRoles: PlayerRole[];
  setSelectedPlayerRoles?: any;
  showBtnDelete?: boolean;
}) {
  function onClickRemovePlayerRole(
    playerId: number,
    roleId: number,
    index: number
  ) {
    setSelectedPlayerRoles(
      playerRoles.filter(
        (playerRole, i) =>
          playerRole.player.id !== playerId &&
          playerRole.role.id !== roleId &&
          index !== i
      )
    );
  }

  return (
    <Listbox aria-label="ListBoxPlayerRolesComponent">
      {playerRoles.map((playerRole: PlayerRole, index) => (
        <ListboxItem
          key={`${playerRole.player.id}-${playerRole.role.id}-${index}`}
          // href={`/players/${playerRole.player.id}`} TODO : Mettre un popover pour proposer à l'utilisateur de se rendre sur la page des détails de l'utilisateur sur lequel il a cliqué
          classNames={{ title: "flex justify-end" }}
          startContent={
            <div className="flex flex-col items-start">
              <span>{playerRole.player.name}</span>
              <span className="text-default-400 text-sm">
                {playerRole.player.pseudo}
              </span>
            </div>
          }
          textValue={`${playerRole.player.name} ${playerRole.role.name} ${playerRole.finalAlignment}`}
          endContent={
            showBtnDelete ? (
              <Button
                onClick={() =>
                  onClickRemovePlayerRole(
                    playerRole.player.id,
                    playerRole.role.id,
                    index
                  )
                }
                isIconOnly
                color="danger"
                aria-label="delete"
                variant="flat"
              >
                <X />
              </Button>
            ) : (
              <></>
            )
          }
        >
          <div className="flex items-center">
            <ImageIconName
              name={playerRole.role.name}
              characterType={playerRole.role.characterType}
            />
            <IconAlignment
              editable={true}
              alignment={playerRole.finalAlignment}
            />
          </div>
        </ListboxItem>
      ))}
    </Listbox>
  );
}
