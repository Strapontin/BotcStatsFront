import { Role, sortRoles } from "@/entities/Role";
import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import { X } from "react-feather";
import { getAvatarRole } from "../ui/image-role-name";

export default function ListboxRolesComponent({
  selectedRoles,
  setSelectedRoles,
  hrefRoles,
  showDelete,
}: {
  selectedRoles: Role[];
  setSelectedRoles?: any;
  hrefRoles?: string;
  showDelete?: boolean;
}) {
  const sortedSelectedRoles = sortRoles(selectedRoles);

  function onClickRemoveRole(roleId: number) {
    setSelectedRoles(sortedSelectedRoles.filter((r) => r.id !== roleId));
  }

  return (
    <>
      <Listbox aria-label="Rôles sélectionnés">
        {sortedSelectedRoles.map((role) => (
          <ListboxItem
            key={role.id}
            startContent={getAvatarRole(role)}
            href={hrefRoles?.replace("ROLE_ID", String(role.id))}
            endContent={
              showDelete && (
                <Button
                  onClick={() => onClickRemoveRole(role.id)}
                  isIconOnly
                  color="danger"
                  aria-label="delete"
                  variant="flat"
                >
                  <X />
                </Button>
              )
            }
          >
            {role.name}
          </ListboxItem>
        ))}
      </Listbox>
    </>
  );
}
