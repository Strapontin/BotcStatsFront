import RolesSelector from "@/components/roles-selector/RolesSelector";
import { Edition } from "@/entities/Edition";
import { Role } from "@/entities/Role";
import { Button, Input, Spacer } from "@nextui-org/react";
import { Fragment } from "react";

export default function EditionCreateEdit(props: {
  title: JSX.Element;
  edition: Edition;
  setEdition: any;
  message: JSX.Element;
  btnPressed: any;
  btnText: string;
  roles: Role[];
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
      <div>
        <Input
          label="Nom"
          aria-label="Nom"
          value={props.edition.name}
          onChange={(event) => editionNameChanged(event.target.value)}
        />
        <Spacer y={3} />
        <RolesSelector
          selectedRoles={props.edition.roles}
          setSelectedRoles={rolesInEditionChanged}
          placeholderText="Rôles"
          roles={props.roles}
        />
        <Spacer y={3} />
      </div>

      <Button
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
