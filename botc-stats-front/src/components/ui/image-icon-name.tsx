import { Image } from "@nextui-org/react";
import RoleColored from "./role-colored";
import { CharacterType } from "@/entities/enums/characterType";
import { removeDiacritics } from "../../helper/string";

export default function ImageIconName(props: {
  name: string;
  characterType: CharacterType;
  setNameAtLeftOfImage?: boolean;
}) {
  const imgFileName = removeDiacritics(props.name)
    .replaceAll(" ", "-")
    .replaceAll("'", "");
  const imgPath = `/images/roles-icons/${imgFileName}.png`;

  var roleName = props.name;

  if (props.setNameAtLeftOfImage) {
    return (
      <div className="flex ai-center">
        <Image width={50} height={50} src={imgPath} alt={props.name} />
        <RoleColored name={roleName} characterType={props.characterType} />
      </div>
    );
  } else {
    return (
      <div className="flex ai-center">
        <RoleColored name={roleName} characterType={props.characterType} />
        <Image width={50} height={50} src={imgPath} alt={props.name} />
      </div>
    );
  }
}
