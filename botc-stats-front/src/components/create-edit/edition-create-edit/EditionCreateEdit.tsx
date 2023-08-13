import { Edition } from "@/entities/Edition";
import { Fragment, useEffect, useState } from "react";
import { Button, Container, Input, Spacer, Textarea } from "@nextui-org/react";
import { Role } from "@/entities/Role";
import { getAllEditions } from "../../../../data/back-api/back-api";
import { toLowerRemoveDiacritics } from "@/helper/string";
import RolesSelector from "@/components/roles-selector/RolesSelector";

export default function EditionCreateEdit(props: {
  title: JSX.Element;
  edition: Edition;
  setEdition: any;
  message: JSX.Element;
  btnPressed: any;
  btnText: string;
}) {
  function editionNameChanged(editionName: string) {
    const newEdition = { ...props.edition, name: editionName };
    props.setEdition(newEdition);
  }

  function rolesInEditionChanged(roles: Role[]) {
    const newEdition = { ...props.edition, roles: roles };
    props.setEdition(newEdition);
  }

  function canPressButton() {
    if (props.edition.name === "") {
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
          initialValue={props.edition.name}
          onChange={(event) => editionNameChanged(event.target.value)}
        />
        <Spacer y={3} />
        <RolesSelector
          selectedRoles={props.edition.roles}
          setSelectedRoles={rolesInEditionChanged}
          placeholderText="Rôles"
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
