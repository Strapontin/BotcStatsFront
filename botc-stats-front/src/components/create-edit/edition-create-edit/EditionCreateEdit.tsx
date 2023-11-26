import RolesSelector from "@/components/roles-selector/RolesSelector";
import { Edition } from "@/entities/Edition";
import { Role } from "@/entities/Role";
import { stringsAreEqual } from "@/helper/string";
import { Button, Input, Spacer } from "@nextui-org/react";

export default function EditionCreateEdit({
  title,
  edition,
  setEdition,
  editions,
  btnPressed,
  btnText,
  roles,
  isLoadingRoles,
}: {
  title: JSX.Element;
  edition: Edition;
  setEdition: any;
  editions: Edition[];
  btnPressed: any;
  btnText: string;
  roles: Role[];
  isLoadingRoles?: boolean;
}) {
  const editionNameIsInvalid = editions?.some(
    (p) => p.id !== edition.id && stringsAreEqual(p.name, edition.name)
  );

  function editionNameChanged(editionName: string) {
    setEdition({ ...edition, name: editionName });
  }

  function rolesInEditionChanged(roles: Role[]) {
    setEdition({ ...edition, roles: roles });
  }

  function getExistingEditionName() {
    return editions.find((e) => stringsAreEqual(e.name, edition.name))?.name;
  }

  return (
    <>
      {title}
      <Spacer y={4} />
      <Input
        label="Nom"
        aria-label="Nom"
        value={edition.name}
        onChange={(event: { target: { value: string } }) =>
          editionNameChanged(event.target.value)
        }
        isRequired
        isInvalid={editionNameIsInvalid}
        errorMessage={
          editionNameIsInvalid
            ? `Le module '${getExistingEditionName()}' existe déjà`
            : ""
        }
      />
      <Spacer y={3} />
      <RolesSelector
        selectedRoles={edition.roles}
        setSelectedRoles={rolesInEditionChanged}
        autocompleteLabel="Rôles"
        roles={roles}
        isLoadingRoles={isLoadingRoles}
      />
      <Spacer y={3} />

      <Button
        color="success"
        onPress={btnPressed}
        isDisabled={editionNameIsInvalid || !edition.name}
      >
        {btnText}
      </Button>
      <Spacer y={3} />
    </>
  );
}
