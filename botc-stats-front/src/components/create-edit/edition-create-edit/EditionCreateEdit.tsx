import RolesSelector from "@/components/roles-selector/RolesSelector";
import { Edition } from "@/entities/Edition";
import { Role } from "@/entities/Role";
import { stringsAreEqual } from "@/helper/string";
import { Button, Input, Spacer } from "@nextui-org/react";

export default function EditionCreateEdit(props: {
  title: JSX.Element;
  edition: Edition;
  setEdition: any;
  editions: Edition[];
  btnPressed: any;
  btnText: string;
  roles: Role[];
  isLoadingRoles?: boolean;
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
    return (
      props.edition.name !== "" &&
      !props.editions.some((e) => stringsAreEqual(e.name, props.edition.name))
    );
  }

  return (
    <>
      {props.title}
      <Spacer y={4} />
      <div>
        <Input
          label="Nom"
          aria-label="Nom"
          value={props.edition.name}
          onChange={(event: { target: { value: string } }) =>
            editionNameChanged(event.target.value)
          }
        />
        <Spacer y={3} />
        <RolesSelector
          selectedRoles={props.edition.roles}
          setSelectedRoles={rolesInEditionChanged}
          autocompleteLabel="Rôles"
          roles={props.roles}
          isLoadingRoles={props.isLoadingRoles}
        />
        <Spacer y={3} />
      </div>

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
