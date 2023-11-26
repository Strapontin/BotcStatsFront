import {
  CharacterType,
  characterTypeList,
  getCharacterTypeTextById,
} from "@/entities/enums/characterType";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

export default function DropdownCharacterType(props: {
  setCharacterType: any;
  characterType: CharacterType;
  defaultText?: string;
}) {
  const characterTypeText = getCharacterTypeTextById(
    props.characterType,
    props.defaultText
  );

  function selectCharacterType(key: number) {
    props.setCharacterType(key);
  }

  return (
    <>
      <Dropdown type="menu">
        <DropdownTrigger>
          <Button className="w-full" variant="bordered">
            {characterTypeText}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Static Actions"
          onAction={(key) => selectCharacterType(+key)}
        >
          {characterTypeList().map((item) => (
            <DropdownItem key={item.key}>{item.value}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
