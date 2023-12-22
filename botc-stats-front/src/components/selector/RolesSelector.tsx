import { Role } from "@/entities/Role";
import { Spacer } from "@nextui-org/react";
import AutocompleteRoles from "../autocompletes/AutocompleteRoles";
import ListboxRolesComponent from "../listbox/ListboxRolesComponent";

export default function RolesSelector({
  selectedRoles,
  setSelectedRoles,
  autocompleteLabel,
  roles,
  isLoadingRoles,
}: {
  selectedRoles: Role[];
  setSelectedRoles: any;
  autocompleteLabel: string;
  roles: Role[];
  isLoadingRoles?: boolean;
}) {
  return (
    <>
      <ListboxRolesComponent
        roles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
        showDelete
      />
      {selectedRoles.some((r) => r) && <Spacer y={1} />}
      <AutocompleteRoles
        roles={roles}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
        autocompleteLabel={autocompleteLabel}
        isLoading={isLoadingRoles}
        multipleSelection
        autoRefocus
      />
    </>
  );
}
