import { Role, sortRoles } from "@/entities/Role";
import {
  Button,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  select,
} from "@nextui-org/react";
import { getAvatarRole } from "../ui/image-role-name";
import { X } from "react-feather";
import { useMemo } from "react";

export default function ListboxSelectedRoles({
  selectedRoles,
  setSelectedRoles,
}: {
  selectedRoles: Role[];
  setSelectedRoles: any;
}) {
  const sortedSelectedRoles = sortRoles(selectedRoles);

  function onClickRemoveRole(roleId: number) {
    setSelectedRoles(sortedSelectedRoles.filter((r) => r.id !== roleId));
  }

  return (
    <>
      <Listbox
        aria-label="Rôles sélectionnés"
        onAction={(key) => console.log(selectedRoles, key)}
      >
        {sortedSelectedRoles.map((role) => (
          <ListboxItem
            key={role.id}
            startContent={getAvatarRole(role)}
            endContent={
              <Button
                onClick={() => onClickRemoveRole(role.id)}
                isIconOnly
                color="danger"
                aria-label="delete"
              >
                <X />
              </Button>
            }
          >
            {role.name}
          </ListboxItem>
        ))}
      </Listbox>
    </>
  );
}
