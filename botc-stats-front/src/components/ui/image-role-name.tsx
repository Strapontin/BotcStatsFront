import { Role } from "@/entities/Role";
import { CharacterType } from "@/entities/enums/characterType";
import { Avatar, User } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { toLowerRemoveDiacritics } from "../../helper/string";

export function RoleImageName(props: {
  name: string;
  characterType: CharacterType;
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

  return (
    <div className="flex items-center">
      {props.name}
      {image}
    </div>
  );
}

function getRoleImgName(roleName: string): string {
  const roleImgName = toLowerRemoveDiacritics(
    roleName.replaceAll("'", "-")
  ).replaceAll(" ", "-");
  return roleImgName;
}

export function getWikiLinkrole(roleName: string): string {
  return `https://brain-academy.github.io/botc-wiki/docs/roles/${getRoleImgName(
    roleName
  )}`;
}

export function getRoleIconPath(roleName: string): string {
  const imgFileName = getRoleImgName(roleName);
  const imgPath = `/images/roles-icons/${imgFileName}.png`;

  return imgPath;
}

export function getCssClassesFromCharacterType(characterType: CharacterType): {
  headerClass: string;
  ringColorClass: string;
} {
  let headingAutocompleteClasses =
    "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small text-slate-800 text-sm font-bold";
  let ringColorClass;

  switch (characterType) {
    case CharacterType.Townsfolk:
      headingAutocompleteClasses =
        headingAutocompleteClasses + " text-slate-700 bg-townsfolk";
      ringColorClass = "ring-townsfolk";
      break;
    case CharacterType.Outsider:
      headingAutocompleteClasses =
        headingAutocompleteClasses + " text-slate-300 bg-outsider";
      ringColorClass = "ring-outsider";
      break;
    case CharacterType.Minion:
      headingAutocompleteClasses =
        headingAutocompleteClasses + " text-slate-300 bg-minion";
      ringColorClass = "ring-minion";
      break;
    case CharacterType.Demon:
      headingAutocompleteClasses =
        headingAutocompleteClasses + " text-slate-300 bg-demon";
      ringColorClass = "ring-demon";
      break;
    case CharacterType.Fabled:
      headingAutocompleteClasses =
        headingAutocompleteClasses + " text-slate-300 bg-fabled";
      ringColorClass = "ring-fabled";
      break;
    case CharacterType.Traveller:
      headingAutocompleteClasses =
        headingAutocompleteClasses + " text-slate-300 bg-traveller";
      ringColorClass = "ring-traveller";
      break;

    default:
      ringColorClass = "";
      break;
  }

  return {
    headerClass: headingAutocompleteClasses,
    ringColorClass: ringColorClass,
  };
}

export function getAvatarRole(role: Role) {
  return (
    <Avatar
      isBordered
      classNames={{
        base: getCssClassesFromCharacterType(role.characterType).ringColorClass,
      }}
      radius="sm"
      size="sm"
      src={getRoleIconPath(role.name)}
    />
  );
}

export function getUserRole(role: Role) {
  return (
    <div className="flex text-left">
      <User
        name={role.name}
        avatarProps={{
          isBordered: true,
          src: `${getRoleIconPath(role.name)}`,
          radius: "sm",
          size: "sm",
          classNames: {
            base:
              getCssClassesFromCharacterType(role.characterType)
                .ringColorClass + " flex-none",
          },
        }}
      />
    </div>
  );
}
