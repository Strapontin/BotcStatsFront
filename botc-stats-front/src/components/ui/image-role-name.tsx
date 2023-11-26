import Image from "next/image";
import RoleColored from "./role-colored";
import { CharacterType } from "@/entities/enums/characterType";
import { removeDiacritics } from "../../helper/string";
import classes from "./image-role-name.module.scss";
import { useState } from "react";

export default function ImageIconName(props: {
  name: string;
  characterType: CharacterType;
  setNameAtLeftOfImage?: boolean;
}) {
  const imgPath = getRoleIconPath(props.name);

  const [hideImage, setHideImage] = useState(false);

  const image = !hideImage && (
    <Image
      width={50}
      height={50}
      src={imgPath}
      alt={props.name}
      onError={() => {
        setHideImage(true);
      }}
    />
  );

  if (props.setNameAtLeftOfImage) {
    return (
      <div className={classes["image-role-container"]}>
        {image}
        <RoleColored name={props.name} characterType={props.characterType} />
      </div>
    );
  } else {
    return (
      <div className={classes["image-role-container"]}>
        <RoleColored name={props.name} characterType={props.characterType} />
        {image}
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
