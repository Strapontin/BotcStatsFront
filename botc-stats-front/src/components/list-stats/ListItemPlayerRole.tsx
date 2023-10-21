import { CharacterType } from "@/entities/enums/characterType";
import ImageIconName from "../ui/image-role-name";
import ListItem from "./ListItem";

export default function ListItemPlayerRole(props: {
  playerName: string;
  pseudo?: string;
  roleName: string;
  characterType: CharacterType;
  onPress?: any;
}) {
  var timeStamp: number;

  function onTouchStart(e: any) {
    timeStamp = e.timeStamp;
  }

  function onTouchMove(e: any) {
    timeStamp = NaN;
  }

  function onTouchEnd(e: any) {
    if (e.timeStamp - timeStamp < 500) {
      props.onPress();
    }
  }

  return (
    <ListItem
      left={props.playerName}
      subName={props.pseudo}
      value={
        <ImageIconName
          name={props.roleName}
          characterType={props.characterType}
        />
      }
    />
  );
}
