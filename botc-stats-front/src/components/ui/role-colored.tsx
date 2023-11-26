import { CharacterType } from "@/entities/enums/characterType";

export default function RoleColored(props: {
  name: string;
  characterType: CharacterType;
}) {
  return (
    <span
      className={
        CharacterType[props.characterType].toLowerCase() + " font-bold" 
      }
    >
      {props.name}
    </span>
  );
}
