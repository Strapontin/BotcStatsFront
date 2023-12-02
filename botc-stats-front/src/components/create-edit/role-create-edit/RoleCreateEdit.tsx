import DropdownAlignment from "@/components/dropdowns/DropdownAlignment";
import DropdownCharacterType from "@/components/dropdowns/DropdownCharacterType";
import { Role } from "@/entities/Role";
import { Alignment } from "@/entities/enums/alignment";
import { CharacterType } from "@/entities/enums/characterType";
import { stringsAreEqual } from "@/helper/string";
import { Button, Input, Spacer } from "@nextui-org/react";

export default function RoleCreateEdit({
  title,
  role,
  setRole,
  roles,
  btnPressed,
  btnText,
}: {
  title: JSX.Element;
  role: Role;
  setRole: any;
  roles: Role[];
  btnPressed: any;
  btnText: string;
}) {
  const roleNameIsInvalid = roles?.some(
    (p) => p.id !== role.id && stringsAreEqual(p.name, role.name)
  );

  function roleNameChanged(roleName: string) {
    setRole({ ...role, name: roleName });
  }

  function characterTypeChanged(characterType: CharacterType) {
    let alignment = role.alignment;

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

    setRole({ ...role, characterType, alignment });
  }

  function alignmentChanged(alignment: Alignment) {
    setRole({ ...role, alignment });
  }

  function getExistingRoleName() {
    return roles.find((r) => stringsAreEqual(r.name, role.name))?.name;
  }

  return (
    <>
      {title}
      <Spacer y={4} />
      <Input
        label="Nom"
        aria-label="Nom"
        value={role.name}
        onChange={(event) => roleNameChanged(event.target.value)}
        isRequired
        isInvalid={roleNameIsInvalid}
        errorMessage={
          roleNameIsInvalid
            ? `Le rôle '${getExistingRoleName()}' existe déjà`
            : ""
        }
      />
      <Spacer y={1.5} />
      <DropdownCharacterType
        setCharacterType={characterTypeChanged}
        characterType={role.characterType}
        defaultText="Type de personnage"
      />
      <Spacer y={1.5} />
      <DropdownAlignment
        setAlignment={alignmentChanged}
        alignment={role.alignment}
        defaultText="Alignement"
      />
      <Spacer y={3} />

      <Button
        color="success"
        onPress={btnPressed}
        isDisabled={roleNameIsInvalid || !role.name}
      >
        {btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
