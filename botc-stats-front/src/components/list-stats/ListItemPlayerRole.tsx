import { CharacterType } from "@/entities/enums/characterType";
import classes from "./ListItem.module.css";
import { Text } from "@nextui-org/react";
import ListItem from "./ListItem";
import ImageIconName from "../ui/image-icon-name";

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
      name={props.playerName}
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
