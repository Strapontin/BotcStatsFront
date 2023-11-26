import { Role } from "@/entities/Role";
import { Spacer } from "@nextui-org/react";
import { Fragment } from "react";
import ListItemRole from "../list-stats/ListItemRole";
import AutocompleteRoles from "./AutocompleteRoles";
import ListboxSelectedRoles from "./ListboxSelectedRoles";

export default function RolesSelector(props: {
  selectedRoles: Role[];
  setSelectedRoles: any;
  placeholderText: string;
  roles: Role[];
}) {
  return (
    <>
      <ListboxSelectedRoles
        selectedRoles={props.selectedRoles}
        setSelectedRoles={props.setSelectedRoles}
      />
      {props.selectedRoles.some((r) => r) && <Spacer y={1} />}
      <AutocompleteRoles
        roles={props.roles}
        selectedRoles={props.selectedRoles}
        setSelectedRoles={props.setSelectedRoles}
        placeholder={props.placeholderText}
      ></AutocompleteRoles>
    </>
  );
}
