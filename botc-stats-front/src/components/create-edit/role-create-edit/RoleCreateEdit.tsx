import { Role } from "@/entities/Role";
import { Fragment, useEffect, useState } from "react";
import { Button, Container, Input, Spacer, Textarea } from "@nextui-org/react";
import DropdownCharacterType from "@/components/dropdown-character-type/DropdownCharacterType";
import DropdownAlignment from "@/components/dropdown-alignment/DropdownAlignment";
import { CharacterType } from "@/entities/enums/characterType";
import { Alignment } from "@/entities/enums/alignment";

export default function RoleCreateEdit(props: {
  title: JSX.Element;
  role: Role;
  setRole: any;
  message: JSX.Element;
  btnPressed: any;
  btnText: string;
}) {
  function roleNameChanged(roleName: string) {
    const newRole = { ...props.role, name: roleName };
    props.setRole(newRole);
  }

  function characterTypeChanged(characterType: CharacterType) {
    const newRole = { ...props.role, characterType };
    props.setRole(newRole);
  }

  function alignmentChanged(alignment: Alignment) {
    const newRole = { ...props.role, alignment };
    props.setRole(newRole);
  }

  function canPressButton() {
    if (props.role.name === "") {
      return false;
    }
    return true;
  }

  return (
    <Fragment>
      {props.title}
      <Spacer y={2} />
      {props.message}
      <Spacer y={2} />
      <Container fluid css={{ display: "flex", flexDirection: "column" }}>
        <Input
          clearable
          bordered
          labelPlaceholder="Nom"
          aria-label="Nom"
          initialValue={props.role.name}
          onChange={(event) => roleNameChanged(event.target.value)}
        />
        <Spacer y={1.75} />
        <DropdownCharacterType
          setCharacterType={characterTypeChanged}
          characterType={props.role.characterType}
          defaultText="Type de personnage"
        />
        <Spacer y={1.75} />
        <DropdownAlignment
          setAlignment={alignmentChanged}
          alignment={props.role.alignment}
          defaultText="Alignement"
        />
        <Spacer y={3} />
      </Container>

      <Button
        shadow
        ghost
        color="success"
        onPress={props.btnPressed}
        disabled={!canPressButton()}
      >
        {props.btnText}
      </Button>
      <Spacer y={3} />
    </Fragment>
  );
}
