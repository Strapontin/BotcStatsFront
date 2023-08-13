import { CharacterType } from "@/entities/enums/characterType";
import { Text } from "@nextui-org/react";

export default function RoleColored(props: {
  name: string;
  characterType: CharacterType;
}) {
  return (
    <Text b className={CharacterType[props.characterType].toLowerCase()}>
      {props.name}
    </Text>
  );
}
