import { PlayerRole } from "@/entities/PlayerRole";
import IconAlignment from "../ui/icon-alignment";
import ImageIconName from "../ui/image-role-name";
import ListItem from "./ListItem";

export default function ListItemPlayerRole({
  playerRole,
  iconAlignmentClicked,
}: {
  playerRole: PlayerRole;
  iconAlignmentClicked?: () => void;
}) {
  return (
    <ListItem
      left={playerRole.player.name}
      subName={playerRole.player.pseudo}
      value={
        <>
          <ImageIconName
            name={playerRole.role.name}
            characterType={playerRole.role.characterType}
          />
          <div onClick={iconAlignmentClicked}>
            <IconAlignment
              editable={true}
              alignment={playerRole.finalAlignment}
            />
          </div>
        </>
      }
    />
  );
}
