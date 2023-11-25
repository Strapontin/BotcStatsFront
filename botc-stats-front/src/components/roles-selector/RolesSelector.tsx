import { Role } from "@/entities/Role";
import { Spacer } from "@nextui-org/react";
import AutocompleteRoles from "./AutocompleteRoles";
import ListboxRolesComponent from "../list-stats/ListboxRolesComponent";

export default function RolesSelector({
  selectedRoles,
  setSelectedRoles,
  placeholderText,
  roles,
}: {
  selectedRoles: Role[];
  setSelectedRoles: any;
  placeholderText: string;
  roles: Role[];
}) {
  return (
    <>
      <ListboxRolesComponent
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
      />
      {selectedRoles.some((r) => r) && <Spacer y={1} />}
      <AutocompleteRoles
        roles={roles}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
        autocompletePlaceholder={placeholderText}
      ></AutocompleteRoles>
    </>
  );
}
