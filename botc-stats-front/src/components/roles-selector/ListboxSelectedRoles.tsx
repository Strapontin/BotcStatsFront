import { Role, sortRoles } from "@/entities/Role";
import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import { X } from "react-feather";
import { getAvatarRole } from "../ui/image-role-name";

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
