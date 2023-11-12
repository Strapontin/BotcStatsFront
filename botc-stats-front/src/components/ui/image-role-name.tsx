import Image from "next/image";
import RoleColored from "./role-colored";
import { CharacterType } from "@/entities/enums/characterType";
import { removeDiacritics } from "../../helper/string";
import classes from "./image-role-name.module.scss";

export default function ImageIconName(props: {
  name: string;
  characterType: CharacterType;
  setNameAtLeftOfImage?: boolean;
}) {
  const imgPath = getRoleIconPath(props.name);

  if (props.setNameAtLeftOfImage) {
    return (
      <div className={classes["image-role-container"]}>
        <Image width={50} height={50} src={imgPath} alt={props.name} />
        <RoleColored name={props.name} characterType={props.characterType} />
      </div>
    );
  } else {
    return (
      <div className={classes["image-role-container"]}>
        <RoleColored name={props.name} characterType={props.characterType} />
        <Image width={50} height={50} src={imgPath} alt={props.name} />
      </div>
    );
  }
}

export function getRoleIconPath(roleName: string) {
  const imgFileName = removeDiacritics(roleName)
    .replaceAll(" ", "-")
    .replaceAll("'", "");
  const imgPath = `/images/roles-icons/${imgFileName.toLocaleLowerCase()}.png`;

  return imgPath;
}
