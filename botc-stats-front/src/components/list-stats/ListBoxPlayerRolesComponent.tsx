import { PlayerRole } from "@/entities/PlayerRole";
import { Listbox, ListboxItem } from "@nextui-org/react";
import IconAlignment from "../ui/icon-alignment";
import ImageIconName from "../ui/image-role-name";

export default function ListBoxPlayerRolesComponent({
  playerRoleGames,
}: {
  playerRoleGames: PlayerRole[];
}) {
  return (
    <Listbox aria-label="ListBoxPlayerRolesComponent">
      {playerRoleGames.map((prg: PlayerRole, index) => (
        <ListboxItem
          key={`${prg.player.id}-${prg.role.id}-${index}`}
          href={`/players/${prg.player.id}`}
          classNames={{title:"flex justify-end"}}
          startContent={
            <div className="flex flex-col items-start">
              <span>{prg.player.name}</span>
              <span className="text-default-400 text-sm">
                {prg.player.pseudo}
              </span>
            </div>
          }
          endContent={
            <IconAlignment editable={true} alignment={prg.finalAlignment} />
          }
          textValue={`${prg.player.name} ${prg.role.name} ${prg.finalAlignment}`}
        >
          <ImageIconName
            name={prg.role.name}
            characterType={prg.role.characterType}
          />
        </ListboxItem>
      ))}
    </Listbox>
  );
}
