import DropdownCharacterType from "@/components/dropdowns/DropdownCharacterType";
import { Role } from "@/entities/Role";
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
        onChange={(event) => setRole({ ...role, name: event.target.value })}
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
        setCharacterType={(characterType: CharacterType) =>
          setRole({ ...role, characterType })
        }
        characterType={role.characterType}
        defaultText="Type de personnage"
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
