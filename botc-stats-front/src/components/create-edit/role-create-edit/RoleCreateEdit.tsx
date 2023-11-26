import DropdownAlignment from "@/components/dropdown-alignment/DropdownAlignment";
import DropdownCharacterType from "@/components/dropdown-character-type/DropdownCharacterType";
import { Role } from "@/entities/Role";
import { Alignment } from "@/entities/enums/alignment";
import { CharacterType } from "@/entities/enums/characterType";
import { Button, Input, Spacer } from "@nextui-org/react";

export default function RoleCreateEdit(props: {
  title: JSX.Element;
  role: Role;
  setRole: any;
  roles: Role[];
  btnPressed: any;
  btnText: string;
}) {
  function roleNameChanged(roleName: string) {
    const newRole = { ...props.role, name: roleName };
    props.setRole(newRole);
  }

  function characterTypeChanged(characterType: CharacterType) {
    let alignment = props.role.alignment;

    switch (characterType) {
      case CharacterType.Townsfolk:
      case CharacterType.Outsider:
        alignment = Alignment.Good;
        break;
      case CharacterType.Minion:
      case CharacterType.Demon:
        alignment = Alignment.Evil;
        break;
    }

    const newRole = { ...props.role, characterType, alignment };
    props.setRole(newRole);
  }

  function alignmentChanged(alignment: Alignment) {
    const newRole = { ...props.role, alignment };
    props.setRole(newRole);
  }

  function canPressButton() {
    return (
      props.role.name !== "" &&
      props.role.characterType !== CharacterType.None &&
      props.role.alignment !== Alignment.None
    );
  }

  return (
    <>
      {props.title}
      <Spacer y={4} />
      <Input
        label="Nom"
        aria-label="Nom"
        value={props.role.name}
        onChange={(event) => roleNameChanged(event.target.value)}
        isRequired
      />
      <Spacer y={1.5} />
      <DropdownCharacterType
        setCharacterType={characterTypeChanged}
        characterType={props.role.characterType}
        defaultText="Type de personnage"
      />
      <Spacer y={1.5} />
      <DropdownAlignment
        setAlignment={alignmentChanged}
        alignment={props.role.alignment}
        defaultText="Alignement"
      />
      <Spacer y={3} />

      <Button
        color="success"
        onPress={props.btnPressed}
        isDisabled={!canPressButton()}
      >
        {props.btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
